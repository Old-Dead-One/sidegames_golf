import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AutoCompleteForm from "../components/AutoCompleteForm";
import { Tour, Location, LocationDetail, EventItem, SideGames } from "../components/Types";
import Card from "../components/defaultcard";

interface DashboardProps {
    theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const event_id = Number(query.get("event_id"));
    const tour_id = query.get("tour_id");
    const location_id = Number(query.get("location_id"));
    const [tours, setTours] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { addToCart, isEventInCart } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [toursResponse, locationsResponse, eventsResponse, sideGamesResponse] = await Promise.all([
                    fetch("/src/data/tours.json"),
                    fetch("/src/data/locations.json"),
                    fetch("/src/data/events.json"),
                    fetch("/src/data/sidegames.json")
                ]);

                const toursData: Tour[] = await toursResponse.json();
                const locationsData: Location[] = await locationsResponse.json();
                const eventsData: EventItem[] = await eventsResponse.json();
                const sideGamesData: SideGames[] = await sideGamesResponse.json();

                setTours(toursData);
                setLocations(locationsData);
                setEvents(eventsData);
                setSideGamesRows(sideGamesData);

                // Pre-select event, tour, and location based on query params
                if (event_id && toursData.length > 0 && locationsData.length > 0 && eventsData.length > 0) {
                    const event = eventsData.find((e: EventItem) => e.event_id === Number(event_id));
                    if (event) {
                        setSelectedEvent(event);
                        setEventValue(event);

                        const tour = toursData.find((tour: Tour) => tour.tour_id === event.tour_id);
                        setTourValue(tour || null);

                        const locationDetail = locationsData
                            .find((location: Location) => location.tour_id === event.tour_id)
                            ?.locations?.find((loc: LocationDetail) => loc.location_id === event.location_id) || null;
                        setLocationValue(locationDetail);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (loading) return; // Prevent running this effect while loading

        if (event_id && tours.length > 0 && locations.length > 0 && events.length > 0) {
            // Flatten the events array
            const flattenedEvents = events.flatMap(tour =>
                tour.events.flatMap(location =>
                    location.events.map(event => ({
                        ...event,
                        tour_id: tour.tour_id,
                        location_id: location.location_id
                    }))
                )
            );

            const event = flattenedEvents.find(e => e.event_id === event_id);
            if (event) {
                setSelectedEvent(event);
                setEventValue(event);
                setSelectedtour_id(event.tour_id);
                setSelectedlocation_id(event.location_id);

                const tour = tours.find(tour => tour.tour_id === event.tour_id);
                setTourValue(tour || null);

                const locationDetail = locations
                    .find(location => location.tour_id === event.tour_id)
                    ?.locations?.find(loc => loc.location_id === event.location_id) || null;
                setLocationValue(locationDetail);
            } else {
                console.warn("No event found for event_id:", event_id);
            }
        }

        // Set the selected tour and location based on the URL parameters
        if (tour_id) {
            const matchedTour = tours.find(tour => tour.label === tour_id);
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
            setErrorMessage("Please select an event");
            return;
        }

        if (isEventInCart && isEventInCart(selectedEvent.event_id)) {
            setErrorMessage("Event is already in cart");
            return;
        }

        if (!net && !division && !superSkins) {
            setErrorMessage("Please select a side game");
            return;
        }

        setErrorMessage(null);
        setSuccessMessage("Event added to cart");

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
            setSuccessMessage(null);
        }, 3000);
    };

    // Render loading state or the main content
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-[640px] text-center mx-auto">
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

            <Card title="Dashboard" theme={theme}>
                <div className="p-2 text-left flex justify-center max-w-4xl mx-auto">
                    <div className="p-4 bg-neutral-500 bg-opacity-95 rounded-lg">
                        <AutoCompleteForm
                            tours={tours}
                            locations={filteredLocationDetails}
                            events={events}
                            selectedTourId={selectedtour_id}
                            selectedLocationId={selectedlocation_id}
                            tourValue={tourValue}
                            locationValue={locationValue}
                            eventValue={eventValue}
                            onSelectTour={(tour_id: number | null, selectedTour: Tour | null) => handleSelectTour(tour_id, selectedTour)}
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
                            selectedEvent={selectedEvent}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
