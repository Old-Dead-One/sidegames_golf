import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Event, EventItem } from "./Types";
import { toast } from "react-toastify";

interface EventAutoCompleteProps {
    events: Event[];
    tourId: number | null;
    locationId: number | null;
    value: EventItem | null;
    onSelect: (event: EventItem | null) => void;
}

const EventAutoComplete: React.FC<EventAutoCompleteProps> = ({ events, tourId, locationId, value, onSelect }) => {
    const filteredEvents = events
        .filter(event => event.tour_id === tourId)
        .flatMap(event => event.events)
        .filter(eventDetail => eventDetail.location_id === locationId)
        .flatMap(eventDetail => eventDetail.events);

    const isEventClosed = (eventDate: string): boolean => {
        const now = new Date();
        const eventDateObj = new Date(eventDate);
        return now >= eventDateObj;
    };

    const handleSelect = (_event: React.SyntheticEvent, selectedEvent: EventItem | null) => {
        if (selectedEvent) {
            if (isEventClosed(selectedEvent.date)) {
                toast.error("This event has already passed. Please select a different event.");
                onSelect(null); // Reset selection if the event is closed
            } else {
                onSelect(selectedEvent); // Pass the selected event if it's valid
            }
        } else {
            onSelect(null); // If no event is selected, reset
        }
    };

    return (
        <Autocomplete
            size="small"
            options={filteredEvents}
            getOptionLabel={(option) => option.name}
            value={value}
            onChange={handleSelect}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
            fullWidth
            disabled={!locationId}
        />
    );
};

export default EventAutoComplete;
