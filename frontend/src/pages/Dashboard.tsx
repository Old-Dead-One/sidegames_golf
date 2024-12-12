import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import AutoCompleteForm from "../components/AutoCompleteForm";
import { Tour, Location, LocationDetail, EventItem, SideGames } from "../components/Types";
import Card from "../components/defaultcard";

interface DashboardProps {
    theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const filteredLocationDetails: LocationDetail[] = selectedTourId
        ? locations.find(location => location.tour_id === selectedTourId)?.locations || []
        : [];

    const handleSelectTour = (tourId: number | null, selectedTour: Tour | null) => {
        setSelectedTourId(tourId);
        setTourValue(selectedTour);
        setSelectedLocationId(null);
        setLocationValue(null);
        setSelectedEvent(null);
        setEventValue(null);
    };

    const handleSelectLocation = (location: LocationDetail | null) => {
        setSelectedLocationId(location ? location.location_id : null);
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
            tourLabel: tours.find(tour => tour.tour_id === selectedTourId)?.label || null,
            locationLabel: filteredLocationDetails.find(loc => loc.location_id === selectedLocationId)?.label || null,
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

    return (
        <div className="max-w-[640px] text-center mx-auto">
            {/* Error and Success messages as Tailwind alerts */}
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

            {/* Card component */}
            <Card
                title="Dashboard"
                theme={theme}
            // footerContent={<button className="text-yellow-400">Footer Action</button>}
            >
                <div className="p-2 text-left flex justify-center max-w-4xl mx-auto">
                    <div className="p-4 bg-neutral-500 bg-opacity-95 rounded-lg">
                        {/* AutoCompleteForm component */}
                        <AutoCompleteForm
                            tours={tours}
                            locations={filteredLocationDetails}
                            events={events}
                            selectedTourId={selectedTourId}
                            selectedLocationId={selectedLocationId}
                            tourValue={tourValue}
                            locationValue={locationValue}
                            eventValue={eventValue}
                            onSelectTour={(tourId: number | null, selectedTour: Tour | null) => handleSelectTour(tourId, selectedTour)}
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
                            selectedEvent={selectedEvent} />
                    </div>
                </div>
            </Card >
        </div>

    );
};

export default Dashboard;
