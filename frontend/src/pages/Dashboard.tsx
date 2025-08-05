import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import AutoCompleteForm from "../components/AutoCompleteForm";
import { Tour, LocationDetail, EventItem, SideGames } from "../types";
import Card from "../components/defaultcard";
import { toast } from 'react-toastify';
import LoadingSpinner from "../components/LoadingSpinner";
import EventSummary from "../components/EventSummary";
import SelectSideGames from "../components/SelectSideGames";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface DashboardProps {
    theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const event_id = query.get("event_id");
    const tour_id = query.get("tour_id");
    const location_id = query.get("location_id");
    const [tours, setTours] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<LocationDetail[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedtour_id, setSelectedtour_id] = useState<string | null>(null);
    const [selectedlocation_id, setSelectedlocation_id] = useState<string | null>(null);
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
    const [tourLocations, setTourLocations] = useState<any[]>([]);
    const { addToCart, isEventInCart, joinedTours, user, isLoggedIn } = useUser();
    const [showMyToursOnly, setShowMyToursOnly] = useState(false);
    const [enabledSideGames, setEnabledSideGames] = useState<{ key: string; name: string; fee: number | null }[]>([]);
    const [purchasedSideGames, setPurchasedSideGames] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: toursData, error: toursError } = await supabase.from('tours').select('*');
                const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');
                const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');
                const { data: sideGamesData, error: sideGamesError } = await supabase.from('side_games').select('*');
                const { data: tourLocationsData, error: tourLocationsError } = await supabase.from('tour_locations').select('*');

                if (toursError || locationsError || eventsError || sideGamesError || tourLocationsError) {
                    throw new Error("Error fetching data from Supabase");
                }

                setTours(toursData);
                setLocations(locationsData);
                setEvents(eventsData);
                setSideGamesRows(sideGamesData);
                setTourLocations(tourLocationsData || []);

                // Pre-select event, tour, and location based on query params
                if (event_id && toursData.length > 0 && locationsData.length > 0 && eventsData.length > 0) {
                    const event = eventsData.find((e: EventItem) => e.id === event_id);
                    if (event) {
                        setSelectedEvent(event);
                        setEventValue(event);

                        const tour = toursData.find((tour: Tour) => tour.id === event.tour_id);
                        setTourValue(tour || null);

                        const locationDetail = locationsData.find((loc: LocationDetail) => loc.id === event.location_id) || null;
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
            const event = events.find(e => e.id === event_id);
            if (event) {
                setSelectedEvent(event);
                setEventValue(event);
                setSelectedtour_id(event.tour_id || null);
                setSelectedlocation_id(event.location_id || null);

                const tour = tours.find(tour => tour.id === event.tour_id);
                setTourValue(tour || null);

                const locationDetail = locations.find(loc => loc.id === event.location_id) || null;
                setLocationValue(locationDetail);
            } else {
                console.warn("No event found for event_id:", event_id);
            }
        }

        // Set the selected tour and location based on the URL parameters
        if (tour_id) {
            const matchedTour = tours.find(tour => tour.id === tour_id);
            if (matchedTour) {
                setSelectedtour_id(matchedTour.id);
            }
        }
        if (location_id) {
            setSelectedlocation_id(location_id);
        }
    }, [event_id, tours, locations, tour_id, location_id, events, loading]);

    useEffect(() => {
        if (tourValue && tours.length > 0) {
            const match = tours.find(t => t.id === tourValue.id) || null;
            if (match !== tourValue) setTourValue(match);
        }
    }, [tours]);

    // Only show locations when a tour is selected, filter by tour
    const filteredLocationDetails: LocationDetail[] = React.useMemo(() => {
        if (!selectedtour_id) {
            return []; // No locations when no tour is selected
        }

        const tourLocationIds = tourLocations
            .filter((tl) => tl.tour_id === selectedtour_id)
            .map((tl) => tl.location_id);

        // If no tour locations found, show all locations that have events for this tour
        if (tourLocationIds.length === 0) {
            const eventLocationIds = events
                .filter(ev => ev.tour_id === selectedtour_id)
                .map(ev => ev.location_id);
            return locations.filter((loc) => eventLocationIds.includes(loc.id));
        }

        return locations.filter((loc) => tourLocationIds.includes(loc.id));
    }, [selectedtour_id, locations, tourLocations, events]);

    const filteredEvents = React.useMemo(() => {
        if (!selectedlocation_id) return [];
        return events.filter(ev => ev.location_id === selectedlocation_id && ev.tour_id === selectedtour_id);
    }, [selectedlocation_id, selectedtour_id, events]);

    useEffect(() => {
        // If the current locationValue is not in the filtered list, reset it
        if (
            locationValue &&
            !filteredLocationDetails.some(loc => loc.id === locationValue.id)
        ) {
            setLocationValue(null);
            setSelectedlocation_id(null);
        }
    }, [filteredLocationDetails, locationValue]);

    // Control which accordion is expanded: only expand event summary if eventValue is not null
    useEffect(() => {
        if (eventValue) {
            setExpanded("eventsummarypanel");
        } else {
            setExpanded("tourpanel");
        }
    }, [eventValue]);

    // Reset side games selections when the event changes
    useEffect(() => {
        setNet(null);
        setDivision(null);
        setSuperSkins(false);
        // Optionally, reset sideGamesRows selection state if needed
        setSideGamesRows(prevRows => prevRows.map(row => ({ ...row, selected: false })));
        setTotalCost(0);
    }, [eventValue]);

    useEffect(() => {
        const fetchEnabledSideGames = async () => {
            if (!selectedEvent) {
                setEnabledSideGames([]);
                return;
            }

            const { data: row, error } = await supabase
                .from('event_side_games')
                .select('*')
                .eq('event_id', selectedEvent.id)
                .single();

            if (error || !row) {
                setEnabledSideGames([]);
                return;
            }

            const allSideGameKeys = [
                { key: 'open_net', label: 'Open Net' },
                { key: 'sr_net', label: 'Sr Net' },
                { key: 'super_skins', label: 'Super Skins' },
                { key: 'd1_skins', label: 'Division 1 Skins' },
                { key: 'd2_skins', label: 'Division 2 Skins' },
                { key: 'd3_skins', label: 'Division 3 Skins' },
                { key: 'd4_skins', label: 'Division 4 Skins' },
                { key: 'd5_skins', label: 'Division 5 Skins' },
                { key: 'ctp', label: 'Closest to the Pin' },
                { key: 'long_drive', label: 'Long Drive' },
                { key: 'best_drive', label: 'Best Drive' },
                { key: 'nassau', label: 'Nassau' },
            ];
            const enabled = allSideGameKeys
                .filter(sg => row[sg.key])
                .map(sg => ({
                    key: sg.key,
                    name: sg.label,
                    fee: row[`${sg.key}_fee`] !== null && row[`${sg.key}_fee`] !== undefined
                        ? Number(row[`${sg.key}_fee`])
                        : null
                }));



            setEnabledSideGames(enabled);
        };
        fetchEnabledSideGames();
    }, [selectedEvent]);

    useEffect(() => {
        const fetchPurchasedSideGames = async () => {
            if (!selectedEvent || !user) {
                setPurchasedSideGames(new Set());
                return;
            }
            const { data: purchases, error } = await supabase
                .from('purchases')
                .select('side_games_data')
                .eq('user_id', user.id)
                .eq('event_id', selectedEvent.id);

            if (error) {
                setPurchasedSideGames(new Set());
                return;
            }
            const purchased: Set<string> = new Set();
            purchases?.forEach((purchase: any) => {
                let keys: string[] = [];
                const data = purchase.side_games_data || {};
                if (Array.isArray(data.rows) && data.rows.length > 0) {
                    data.rows.forEach((row: any) => {
                        if (row.selected) {
                            const normalizedKey = ((row.key || row.name || '')
                                .toLowerCase()
                                .replace(/^[0-9]+_/, '')
                                .replace(/[^a-z0-9]/g, '_'));
                            keys.push(normalizedKey);
                        }
                    });
                } else {
                    // Fallback for old purchases: infer from high-level fields
                    if (data.net) {
                        keys.push(
                            (data.net || '')
                                .toLowerCase()
                                .replace(/^[0-9]+_/, '')
                                .replace(/[^a-z0-9]/g, '_')
                        );
                    }
                    if (data.division) {
                        keys.push(
                            (data.division || '')
                                .toLowerCase()
                                .replace(/^[0-9]+_/, '')
                                .replace(/[^a-z0-9]/g, '_')
                        );
                    }
                    if (data.superSkins) {
                        keys.push('super_skins');
                    }
                }
                keys.forEach(k => purchased.add(k));
            });
            setPurchasedSideGames(purchased);
        };
        fetchPurchasedSideGames();
    }, [selectedEvent, user]);

    const handleSelectTour = (tour: Tour | null) => {
        setTourValue(tour);
        setSelectedtour_id(tour ? tour.id : null);

        // Reset location and event
        setSelectedlocation_id(null);
        setLocationValue(null);
        setSelectedEvent(null);
        setEventValue(null);
    };

    const handleSelectLocation = (location: LocationDetail | null) => {
        setSelectedlocation_id(location ? location.id : null);
        setLocationValue(location);

        // Reset event
        setSelectedEvent(null);
        setEventValue(null);
    };

    const handleSelectEvent = (event: EventItem | null) => {
        setSelectedEvent(event);
        setEventValue(event);
    };

    const handleExpanded = (panel: string | false) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const updateSideGamesData = (newNet: string | null, newDivision: string | null, newSuperSkins: boolean) => {
        const updatedRows = sideGamesRows.map(row => ({
            ...row,
            selected:
                (/super[_ ]skins/i.test(row.key) && newSuperSkins) ||
                (row.key === newNet || row.key === newDivision)
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

    const autoCompleteFormRef = useRef<any>(null);

    const handleAddToCart = () => {
        // Check if user is logged in
        if (!isLoggedIn) {
            toast.error("You must be logged in to enter events. Please sign in or create an account.");
            return;
        }

        if (!selectedEvent) {
            toast.error("Please select an event");
            return;
        }

        if (isEventInCart && isEventInCart(selectedEvent.id)) {
            toast.error("Event is already in cart");
            return;
        }

        if (!net && !division && !superSkins) {
            toast.error("Please select a side game");
            return;
        }

        const selectedTour = tours.find(tour => tour.id === selectedtour_id);
        const tourLabel = selectedTour ? selectedTour.name : null;

        const eventSummary = {
            selectedEvent,
            tourLabel,
            locationLabel: filteredLocationDetails.find(loc => loc.id === selectedlocation_id)?.name || null,
        };

        const sideGamesData = {
            net,
            division,
            superSkins,
            rows: sideGamesRows.map(row => ({
                key: row.key, // ensure key is present
                name: row.name,
                cost: row.value,
                selected:
                    (/super[_ ]skins/i.test(row.key) && superSkins) ||
                    (row.key === net || row.key === division),
            })),
            totalCost,
        };

        addToCart(eventSummary, sideGamesData);

        // Reset the Find a Game form after adding to cart
        if (autoCompleteFormRef.current && autoCompleteFormRef.current.resetForm) {
            autoCompleteFormRef.current.resetForm();
        }

        setTimeout(() => {
            toast.success("Event added to cart");
        }, 1000);
    };

    const filteredTours = showMyToursOnly && joinedTours.length > 0
        ? tours.filter(tour => joinedTours.includes(tour.id))
        : tours;

    // Render loading state or the main content
    if (loading) {
        return (
            <Card title="Dashboard" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    return (
        <Card
            title="Find a Game"
            theme={theme}
            includeInnerCard={true}
            footerTitle="📋 How to Find a Game"
            footerContent={
                <div className="text-xs text-gray-300 bg-gray-800 bg-opacity-80 rounded-lg p-3">
                    <ol className="list-decimal list-inside space-y-1 text-left">
                        <li><strong>Browse freely!</strong> Select a <strong>Tour</strong> (e.g., APT USA, My Men's League, etc.)</li>
                        <li>Choose a <strong>Location</strong> (e.g., Florida Gulf Coast, Georgia Central, The Ledges GC, etc.)</li>
                        <li>Pick an <strong>Event</strong> (e.g., The Red Rock Championship, Tuesday Night League, etc.)</li>
                        <li>Select your <strong>Side Games</strong> (e.g., Open Net, Sr Net, Super Skins, etc.)</li>
                        <li>Click <strong>"Add to Cart"</strong> to complete your purchase</li>
                    </ol>
                    <div className="mt-2 text-yellow-300">
                        💡 <strong>Tip:</strong> Use the "My Tours" toggle to filter events for tours you've joined.
                    </div>
                    {!isLoggedIn && (
                        <div className="mt-2 text-blue-300 border border-blue-500 rounded p-2">
                            🔐 <strong>Ready to join?</strong> You'll need to <strong>log in</strong> to add events to your cart and complete purchases.
                        </div>
                    )}
                </div>
            }
        >
            {isLoggedIn && (
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
            )}
            <div className="space-y-4">
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
                    sideGamesRows={sideGamesRows.filter(row =>
                        enabledSideGames.some(sg => {
                            const rowKey = row.key
                                .toLowerCase()
                                .replace(/^[0-9]+_/, '') // remove leading number and underscore
                                .replace(/[^a-z0-9]/g, '_');
                            const sgKey = sg.key
                                ? sg.key.toLowerCase().replace(/^[0-9]+_/, '').replace(/[^a-z0-9]/g, '_')
                                : '';
                            return rowKey === sgKey && sg.fee !== null && sg.fee !== undefined;
                        })
                    ).map(row => {
                        const sg = enabledSideGames.find(sg => {
                            const rowKey = row.key
                                .toLowerCase()
                                .replace(/^[0-9]+_/, '')
                                .replace(/[^a-z0-9]/g, '_');
                            const sgKey = sg.key
                                ? sg.key.toLowerCase().replace(/^[0-9]+_/, '').replace(/[^a-z0-9]/g, '_')
                                : '';
                            return rowKey === sgKey;
                        });
                        return sg ? { ...row, value: sg.fee ?? row.value } : row;
                    })}
                    net={net}
                    division={division}
                    superSkins={superSkins}
                    totalCost={totalCost}
                    onNetChange={handleNetChange}
                    onDivisionChange={handleDivisionChange}
                    onSuperSkinsChange={handleSuperSkinsChange}
                    onAddToCart={handleAddToCart}
                    enabledSideGames={enabledSideGames}
                    purchasedSideGames={purchasedSideGames}
                    showEventSummary={false}
                />

                <div className="rounded">
                    <Accordion
                        expanded={expanded === "eventsummarypanel"}
                        onChange={handleExpanded("eventsummarypanel")}
                        elevation={0}
                        className="w-full"
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Event Summary</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <EventSummary
                                tourLabel={tourValue ? tourValue.name : null}
                                locationLabel={selectedlocation_id
                                    ? locations.find(loc => loc.id === selectedlocation_id)?.name || null
                                    : null}
                                selectedEvent={selectedEvent}
                            />
                            <SelectSideGames
                                selectedEvent={selectedEvent}
                                rows={sideGamesRows.filter(row =>
                                    enabledSideGames.some(sg => {
                                        const rowKey = row.key
                                            .toLowerCase()
                                            .replace(/^[0-9]+_/, '') // remove leading number and underscore
                                            .replace(/[^a-z0-9]/g, '_');
                                        const sgKey = sg.key
                                            ? sg.key.toLowerCase().replace(/^[0-9]+_/, '').replace(/[^a-z0-9]/g, '_')
                                            : '';

                                        return rowKey === sgKey && sg.fee !== null && sg.fee !== undefined;
                                    })
                                ).map(row => {
                                    const sg = enabledSideGames.find(sg => {
                                        const rowKey = row.key
                                            .toLowerCase()
                                            .replace(/^[0-9]+_/, '')
                                            .replace(/[^a-z0-9]/g, '_');
                                        const sgKey = sg.key
                                            ? sg.key.toLowerCase().replace(/^[0-9]+_/, '').replace(/[^a-z0-9]/g, '_')
                                            : '';
                                        return rowKey === sgKey;
                                    });

                                    return sg ? { ...row, value: sg.fee ?? row.value } : row;
                                })}


                                net={net}
                                division={division}
                                superSkins={superSkins}
                                totalCost={totalCost}
                                onNetChange={handleNetChange}
                                onDivisionChange={handleDivisionChange}
                                onSuperSkinsChange={handleSuperSkinsChange}
                                onAddToCart={handleAddToCart}
                                disabled={!selectedEvent}
                                purchasedSideGames={purchasedSideGames}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </Card>
    );
};

export default Dashboard;
