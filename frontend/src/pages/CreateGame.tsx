import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AutoCompleteForm from "../components/AutoCompleteForm";
import { Tour, LocationDetail, EventItem, SideGames } from "../types";
import Card from "../components/defaultcard";
import { supabase } from "../services/supabaseClient";
import { toast } from 'react-toastify';
import LoadingSpinner from "../components/LoadingSpinner";
import SideGamesModal from "../components/SideGamesModal";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PendingConfirmation {
    event: any;
    sideGames: any[];
    eventId: string | null;
}

const CreateGame: React.FC<{ theme: string }> = ({ theme }) => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<LocationDetail[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationDetail | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [eventName, setEventName] = useState<string>("");
    const [courseDetails, setCourseDetails] = useState<{ course_name: string }>({
        course_name: ""
    });
    const [eventDate, setEventDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [filteredLocations, setFilteredLocations] = useState<LocationDetail[]>(locations);
    const [showMyToursOnly, setShowMyToursOnly] = useState(false);
    const [sideGamesModalOpen, setSideGamesModalOpen] = useState(false);
    const [selectedSideGames, setSelectedSideGames] = useState<any[]>([]);
    const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<PendingConfirmation | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateSideGamesModalOpen, setUpdateSideGamesModalOpen] = useState(false);
    const [pendingUpdateSideGames, setPendingUpdateSideGames] = useState<any[]>([]);
    const [formKey, setFormKey] = useState(0);

    // AutoCompleteForm state variables
    const [selectedtour_id, setSelectedtour_id] = useState<string | null>(null);
    const [selectedlocation_id, setSelectedlocation_id] = useState<string | null>(null);
    const [tourValue, setTourValue] = useState<Tour | null>(null);
    const [locationValue, setLocationValue] = useState<LocationDetail | null>(null);
    const [eventValue, setEventValue] = useState<EventItem | null>(null);
    const [expanded, setExpanded] = useState<string | false>("tourpanel");
    const [sideGamesRows, setSideGamesRows] = useState<SideGames[]>([]);
    const [net, setNet] = useState<string | null>(null);
    const [division, setDivision] = useState<string | null>(null);
    const [superSkins, setSuperSkins] = useState<boolean>(false);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [tourLocations, setTourLocations] = useState<any[]>([]);
    const [enabledSideGames, setEnabledSideGames] = useState<{ key: string; name: string; fee: number | null }[]>([]);
    const [purchasedSideGames, setPurchasedSideGames] = useState<Set<string>>(new Set());

    const autoCompleteFormRef = useRef<any>(null);

    const { user, isLoggedIn, loading, joinedTours } = useUser();
    const canCreate = isLoggedIn && user?.emailConfirmedAt;
    const isProfileComplete = !!user?.address && !!user?.phone;

    // AutoCompleteForm handler functions
    const handleSelectTour = (tour: Tour | null) => {
        setTourValue(tour);
        setSelectedtour_id(tour ? tour.id : null);
        // Reset location and event
        setSelectedlocation_id(null);
        setLocationValue(null);
        setSelectedEvent(null);
        setEventValue(null);
        // Update selectedTour for backward compatibility
        setSelectedTour(tour);
    };

    const handleSelectLocation = (location: LocationDetail | null) => {
        setSelectedlocation_id(location ? location.id : null);
        setLocationValue(location);
        // Reset event
        setSelectedEvent(null);
        setEventValue(null);
        // Update selectedLocation for backward compatibility
        setSelectedLocation(location);
    };

    const handleSelectEvent = (event: EventItem | null) => {
        setSelectedEvent(event);
        setEventValue(event);
        if (event) {
            setEventName(event.name);
            setCourseDetails({ course_name: event.course_name || "" });
            setEventDate(event.event_date);
            // Open the Event Details accordion when an event is selected
            setExpanded("eventdetailspanel");
        } else {
            resetFields();
            // Close the Event Details accordion when no event is selected
            setExpanded("tourpanel");
        }
    };

    const handleNewEventSelect = () => {
        // Clear any existing event selection but keep tour and location
        setSelectedEvent(null);
        setEventValue(null);
        // Clear form fields for new event
        setEventName("");
        setCourseDetails({ course_name: "" });
        setEventDate(new Date().toISOString().split("T")[0]);
        // Open the Event Details accordion
        setExpanded("eventdetailspanel");
    };

    const handleExpanded = (panel: string | false) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const fetchEvents = async () => {
        const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');
        if (!eventsError && eventsData) {
            setEvents(eventsData);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: toursData, error: toursError } = await supabase.from('tours').select('*');
                const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');
                const { data: sideGamesData, error: sideGamesError } = await supabase.from('side_games').select('*');
                const { data: tourLocationsData, error: tourLocationsError } = await supabase.from('tour_locations').select('*');

                if (toursError || locationsError || sideGamesError || tourLocationsError) {
                    throw new Error("Error fetching data from Supabase");
                }

                setTours(toursData);
                setLocations(locationsData);
                setSideGamesRows(sideGamesData);
                setTourLocations(tourLocationsData || []);
                await fetchEvents();
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data.");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedTour && tours.length > 0) {
            const match = tours.find(t => t.id === selectedTour.id) || null;
            if (match !== selectedTour) setSelectedTour(match);
        }
    }, [tours]);

    useEffect(() => {
        const fetchTourLocations = async () => {
            if (!selectedTour) {
                setFilteredLocations([]);
                return;
            }
            const { data, error } = await supabase
                .from('tour_locations')
                .select('location_id')
                .eq('tour_id', selectedTour.id);
            if (error) {
                setFilteredLocations([]);
                return;
            }
            if (!data) {
                setFilteredLocations([]);
                return;
            }
            const locationIds = data.map((row: { location_id: string }) => row.location_id);
            setFilteredLocations(locations.filter(loc => locationIds.includes(loc.id)));
        };
        fetchTourLocations();
    }, [selectedTour, locations]);

    const handleSideGamesSave = (sideGames: any[]) => {
        // Only keep selected side games
        const selected = sideGames.filter(sg => sg.selected);
        setSelectedSideGames(selected);
        toast.success(`Configured ${selected.length} side games for your event`);
        // Instead of creating the event, open the confirmation dialog with event details
        setPendingConfirmation({
            event: {
                name: eventName,
                event_date: eventDate,
                course_name: courseDetails.course_name,
                // add other fields as needed
            },
            sideGames: selected,
            eventId: null // will be set after DB insert
        });
    };

    const handleCreateEvent = () => {
        if (!selectedTour || !selectedLocation || !eventName || !eventDate || !courseDetails.course_name) {
            toast.error("Please fill in Tour, Location, Event Name, Course Name, and Date.");
            return;
        }
        setSideGamesModalOpen(true);
    };

    // Only called after user confirms in the dialog
    const handleCreateEventWithSideGames = async (sideGamesArg?: any[]) => {
        const sideGamesToUse = sideGamesArg || selectedSideGames;
        if (!selectedTour || !selectedLocation || !eventName || !eventDate) {
            toast.error("Please fill in Tour, Location, Event Name, and Date.");
            return;
        }
        if (!user || !user.id) {
            toast.error("You must be logged in to create an event.");
            return;
        }
        if (!sideGamesToUse || sideGamesToUse.length === 0) {
            toast.error("You must select at least one side game.");
            return;
        }
        const invalidFee = sideGamesToUse.some(sg => Number(sg.entranceFee) < 5);
        if (invalidFee) {
            toast.error("Each side game must have an entrance fee of at least $5.00.");
            return;
        }

        // Parse the event date as local
        const [year, month, day] = eventDate.split("-");
        const eventDateObj = new Date(Number(year), Number(month) - 1, Number(day));
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time for today

        if (eventDateObj < today) {
            toast.error("You cannot create an event in the past.");
            return;
        }

        try {
            // Extract year from event date
            const year = new Date(eventDate).getFullYear();

            // Ensure the tour/location pair exists in tour_locations
            const { data: tourLoc, error: tourLocError } = await supabase
                .from('tour_locations')
                .select('*')
                .eq('tour_id', selectedTour.id)
                .eq('location_id', selectedLocation.id)
                .single();

            if (tourLocError && tourLocError.code !== 'PGRST116') { // PGRST116: No rows found
                toast.error("Error checking tour/location pair.");
                return;
            }

            if (!tourLoc) {
                // Insert the pair if it doesn't exist
                const { error: insertTourLocError } = await supabase
                    .from('tour_locations')
                    .insert([{ tour_id: selectedTour.id, location_id: selectedLocation.id }]);
                if (insertTourLocError) {
                    toast.error("Failed to link tour and location.");
                    return;
                }
            }

            // Prepare the event data
            const eventData = {
                user_id: user.id, // Attach creator
                tour_id: selectedTour.id,
                location_id: selectedLocation.id,
                name: eventName,
                course_name: courseDetails.course_name || null,
                event_date: eventDate,
                year: year,
            };

            // 1. Create the event
            const { data: eventDataResult, error: eventError } = await supabase
                .from('events')
                .insert([eventData])
                .select()
                .single();

            if (eventError) {
                console.error("Database error:", eventError);
                throw new Error(`Failed to create event: ${eventError.message}`);
            }

            const eventId = eventDataResult.id;

            // 2. Build a single event_side_games row for this event
            const allSideGameKeys = [
                'open_net',
                'sr_net',
                'super_skins',
                'd1_skins',
                'd2_skins',
                'd3_skins',
                'd4_skins',
                'd5_skins',
                'ctp',
                'long_drive',
                'best_drive',
                'nassau',
            ];
            // Map selectedSideGames to a lookup for quick access
            const selectedMap = Object.fromEntries(
                sideGamesToUse.map(sg => {
                    const key = sg.key
                        .toLowerCase()
                        .replace(/^[0-9]+_/, '') // remove leading number and underscore
                        .replace(/[^a-z0-9]/g, '_');
                    return [key, sg.entranceFee];
                })
            );
            const eventSideGamesRow: any = { event_id: eventId };
            allSideGameKeys.forEach(key => {
                eventSideGamesRow[key] = key in selectedMap;
                eventSideGamesRow[`${key}_fee`] = selectedMap[key] || null;
            });

            // Debug logs
            console.log('selectedSideGames:', sideGamesToUse.map(sg => sg.key));
            sideGamesToUse.forEach(sg => {
                const key = sg.key
                    .toLowerCase()
                    .replace(/^[0-9]+_/, '')
                    .replace(/[^a-z0-9]/g, '_');
                console.log('Mapping:', sg.key, '->', key, 'fee:', sg.entranceFee);
            });
            console.log('selectedMap:', selectedMap);
            console.log('eventSideGamesRow:', eventSideGamesRow);

            const { error: sideGamesError } = await supabase
                .from('event_side_games')
                .upsert([eventSideGamesRow]);

            console.log('sideGamesError:', sideGamesError);

            if (sideGamesError) {
                toast.error("Failed to save side games for event");
                return;
            }

            // 3. Query event details and side games for confirmation (optional, you can update this to query the new structure if needed)
            const { data: eventDetails } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single();

            setPendingConfirmation({ event: eventDetails, sideGames: sideGamesToUse, eventId });
            toast.success("Event created successfully!");
            resetFields();
            fetchEvents();
            setPendingConfirmation(null);
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error(error instanceof Error ? error.message : "Error creating event. Please try again.");
        }
    };

    const resetFields = () => {
        setEventName("");
        setCourseDetails({ course_name: "" });
        setEventDate(new Date().toISOString().split("T")[0]);
        setSelectedSideGames([]);
        setFormKey(k => k + 1);
        // Reset the expanded state to tour panel
        setExpanded("tourpanel");
        // Reset the autocomplete form using the ref
        if (autoCompleteFormRef.current && autoCompleteFormRef.current.resetForm) {
            autoCompleteFormRef.current.resetForm();
        }
    };

    const handleEditEvent = () => {
        if (!selectedEvent) {
            toast.error("No event selected to edit.");
            return;
        }
        if (!selectedTour || !selectedLocation || !eventName || !eventDate || !courseDetails.course_name) {
            toast.error("Please fill in Tour, Location, Event Name, Course Name, and Date.");
            return;
        }
        // Always open the side games modal for editing
        setPendingUpdateSideGames(selectedSideGames);
        setUpdateSideGamesModalOpen(true);
    };

    const handleUpdateSideGamesSave = (sideGames: any[]) => {
        const selected = sideGames.filter(sg => sg.selected);
        setSelectedSideGames(selected);
        setUpdateSideGamesModalOpen(false);
        // Prepare the confirmation dialog data
        setPendingUpdate({
            event: {
                name: eventName,
                event_date: eventDate,
                course_name: courseDetails.course_name,
            },
            sideGames: selected,
            eventId: selectedEvent?.id || null
        });
    };

    const handleUpdateEventWithSideGames = async (sideGamesArg?: any[]) => {
        const sideGamesToUse = sideGamesArg || selectedSideGames;
        if (!selectedEvent) {
            toast.error("No event selected to edit.");
            return;
        }
        if (!sideGamesToUse || sideGamesToUse.length === 0) {
            toast.error("You must select at least one side game.");
            return;
        }
        const invalidFee = sideGamesToUse.some(sg => Number(sg.entranceFee) < 5);
        if (invalidFee) {
            toast.error("Each side game must have an entrance fee of at least $5.00.");
            return;
        }
        try {
            // 1. Update the event
            const { error: eventError } = await supabase
                .from('events')
                .update({
                    name: eventName,
                    course_name: courseDetails.course_name || null,
                    event_date: eventDate,
                    year: new Date(eventDate).getFullYear()
                })
                .eq('id', selectedEvent.id);

            if (eventError) {
                toast.error("Failed to update event");
                return;
            }

            // 2. Update the event_side_games row
            const allSideGameKeys = [
                'open_net', 'sr_net', 'super_skins', 'd1_skins', 'd2_skins', 'd3_skins',
                'd4_skins', 'd5_skins', 'ctp', 'long_drive', 'best_drive', 'nassau'
            ];
            const selectedMap = Object.fromEntries(
                sideGamesToUse.map(sg => {
                    const key = sg.key
                        .toLowerCase()
                        .replace(/^[0-9]+_/, '')
                        .replace(/[^a-z0-9]/g, '_');
                    return [key, sg.entranceFee];
                })
            );
            const eventSideGamesRow: any = { event_id: selectedEvent.id };
            allSideGameKeys.forEach(key => {
                eventSideGamesRow[key] = key in selectedMap;
                eventSideGamesRow[`${key}_fee`] = selectedMap[key] || null;
            });

            const { error: sideGamesError } = await supabase
                .from('event_side_games')
                .upsert([eventSideGamesRow]);

            if (sideGamesError) {
                toast.error("Failed to update side games for event");
                return;
            }

            toast.success("Event updated successfully!");
            resetFields();
            fetchEvents();
            setPendingUpdate(null);
        } catch (error) {
            toast.error("Error updating event.");
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) {
            toast.error("No event selected to delete.");
            return;
        }
        if (!selectedTour || !selectedLocation || !eventName || !eventDate || !courseDetails.course_name) {
            toast.error("Please fill in Tour, Location, Event Name, Course Name, and Date.");
            return;
        }
        // Check for registered players (purchases)
        const { data: purchases, error } = await supabase
            .from('purchases')
            .select('id')
            .eq('event_id', selectedEvent.id);
        if (error) {
            toast.error("Error checking for registered players.");
            return;
        }
        if (purchases && purchases.length > 0) {
            window.alert("There are players registered for this event. You must refund entrance fees from the My Events tab in your profile drop down to refund entrance fees.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            return;
        }
        try {
            // 1. Delete from event_side_games first
            const { error: sideGamesDeleteError } = await supabase
                .from('event_side_games')
                .delete()
                .eq('event_id', selectedEvent.id);

            if (sideGamesDeleteError) {
                toast.error("Failed to delete event side games");
                return;
            }

            // 2. Now delete the event
            const { data, error } = await supabase
                .from('events')
                .delete()
                .eq('id', selectedEvent.id)
                .select();

            if (error) {
                toast.error("Failed to delete event");
                return;
            }

            toast.success("Event deleted successfully!");
            resetFields();
            fetchEvents();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error deleting event. Please try again.");
        }
    };

    // Filtered data for AutoCompleteForm
    const filteredLocationDetails: LocationDetail[] = React.useMemo(() => {
        if (!selectedtour_id) return [];
        const tourLocationIds = tourLocations
            .filter((tl) => tl.tour_id === selectedtour_id)
            .map((tl) => tl.location_id);
        return locations.filter((loc) => tourLocationIds.includes(loc.id));
    }, [selectedtour_id, locations, tourLocations]);

    const filteredEvents = React.useMemo(() => {
        if (!selectedlocation_id) return [];
        return events.filter(ev => ev.location_id === selectedlocation_id && ev.tour_id === selectedtour_id);
    }, [selectedlocation_id, selectedtour_id, events]);

    const filteredTours = showMyToursOnly && joinedTours.length > 0
        ? tours.filter(tour => joinedTours.includes(tour.id))
        : tours;

    if (loading) {
        return (
            <Card title="Create a Game" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    return (
        <>
            <Card
                key={formKey}
                title="Create a Game"
                theme={theme}
                includeInnerCard={true}
            >
                {canCreate ? (
                    isProfileComplete ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-end w-full mb-4 rounded">
                                <label htmlFor="my-tours-switch" className="text-xs text-gray-700 select-none mr-1">
                                    My Tours:
                                </label>
                                <div className="group relative inline-flex h-5 w-10 shrink-0 items-center justify-center rounded-lg">
                                    <span
                                        className={`absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out
                                                ${showMyToursOnly ? 'bg-indigo-600' : 'bg-gray-200'}
                                            `}
                                    />
                                    <span
                                        className={`absolute left-0 size-5 rounded-full border bg-white shadow-xs transition-transform duration-200 ease-in-out
                                                ${showMyToursOnly ? 'border-indigo-600 translate-x-5' : 'border-gray-300'}
                                            `}
                                    />
                                    <input
                                        id="my-tours-switch"
                                        name="my-tours-switch"
                                        type="checkbox"
                                        aria-label="My Tours"
                                        checked={showMyToursOnly}
                                        onChange={() => setShowMyToursOnly(v => !v)}
                                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white rounded">
                                    <AutoCompleteForm
                                        ref={autoCompleteFormRef}
                                        tours={filteredTours}
                                        locations={filteredLocationDetails}
                                        events={filteredEvents}
                                        selectedLocationId={selectedlocation_id}
                                        selectedEvent={selectedEvent}
                                        tourValue={tourValue}
                                        locationValue={locationValue}
                                        eventValue={eventValue}
                                        onSelectTour={handleSelectTour}
                                        onSelectLocation={handleSelectLocation}
                                        onSelectEvent={handleSelectEvent}
                                        expanded={expanded}
                                        onAccordionChange={handleExpanded}
                                        sideGamesRows={[]}
                                        net={null}
                                        division={null}
                                        superSkins={false}
                                        totalCost={0}
                                        onNetChange={() => { }}
                                        onDivisionChange={() => { }}
                                        onSuperSkinsChange={() => { }}
                                        onAddToCart={() => { }}
                                        enabledSideGames={[]}
                                        purchasedSideGames={new Set()}
                                        showEventSummary={false}
                                        showNewEventOption={true}
                                        onNewEventSelect={handleNewEventSelect}
                                        tourPanelTitle="Create, Update, or Cancel an Event"
                                    />
                                </div>

                                <div className="bg-white rounded-md">
                                    <Accordion
                                        expanded={expanded === "eventdetailspanel"}
                                        onChange={handleExpanded("eventdetailspanel")}
                                        elevation={0}
                                        className="w-full"
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="eventdetails-content"
                                            id="eventdetails-header"
                                        >
                                            <Typography>Event Details</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Event Name"
                                                    value={eventName}
                                                    onChange={(e) => setEventName(e.target.value)}
                                                    className="border w-full p-2 rounded-md"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Course Name"
                                                    value={courseDetails.course_name}
                                                    onChange={(e) => setCourseDetails({ course_name: e.target.value })}
                                                    className="border w-full p-2 rounded-md"
                                                />
                                                <input
                                                    type="date"
                                                    value={eventDate}
                                                    min={new Date().toISOString().split("T")[0]}
                                                    max="2030time-12-31"
                                                    onChange={(e) => setEventDate(e.target.value)}
                                                    className="border w-full p-2 rounded-lg"
                                                />
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>

                            <div className="space-x-2 flex justify-center">
                                <button onClick={handleCreateEvent} className="bg-blue-500 text-white p-1.5 rounded-lg w-1/3 hover:bg-blue-600 transition-colors">
                                    Create Event
                                </button>
                                <button onClick={handleEditEvent} className="bg-yellow-500 text-white p-1.5 rounded-lg w-1/3 hover:bg-yellow-600 transition-colors">
                                    Update Event
                                </button>
                                <button onClick={handleDeleteEvent} className="bg-red-500 text-white p-1.5 rounded-lg w-1/3 hover:bg-red-600 transition-colors">
                                    Cancel Event
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-yellow-600 font-semibold text-center">
                            <p>You must have an address and phone number in your profile to create, update, or cancel events.</p>
                            <Link to="/Profile" className="underline text-blue-700">Go to Profile</Link>
                        </div>
                    )
                ) : (
                    <p className="text-yellow-600 font-semibold text-center">
                        You must be logged in and have a verified email to create, update, or cancel events.
                    </p>
                )}
            </Card>
            <SideGamesModal
                open={sideGamesModalOpen}
                onClose={() => setSideGamesModalOpen(false)}
                onSave={handleSideGamesSave}
            />
            <SideGamesModal
                open={updateSideGamesModalOpen}
                onClose={() => setUpdateSideGamesModalOpen(false)}
                onSave={handleUpdateSideGamesSave}
            // Optionally, pass the current side games as a prop if your modal supports it
            />
            <Dialog open={!!pendingConfirmation} onClose={() => setPendingConfirmation(null)}>
                <DialogTitle>Confirm Event Creation</DialogTitle>
                <DialogContent>
                    {pendingConfirmation && (
                        <div>
                            <strong>Event Name:</strong> {pendingConfirmation.event.name}<br />
                            <strong>Date:</strong> {pendingConfirmation.event.event_date}<br />
                            <strong>Course:</strong> {pendingConfirmation.event.course_name}<br />
                            {/* ...other event details... */}
                            <strong>Side Games:</strong>
                            <ul>
                                {pendingConfirmation.sideGames.map(sg => (
                                    <li key={sg.key}>
                                        {sg.name} - Fee: ${sg.entranceFee}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPendingConfirmation(null)} color="secondary">Cancel</Button>
                    <Button
                        onClick={async () => {
                            setConfirmLoading(true);
                            await handleCreateEventWithSideGames(pendingConfirmation?.sideGames);
                            setPendingConfirmation(null);
                            setConfirmLoading(false);
                        }}
                        color="primary"
                        disabled={confirmLoading}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={!!pendingUpdate} onClose={() => setPendingUpdate(null)}>
                <DialogTitle>Confirm Event Update</DialogTitle>
                <DialogContent>
                    {pendingUpdate && (
                        <div>
                            <strong>Event Name:</strong> {pendingUpdate.event.name}<br />
                            <strong>Date:</strong> {pendingUpdate.event.event_date}<br />
                            <strong>Course:</strong> {pendingUpdate.event.course_name}<br />
                            <strong>Side Games:</strong>
                            <ul>
                                {pendingUpdate.sideGames.map(sg => (
                                    <li key={sg.key}>
                                        {sg.name} - Fee: ${sg.entranceFee}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPendingUpdate(null)} color="secondary">Cancel</Button>
                    <Button
                        onClick={async () => {
                            setUpdateLoading(true);
                            await handleUpdateEventWithSideGames(pendingUpdate?.sideGames);
                            setUpdateLoading(false);
                        }}
                        color="primary"
                        disabled={updateLoading}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreateGame;