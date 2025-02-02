import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { useUser } from "../context/UserContext";
import TourAutoComplete from "../components/TourAutoComplete";
import LocationAutoComplete from "../components/LocationAutoComplete";
import EventAutoComplete from "../components/EventAutoComplete";
import { Tour, LocationDetail, EventItem, CourseDetails } from "../components/Types";
import Card from "../components/defaultcard";
import { supabase } from "../services/supabaseClient";

const CreateGame: React.FC<{ theme: string }> = ({ theme }) => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<LocationDetail[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationDetail | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [eventName, setEventName] = useState<string>("");
    const [courseDetails, setCourseDetails] = useState<CourseDetails>({
        event_id: 0,
        course_name: "",
        address: ""
    });
    const [eventDate, setEventDate] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: toursData, error: toursError } = await supabase.from('tours').select('*');
                const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');
                const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');

                if (toursError || locationsError || eventsError) {
                    throw new Error("Error fetching data from Supabase");
                }

                setTours(toursData);
                setLocations(locationsData);
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrorMessage("Failed to load data.");
            }
        };

        fetchData();
    }, []);

    const handleCreateEvent = async () => {
        if (!selectedTour || !selectedLocation || !eventName || !courseDetails.course_name || !courseDetails.address || !eventDate) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            const { data: existingTour } = await supabase
                .from('tours')
                .select('*')
                .eq('tour_id', selectedTour.tour_id)
                .single();

            if (!existingTour) {
                const { error: tourError } = await supabase
                    .from('tours')
                    .insert([{ label: selectedTour.label, year: selectedTour.year }]);
                if (tourError) throw new Error("Failed to create tour");
            }

            const { data: existingLocation } = await supabase
                .from('locations')
                .select('*')
                .eq('location_id', selectedLocation.location_id)
                .single();

            if (!existingLocation) {
                const { error: locationError } = await supabase
                    .from('locations')
                    .insert([{ tour_id: selectedTour.tour_id, label: selectedLocation.label }]);
                if (locationError) throw new Error("Failed to create location");
            }

            // Create the event in the database
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .insert([{
                    tour_id: selectedTour?.tour_id,
                    location_id: selectedLocation?.location_id,
                    event_id: selectedEvent?.event_id,
                    name: eventName,
                    course: courseDetails.course_name,
                    course_address: courseDetails.address,
                    event_date: eventDate,
                }])
                .single();

            if (eventError) throw new Error("Failed to create event");

            // Insert course details into course_details table
            const { error: courseError } = await supabase
                .from('course_details')
                .insert([{
                    event_id: eventData,
                    course_name: courseDetails.course_name,
                    address: courseDetails.address,
                }]);

            if (courseError) throw new Error("Failed to create course details");

            setSuccessMessage("Event created successfully!");
            setErrorMessage(null);
            resetFields();
        } catch (error) {
            console.error("Error creating event:", error);
            setErrorMessage("Error creating event. Please try again.");
        }
    };

    const resetFields = () => {
        setEventName("");
        setCourseDetails({ event_id: 0, course_name: "", address: "" });
        setEventDate("");
        setSelectedTour(null);
        setSelectedLocation(null);
        setSelectedEvent(null);
    };

    const handleEditEvent = async () => {
        if (!selectedEvent) {
            setErrorMessage("No event selected to edit.");
            return;
        }

        try {
            const { error } = await supabase
                .from('events')
                .update({
                    name: eventName,
                    course: courseDetails.course_name,
                    event_date: eventDate,
                })
                .eq('event_id', selectedEvent.event_id);

            if (error) throw new Error("Failed to update event");

            // Update course details in course_details table
            const { error: courseError } = await supabase
                .from('course_details')
                .update({
                    course_name: courseDetails.course_name,
                    address: courseDetails.address,
                })
                .eq('event_id', selectedEvent.event_id);

            if (courseError) throw new Error("Failed to update course details");

            setSuccessMessage("Event updated successfully!");
            setErrorMessage(null);
            resetFields();
        } catch (error) {
            console.error("Error updating event:", error);
            setErrorMessage("Error updating event. Please try again.");
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) {
            setErrorMessage("No event selected to delete.");
            return;
        }

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('event_id', selectedEvent.event_id);

            if (error) throw new Error("Failed to delete event");

            // Delete course details from course_details table
            const { error: courseError } = await supabase
                .from('course_details')
                .delete()
                .eq('event_id', selectedEvent.event_id);

            if (courseError) throw new Error("Failed to delete course details");

            setSuccessMessage("Event deleted successfully!");
            setErrorMessage(null);
            resetFields();
        } catch (error) {
            console.error("Error deleting event:", error);
            setErrorMessage("Error deleting event. Please try again.");
        }
    };

    return (
        <div className="max-w-[320px] text-center mx-auto">
            {errorMessage && (
                <div className="p-4 mb-4 bg-red-500 text-white rounded-md">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="p-4 mb-4 bg-green-500 text-white rounded-md">
                    {successMessage}
                </div>
            )}
            <Card title="Create a Game" theme={theme}>
                <div className="p-2 text-left flex justify-center max-w-4xl mx-auto">
                    <div className="p-4 bg-neutral-500 bg-opacity-95 rounded-lg">
                        <div className="p-4 bg-white rounded-md space-y-2">
                            <TourAutoComplete
                                tours={tours}
                                value={selectedTour}
                                onSelect={(_tour_id, tour) => setSelectedTour(tour)}
                            />
                            <LocationAutoComplete
                                locations={locations}
                                tour_id={selectedTour?.tour_id || null}
                                value={selectedLocation}
                                onSelectLocation={setSelectedLocation}
                            />
                            <EventAutoComplete
                                events={events}
                                tourId={selectedTour?.tour_id || null}
                                locationId={selectedLocation?.location_id || null}
                                value={selectedEvent}
                                onSelect={(event) => {
                                    setSelectedEvent(event);
                                    if (event) {
                                        setEventName(event.name);
                                        setCourseDetails({
                                            event_id: event.event_id,
                                            course_name: event.course,
                                            address: courseDetails.address || ""
                                        });
                                        setEventDate(event.event_date);
                                    } else {
                                        resetFields();
                                    }
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Event Name"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                className="border p-2 w-full mt-2 rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Course Name"
                                value={courseDetails.course_name}
                                onChange={(e) => setCourseDetails({ ...courseDetails, course_name: e.target.value })}
                                className="border p-2 w-full mt-2 rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Course Address"
                                value={courseDetails.address}
                                onChange={(e) => setCourseDetails({ ...courseDetails, address: e.target.value })}
                                className="border p-2 w-full mt-2 rounded-md"
                            />
                            <input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="border p-2 w-full mt-2 rounded-md"
                            />
                            <button onClick={handleCreateEvent} className="bg-blue-500 text-white p-2 mt-4 rounded-md w-full">
                                Create Event
                            </button>
                            <button onClick={handleEditEvent} className="bg-yellow-500 text-white p-2 mt-4 rounded-md w-full">
                                Edit Event
                            </button>
                            <button onClick={handleDeleteEvent} className="bg-red-500 text-white p-2 mt-4 rounded-md w-full">
                                Delete Event
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CreateGame;