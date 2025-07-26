import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { EventItem } from "../types";

interface EventAutoCompleteProps {
    events: EventItem[];
    tourId: string | null;
    locationId: string | null;
    value: EventItem | null;
    onSelect: (event: EventItem | null) => void;
    showNewEventOption?: boolean;
    onNewEventSelect?: () => void;
}

const EventAutoComplete: React.FC<EventAutoCompleteProps> = ({
    events,
    tourId,
    locationId,
    value,
    onSelect,
    showNewEventOption = false,
    onNewEventSelect
}) => {
    const filteredEvents = events.filter(event => event.tour_id === tourId && event.location_id === locationId);

    // Create options array with "New Event" at the top if enabled
    const options = showNewEventOption && tourId && locationId
        ? [{ id: 'new-event', name: '➕ Create New Event' } as EventItem, ...filteredEvents]
        : filteredEvents;

    const handleSelect = (_event: React.SyntheticEvent, selectedEvent: EventItem | null) => {
        if (selectedEvent) {
            if (selectedEvent.id === 'new-event') {
                // Handle "New Event" selection - don't call onSelect at all
                onNewEventSelect?.();
            } else {
                onSelect(selectedEvent);
            }
        } else {
            onSelect(null);
        }
    };

    return (
        <Autocomplete
            size="small"
            options={options}
            getOptionLabel={(option) => option.name}
            value={value}
            onChange={handleSelect}
            renderInput={(params) => <TextField {...params} placeholder="Select an Event" />}
            fullWidth
            disabled={!locationId && !value}
            clearOnBlur={false}
            clearOnEscape
            clearText="Clear selection"
            sx={{
                '& .MuiInputBase-root': {
                    fontSize: '14px',
                    borderRadius: '8px'
                },
            }}
        />
    );
};

export default EventAutoComplete;
