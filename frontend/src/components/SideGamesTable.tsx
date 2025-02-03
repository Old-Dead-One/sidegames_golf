import React from "react";
import { Checkbox, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface SideGamesTableProps {
    rows: Array<{ name: string; key: string; value: number; selected: boolean }>;
    net: string | null;
    division: string | null;
    superSkins: boolean;
    onNetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDivisionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSuperSkinsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddToCart: () => void;
    totalCost: number;
    disabled: boolean;
}

const SideGamesTable: React.FC<SideGamesTableProps> = ({
    rows,
    net,
    division,
    superSkins,
    onNetChange,
    onDivisionChange,
    onSuperSkinsChange,
    onAddToCart,
    disabled
}) => {
    const theme = useTheme();

    const totalCost = rows.reduce((acc: number, row) => {
        if (row.key === "Super Skins" && superSkins) {
            return acc + row.value;
        } else if (row.key === net || row.key === division) {
            return acc + row.value;
        }
        return acc;
    }, 0);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (value === "Super Skins") {
            onSuperSkinsChange(event);
        } else if (value.startsWith("D")) {
            onDivisionChange(event);
        } else {
            onNetChange(event);
        }
    };

    const getLabelColor = (key: string) => {
        if (key === "Super Skins") {
            return superSkins ? theme.palette.primary.main : theme.palette.text.disabled;
        } else if (key === net || key === division) {
            return theme.palette.primary.main;
        } else if (key === "Total") {
            return totalCost > 0 ? theme.palette.primary.main : theme.palette.text.disabled;
        } else {
            return theme.palette.text.disabled;
        }
    };

    return (
        <TableContainer component={Paper}>
            <Typography align="center" variant="h6" paddingTop={1}>
                <strong>Available Side Games</strong>
            </Typography>
            <Table size="small" width="100%" aria-label="side games table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1">
                                <strong>Select</strong>
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle1">
                                <strong>Games</strong>
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography align="right" variant="subtitle1">
                                <strong>Cost</strong>
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.key}>
                            <TableCell>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={row.key === "Super Skins"
                                                ? superSkins
                                                : (row.key === net || row.key === division)}
                                            onChange={handleCheckboxChange}
                                            value={row.key}
                                            sx={{ color: getLabelColor(row.key), padding: 0 }}
                                            disabled={disabled}
                                        />
                                    }
                                    label=""
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Typography sx={{ color: getLabelColor(row.key) }}>
                                    {row.name}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography sx={{ color: getLabelColor(row.key) }}>
                                    ${row.value.toFixed(2)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell component="th" scope="row"><strong>Total</strong></TableCell>
                        <TableCell colSpan={3} align="right">
                            <Typography sx={{ color: getLabelColor("Total") }}>
                                ${totalCost.toFixed(2)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} align="right">
                            <Stack direction="row" justifyContent="right">
                                <Button variant="contained" color="secondary" startIcon={<AddShoppingCartIcon />} onClick={onAddToCart}>
                                    Add to Cart
                                </Button>
                            </Stack>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SideGamesTable;