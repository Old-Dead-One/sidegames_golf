import React from "react";
import TourAutoComplete from "./TourAutoComplete";
import LocationAutoComplete from "./LocationAutoComplete";
import EventAutoComplete from "./EventAutoComplete";
import EventSummary from "./EventSummary";
import SelectSideGames from "./SelectSideGames";
import { Tour, LocationDetail, EventItem, SideGames } from "./Types";
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AutoCompleteFormProps {
    tours: Tour[];
    locations: LocationDetail[];
    events: EventItem[];
    selectedTourId: number | null;
    selectedLocationId: number | null;
    selectedEvent: EventItem | null;
    tourValue: Tour | null;
    locationValue: LocationDetail | null;
    eventValue: EventItem | null;
    onSelectTour: (tourId: number | null, selectedTour: Tour | null) => void;
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
}

const AutoCompleteForm: React.FC<AutoCompleteFormProps> = ({
    tours,
    locations,
    events,
    selectedTourId,
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
}) => {

    const selectedTourLabel = tours.find(tour => tour.tour_id === selectedTourId)?.label || null;
    const selectedLocationLabel = selectedLocationId
        ? locations.find(loc => loc.location_id === selectedLocationId)?.label || null
        : null;

    return (
        <div>
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
                    <Typography>Find an Event</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box marginBottom={1}>
                        <TourAutoComplete
                            tours={tours}
                            value={tourValue}
                            onSelect={onSelectTour}
                        />
                    </Box>
                    <Box marginBottom={1}>
                        <LocationAutoComplete
                            locations={locations}
                            tour_id={selectedTourId}
                            value={locationValue}
                            onSelectLocation={onSelectLocation}
                        />
                    </Box>
                    <EventAutoComplete
                        events={events}
                        tourId={selectedTourId}
                        locationId={selectedLocationId}
                        value={eventValue}
                        onSelect={onSelectEvent}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "eventsummarypanel"}
                onChange={onAccordionChange("eventsummarypanel")}
                elevation={0}
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
                        disabled={false}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default AutoCompleteForm;
