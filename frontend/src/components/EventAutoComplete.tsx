import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { EventItem } from "./Types";

interface EventAutoCompleteProps {
    events: EventItem[];
    tourId: number | null;
    locationId: number | null;
    value: EventItem | null;
    onSelect: (event: EventItem | null) => void;
}

const EventAutoComplete: React.FC<EventAutoCompleteProps> = ({ events, tourId, locationId, value, onSelect }) => {
    const filteredEvents = events.filter(event => event.tour_id === tourId && event.location_id === locationId);

    const handleSelect = (_event: React.SyntheticEvent, selectedEvent: EventItem | null) => {
        if (selectedEvent) {
            onSelect(selectedEvent);
        } else {
            onSelect(null);
        }
    };

    return (
        <Autocomplete
            size="small"
            options={filteredEvents}
            getOptionLabel={(option) => option.name}
            value={value}
            onChange={handleSelect}
            renderInput={(params) => <TextField {...params} placeholder="Select an Event" />}
            fullWidth
            disabled={!locationId}
        />
    );
};

export default EventAutoComplete;
