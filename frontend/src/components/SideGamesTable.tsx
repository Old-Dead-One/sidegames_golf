import React from "react";
import { Checkbox, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { toast } from 'react-toastify';

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
    purchasedSideGames: Set<string>;
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
    disabled,
    totalCost,
    purchasedSideGames
}) => {
    const theme = useTheme();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        console.log('Checkbox clicked:', value);

        const normalizedKey = (value || '')
            .toLowerCase()
            .replace(/^[0-9]+_/, '')
            .replace(/[^a-z0-9]/g, '_');

        // If already purchased, show a message but allow the user to see their purchase
        if (purchasedSideGames.has(normalizedKey)) {
            console.log('Already purchased:', value);
            toast.info("You have already purchased this side game for this event.");
            return;
        }

        // If this is a net game and user already purchased a net game, prevent selection
        if (/net/i.test(value) && Array.from(purchasedSideGames).some(key => /net/i.test(key))) {
            console.log('Net game already purchased, blocking:', value);
            toast.error("You have already purchased a net game for this event.");
            return;
        }

        // If this is a division game and user already purchased a division game, prevent selection
        if (/d[1-5][_ ]skins/i.test(value) && Array.from(purchasedSideGames).some(key => /d[1-5][_ ]skins/i.test(key))) {
            console.log('Division game already purchased, blocking:', value);
            toast.error("You have already purchased a division skins game for this event.");
            return;
        }

        // Otherwise, proceed as before
        if (/super[_ ]skins/i.test(value)) {
            console.log('Super Skins handler:', value);
            onSuperSkinsChange(event);
        } else if (/d[1-5][_ ]skins/i.test(value)) {
            console.log('Division handler:', value);
            onDivisionChange(event);
        } else if (/net/i.test(value)) {
            console.log('Net handler:', value);
            onNetChange(event);
        } else {
            console.log('Fallback net handler:', value);
            onNetChange(event);
        }
    };

    const isSuperSkins = (key: string) => /super[_ ]skins/i.test(key);

    const getLabelColor = (key: string) => {
        const normalizedKey = (key || '')
            .toLowerCase()
            .replace(/^[0-9]+_/, '')
            .replace(/[^a-z0-9]/g, '_');

        // If purchased, show as disabled/greyed out
        if (purchasedSideGames.has(normalizedKey)) {
            return theme.palette.text.disabled;
        }

        if (isSuperSkins(key)) {
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
                    {rows.map((row) => {
                        const normalizedKey = (row.key || '')
                            .toLowerCase()
                            .replace(/^[0-9]+_/, '')
                            .replace(/[^a-z0-9]/g, '_');
                        return (
                            <TableRow key={row.key}>
                                <TableCell>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={
                                                    purchasedSideGames.has(normalizedKey) ||
                                                    (isSuperSkins(row.key) ? superSkins : (row.key === net || row.key === division))
                                                }
                                                onChange={handleCheckboxChange}
                                                value={row.key}
                                                sx={{
                                                    color: purchasedSideGames.has(normalizedKey) ? theme.palette.text.disabled : getLabelColor(row.key),
                                                    padding: 0
                                                }}
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
                        );
                    })}
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