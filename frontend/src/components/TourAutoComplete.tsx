import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tour } from "./Types";

interface TourAutoCompleteProps {
    tours: Tour[];
    value: Tour | null;
    onSelect: (tour_id: number | null, tour: Tour | null) => void;
}
const TourAutoComplete: React.FC<TourAutoCompleteProps> = ({ tours, value, onSelect }) => {

    return (
        <Autocomplete
            size="small"
            options={tours}
            getOptionLabel={(option) => option.label || ""}
            value={value}
            onChange={(_event, newValue) => onSelect(newValue ? newValue.tour_id : null, newValue)}
            renderInput={(params) => <TextField {...params} placeholder="Select a Tour" />}
            fullWidth
            clearOnBlur={false}
            clearOnEscape
            clearText="Clear selection"
        />
    );
};

export default TourAutoComplete;