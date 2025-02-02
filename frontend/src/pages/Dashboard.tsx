import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import AutoCompleteForm from "../components/AutoCompleteForm";
import { Tour, LocationDetail, EventItem, SideGames } from "../components/Types";
import Card from "../components/defaultcard";
import { toast } from 'react-toastify';

interface DashboardProps {
    theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const event_id = Number(query.get("event_id"));
    const tour_id = Number(query.get("tour_id"));
    const location_id = Number(query.get("location_id"));
    const [tours, setTours] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<LocationDetail[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedtour_id, setSelectedtour_id] = useState<number | null>(null);
    const [selectedlocation_id, setSelectedlocation_id] = useState<number | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [tourValue, setTourValue] = useState<Tour | null>(null);
    const [locationValue, setLocationValue] = useState<LocationDetail | null>(null);
    const [eventValue, setEventValue] = useState<EventItem | null>(null);
    const [expanded, setExpanded] = useState<string | false>("tourpanel");
    const [sideGamesRows, setSideGamesRows] = useState<SideGames[]>([]);
    const [net, setNet] = useState<string | null>(null);
    const [division, setDivision] = useState<string | null>(null);
    const [superSkins, setSuperSkins] = useState<boolean>(false);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const { addToCart, isEventInCart } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: toursData, error: toursError } = await supabase.from('tours').select('*');
                const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');
                const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');
                const { data: sideGamesData, error: sideGamesError } = await supabase.from('side_games').select('*');

                if (toursError || locationsError || eventsError || sideGamesError) {
                    throw new Error("Error fetching data from Supabase");
                }

                setTours(toursData);
                setLocations(locationsData);
                setEvents(eventsData);
                setSideGamesRows(sideGamesData);

                // Pre-select event, tour, and location based on query params
                if (event_id && toursData.length > 0 && locationsData.length > 0 && eventsData.length > 0) {
                    const event = eventsData.find((e: EventItem) => e.event_id === event_id);
                    if (event) {
                        setSelectedEvent(event);
                        setEventValue(event);

                        const tour = toursData.find((tour: Tour) => tour.tour_id === event.tour_id);
                        setTourValue(tour || null);

                        const locationDetail = locationsData.find((loc: LocationDetail) => loc.location_id === event.location_id) || null;
                        setLocationValue(locationDetail);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [event_id]);

    useEffect(() => {
        if (loading) return; // Prevent running this effect while loading

        if (event_id && tours.length > 0 && locations.length > 0 && Array.isArray(events)) {
            const flattenedEvents = events.flatMap(tour => {
                if (!tour.events) {
                    console.warn("Tour events are undefined for tour:", tour);
                    return [];
                }
                return tour.events.flatMap(location => {
                    if (!location.events) {
                        console.warn("Location events are undefined for location:", location);
                        return [];
                    }
                    return location.events.map(event => ({
                        ...event,
                        tour_id: tour.tour_id,
                        location_id: location.location_id,
                    }));
                });
            });

            const event = flattenedEvents.find(e => e.event_id === event_id);
            if (event) {
                setSelectedEvent(event);
                setEventValue(event);
                setSelectedtour_id(event.tour_id);
                setSelectedlocation_id(event.location_id);

                const tour = tours.find(tour => tour.tour_id === event.tour_id);
                setTourValue(tour || null);

                // Update the logic to find the location correctly
                const locationDetail = locations.find(loc => loc.location_id === event.location_id) || null;
                setLocationValue(locationDetail);
            } else {
                console.warn("No event found for event_id:", event_id);
            }
        }

        // Set the selected tour and location based on the URL parameters
        if (tour_id) {
            const matchedTour = tours.find(tour => tour.tour_id === tour_id);
            if (matchedTour) {
                setSelectedtour_id(matchedTour.tour_id);
            }
        }
        if (location_id) {
            setSelectedlocation_id(location_id);
        }
    }, [event_id, tours, locations, tour_id, location_id, events, loading]);

    const filteredLocationDetails: LocationDetail[] = selectedtour_id
        ? locations.find(location => location.tour_id === selectedtour_id)?.locations || []
        : [];

    const handleSelectTour = (tour_id: number | null, selectedTour: Tour | null) => {
        setSelectedtour_id(tour_id);
        setTourValue(selectedTour);
        setSelectedlocation_id(null);
        setLocationValue(null);
        setSelectedEvent(null);
        setEventValue(null);
    };

    const handleSelectLocation = (location: LocationDetail | null) => {
        setSelectedlocation_id(location ? location.location_id : null);
        setLocationValue(location);
        setSelectedEvent(null);
        setEventValue(null);
    };

    const handleSelectEvent = (event: EventItem | null) => {
        setSelectedEvent(event);
        setEventValue(event);
        setExpanded("eventsummarypanel");
    };

    const handleExpanded = (panel: string | false) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const updateSideGamesData = (newNet: string | null, newDivision: string | null, newSuperSkins: boolean) => {
        const updatedRows = sideGamesRows.map(row => ({
            ...row,
            selected: (row.key === newNet) || (row.key === newDivision) || (row.key === "Super Skins" && newSuperSkins)
        }));

        const updatedTotalCost = updatedRows.reduce((acc: number, row: SideGames) => {
            return acc + (row.selected ? row.value : 0);
        }, 0);

        setSideGamesRows(updatedRows);
        setTotalCost(updatedTotalCost);
    };

    const handleNetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newNet = value === net ? null : value;
        setNet(newNet);
        updateSideGamesData(newNet, division, superSkins);
    };

    const handleDivisionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newDivision = value === division ? null : value;
        setDivision(newDivision);
        updateSideGamesData(net, newDivision, superSkins);
    };

    const handleSuperSkinsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        const newSuperSkins = value === superSkins ? false : value;
        setSuperSkins(newSuperSkins);
        updateSideGamesData(net, division, newSuperSkins);
    };

    const handleAddToCart = () => {
        if (!selectedEvent) {
            toast.error("Please select an event");
            return;
        }

        if (isEventInCart && isEventInCart(selectedEvent.event_id)) {
            toast.error("Event is already in cart");
            return;
        }

        if (!net && !division && !superSkins) {
            toast.error("Please select a side game");
            return;
        }

        const eventSummary = {
            selectedEvent,
            tourLabel: tours.find(tour => tour.tour_id === selectedtour_id)?.label || null,
            locationLabel: filteredLocationDetails.find(loc => loc.location_id === selectedlocation_id)?.label || null,
        };

        const sideGamesData = {
            net,
            division,
            superSkins,
            rows: sideGamesRows.map(row => ({
                name: row.name,
                cost: row.value,
                selected: (row.key === "SuperSkins" && superSkins) || (row.key === net || row.key === division),
            })),
            totalCost,
        };

        addToCart(eventSummary, sideGamesData);

        setTimeout(() => {
            toast.success("Event added to cart");
        }, 1000);
    };

    // Render loading state or the main content
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        // <div className="max-w-[320px] text-center mx-auto">
            <Card
                title="Find a Game"
                theme={theme}
            // footerContent={<button className="text-blue-600">Footer Action</button>}
            >

                {/* Dashboard section */}
                <div className="p-2 text-left max-w-sm mx-auto">
                    <div className="p-4 bg-neutral-500 bg-opacity-95 rounded-lg">
                        <AutoCompleteForm
                            tours={tours}
                            locations={locations}
                            events={events}
                            selectedTourId={selectedtour_id}
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
                            sideGamesRows={sideGamesRows}
                            net={net}
                            division={division}
                            superSkins={superSkins}
                            totalCost={totalCost}
                            onNetChange={handleNetChange}
                            onDivisionChange={handleDivisionChange}
                            onSuperSkinsChange={handleSuperSkinsChange}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </Card>
        // </div>
    );
};

export default Dashboard;
