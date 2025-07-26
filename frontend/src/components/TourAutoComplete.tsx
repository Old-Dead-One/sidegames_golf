import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tour } from "../types";

interface TourAutoCompleteProps {
    tours: Tour[];
    value: Tour | Tour[] | null;
    onSelect: (selected: Tour[] | Tour | null) => void;
    multiple?: boolean;
    renderInput?: (params: any) => React.ReactNode;
}
const TourAutoComplete: React.FC<TourAutoCompleteProps> = ({ tours, value, onSelect, multiple = false, renderInput }) => {

    return (
        <Autocomplete
            size="small"
            options={tours}
            getOptionLabel={(option) => option.name || ""}
            value={value}
            multiple={multiple}
            onChange={(_event, newValue) => {
                if (multiple) {
                    onSelect(newValue as Tour[]);
                } else {
                    const tour = newValue as Tour || null;
                    onSelect(tour);
                }
            }}
            renderInput={renderInput ? renderInput : (params) =>
            (<TextField
                {...params}
                placeholder={multiple ? "Select Tours" : "Select a Tour"} />)}
            fullWidth
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

export default TourAutoComplete;