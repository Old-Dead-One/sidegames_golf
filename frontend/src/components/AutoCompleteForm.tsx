import React, { forwardRef, useImperativeHandle } from "react";
import TourAutoComplete from "./TourAutoComplete";
import LocationAutoComplete from "./LocationAutoComplete";
import EventAutoComplete from "./EventAutoComplete";
import EventSummary from "./EventSummary";
import SelectSideGames from "./SelectSideGames";
import { Tour, LocationDetail, EventItem, SideGames } from "../types";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AutoCompleteFormProps {
    tours: Tour[];
    locations: LocationDetail[];
    events: EventItem[];
    selectedLocationId: string | null;
    selectedEvent: EventItem | null;
    tourValue: Tour | null;
    locationValue: LocationDetail | null;
    eventValue: EventItem | null;
    onSelectTour: (tour: Tour | null) => void;
    onSelectLocation: (location: LocationDetail | null) => void;
    onSelectEvent: (event: EventItem | null) => void;
    expanded: string | false;
    onAccordionChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    sideGamesRows: SideGames[];
    net: string | null;
    division: string | null;
    superSkins: boolean;
    totalCost: number;
    onNetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDivisionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSuperSkinsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddToCart: () => void;
    // isEventClosed,
    enabledSideGames?: { name: string; fee: number | null }[];
    purchasedSideGames: Set<string>;
    showEventSummary?: boolean;
    showNewEventOption?: boolean;
    onNewEventSelect?: () => void;
    tourPanelTitle?: string;
}

const AutoCompleteForm = forwardRef<any, AutoCompleteFormProps>(({
    tours,
    locations,
    events,
    selectedLocationId,
    selectedEvent,
    tourValue,
    locationValue,
    eventValue,
    onSelectTour,
    onSelectLocation,
    onSelectEvent,
    expanded,
    onAccordionChange,
    sideGamesRows,
    net,
    division,
    superSkins,
    totalCost,
    onNetChange,
    onDivisionChange,
    onSuperSkinsChange,
    onAddToCart,
    // isEventClosed,
    // enabledSideGames,
    purchasedSideGames,
    showEventSummary = true,
    showNewEventOption = false,
    onNewEventSelect,
    tourPanelTitle = "Find an Event",
}, ref) => {

    // Expose a resetForm method to parent via ref
    useImperativeHandle(ref, () => ({
        resetForm: () => {
            // Don't call the handlers to avoid infinite loops
            // The parent component should handle the state resets directly
            // Reset side games and cost fields
            const fakeEvent = { target: { value: "", checked: false } } as React.ChangeEvent<HTMLInputElement>;
            onNetChange(fakeEvent);
            onDivisionChange(fakeEvent);
            onSuperSkinsChange(fakeEvent);
        }
    }));

    const selectedTour = tourValue;
    const selectedTourLabel = selectedTour ? selectedTour.name : null;
    const selectedLocationLabel = selectedLocationId
        ? locations.find(loc => loc.id === selectedLocationId)?.name || null
        : null;

    // REMOVE local filteredLocations state and useEffect
    // Use locations prop directly

    return (
        <div className="space-y-4 rounded">
            <Accordion
                expanded={expanded === "tourpanel"}
                onChange={onAccordionChange("tourpanel")}
                elevation={0}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{tourPanelTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        <div className="mb-2">
                            <TourAutoComplete
                                tours={tours}
                                value={tourValue}
                                onSelect={selected => {
                                    if (Array.isArray(selected)) return;
                                    onSelectTour(selected);
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <LocationAutoComplete
                                key={tourValue ? tourValue.id : "no-tour"}
                                locations={locations} // Use prop directly
                                tour_id={tourValue ? tourValue.id : null}
                                value={locationValue}
                                onSelectLocation={onSelectLocation}
                            />
                        </div>
                        <div>
                            <EventAutoComplete
                                key={(tourValue ? tourValue.id : "no-tour") + "-" + (locationValue ? locationValue.id : "no-location")}
                                events={events}
                                tourId={tourValue ? tourValue.id : null}
                                locationId={selectedLocationId}
                                value={eventValue}
                                onSelect={onSelectEvent}
                                showNewEventOption={showNewEventOption}
                                onNewEventSelect={onNewEventSelect}
                            />
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
            {showEventSummary && (
                <div className="rounded">
                    <Accordion
                        expanded={expanded === "eventsummarypanel"}
                        onChange={onAccordionChange("eventsummarypanel")}
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
                                tourLabel={selectedTourLabel}
                                locationLabel={selectedLocationLabel}
                                selectedEvent={selectedEvent}
                            // sideGames={enabledSideGames}
                            />
                            <SelectSideGames
                                selectedEvent={selectedEvent}
                                rows={sideGamesRows}
                                net={net}
                                division={division}
                                superSkins={superSkins}
                                totalCost={totalCost}
                                onNetChange={onNetChange}
                                onDivisionChange={onDivisionChange}
                                onSuperSkinsChange={onSuperSkinsChange}
                                onAddToCart={onAddToCart}
                                disabled={!selectedEvent}
                                purchasedSideGames={purchasedSideGames}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            )}
        </div>
    );
});

export default AutoCompleteForm;
