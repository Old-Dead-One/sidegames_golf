import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { LocationDetail } from "./Types";

interface LocationAutoCompleteProps {
    locations: LocationDetail[];
    tour_id: number | null;
    value: LocationDetail | null;
    onSelectLocation: (location: LocationDetail | null) => void;
}

const LocationAutoComplete: React.FC<LocationAutoCompleteProps> = ({ locations, tour_id, value, onSelectLocation }) => {
    const handleSelect = (_event: React.SyntheticEvent, newValue: LocationDetail | null) => {
        onSelectLocation(newValue);
    };

    return (
        <Autocomplete
            size="small"
            options={locations}
            getOptionLabel={(option) => option.label}
            value={value}
            onChange={handleSelect}
            renderInput={(params) => <TextField {...params} placeholder="Select a Location" />}
            fullWidth
            disabled={!tour_id}
            clearOnBlur={false}
            clearOnEscape
            clearText="Clear selection"
        />
    );
};

export default LocationAutoComplete;
