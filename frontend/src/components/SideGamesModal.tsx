import React, { useState, useEffect } from 'react';
import { Checkbox, TextField, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-toastify';

interface SideGame {
    id: number;
    key: string;
    value: number;
    description: string;
    created_at: string;
    selected: boolean;
    entranceFee: number;
}

interface SideGamesModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (sideGames: SideGame[]) => void;
    onChange?: (sideGames: SideGame[]) => void;
}

const SideGamesModal: React.FC<SideGamesModalProps> = ({ open, onClose, onSave, onChange }) => {
    const [sideGames, setSideGames] = useState<SideGame[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) fetchSideGames();
    }, [open]);

    const fetchSideGames = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('side_games')
                .select('*')
                .order('key'); // Sort by key for custom order

            if (error) throw error;

            const transformed: SideGame[] = (data || []).map(game => {
                // Default selected to true for keys 01_ to 08_
                const isDefault = /^0[1-8]_/.test(game.key);
                return {
                    ...game,
                    selected: isDefault,
                    entranceFee: game.value
                };
            });
            setSideGames(transformed);
        } catch (error) {
            toast.error('Failed to load side games');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (id: number) => {
        setSideGames(prev => {
            const updated = prev.map(game =>
                game.id === id ? { ...game, selected: !game.selected } : game
            );
            onChange?.(updated);
            return updated;
        });
    };

    const handleFeeChange = (id: number, fee: number) => {
        setSideGames(prev => {
            const updated = prev.map(game =>
                game.id === id ? { ...game, entranceFee: Math.max(0, fee) } : game
            );
            onChange?.(updated);
            return updated;
        });
    };

    const handleSave = () => {
        const selected = sideGames.filter(sg => sg.selected);
        if (selected.length === 0) {
            toast.error("You must select at least one side game.");
            return;
        }
        const invalidFee = selected.some(sg => Number(sg.entranceFee) < 5);
        if (invalidFee) {
            toast.error("Each side game must have an entrance fee of at least $5.00.");
            return;
        }
        onSave?.(sideGames);
        onClose();
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={false} PaperProps={{ style: { maxWidth: 380, width: '100%' } }}>
            <DialogTitle>Configure Side Games</DialogTitle>
            <DialogContent dividers style={{ maxHeight: '70vh', overflowY: 'auto', maxWidth: 380 }}>
                {loading ? (
                    <Typography>Loading side games...</Typography>
                ) : (
                    <Box className="space-y-1">
                        {sideGames.map(game => (
                            <Box key={game.id} className="flex items-center">
                                <Checkbox
                                    checked={game.selected}
                                    onChange={() => handleToggle(game.id)}
                                    color="primary"
                                    size="small"
                                />
                                <Typography variant="subtitle2" className="flex-1 text-left">
                                    {game.description}
                                </Typography>
                                <TextField
                                    label="Cost $"
                                    type="number"
                                    value={game.entranceFee}
                                    onChange={e => handleFeeChange(game.id, Number(e.target.value))}
                                    size="small"
                                    variant="outlined"
                                    inputProps={{ min: 0, step: 1, style: { fontSize: '0.85rem', padding: '4px 8px' } }}
                                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.8rem' } }}
                                    style={{ width: 70 }}
                                    disabled={!game.selected}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SideGamesModal; 