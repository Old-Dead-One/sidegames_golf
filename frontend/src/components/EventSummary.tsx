import React from "react";
import { EventItem } from "../types";
import { Accordion, TextField, List, Box, ListItem } from "@mui/material";

interface EventSummaryProps {
    selectedEvent: EventItem | null;
    tourLabel: string | null;
    locationLabel: string | null;
    sideGames?: { name: string; fee: number | null }[];
}

function formatEventDate(dateStr: string) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    // month is 0-based in JS Date
    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-US");
}

const getEntryStatus = (event_date: string): string => {
    // Parse the event date as local
    const [year, month, day] = event_date.split("-");
    const eventDateObj = new Date(Number(year), Number(month) - 1, Number(day));

    if (isNaN(eventDateObj.getTime())) {
        return "Invalid date";
    }

    // Set closing time to 10:00 PM the night before
    const closingEventDate = new Date(eventDateObj);
    closingEventDate.setDate(closingEventDate.getDate() - 1);
    closingEventDate.setHours(22, 0, 0, 0); // 10:00 PM local time

    const now = new Date();
    const timeRemaining = closingEventDate.getTime() - now.getTime();

    if (now >= eventDateObj) {
        return "Closed";
    }

    if (now >= closingEventDate) {
        return "Closed";
    } else {
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${daysRemaining} days ${hoursRemaining} hours`;
    }
};

const EventSummary: React.FC<EventSummaryProps> = ({ selectedEvent, tourLabel, locationLabel, sideGames }) => {
    if (!selectedEvent) {
        return (
            <Accordion>
                <TextField
                    size="small"
                    label="No event selected"
                    disabled
                    fullWidth
                    variant="outlined"
                />
            </Accordion>
        );
    }

    const entryStatus = getEntryStatus(selectedEvent.event_date);

    return (
        <Box>
            <List>
                <ListItem disableGutters disablePadding><strong>Tour:&nbsp;</strong> {tourLabel}</ListItem>
                <ListItem disableGutters disablePadding><strong>Location:&nbsp;</strong> {locationLabel}</ListItem>
                <ListItem disableGutters disablePadding><strong>Event Name:&nbsp;</strong> {selectedEvent.name}</ListItem>
                <ListItem disableGutters disablePadding><strong>Course:&nbsp;</strong> {selectedEvent.course_name}</ListItem>
                <ListItem disableGutters disablePadding><strong>Date:&nbsp;</strong> {formatEventDate(selectedEvent.event_date)}</ListItem>
                <ListItem disableGutters disablePadding>
                    <strong>Closes in:&nbsp;</strong> {entryStatus}
                </ListItem>
                {sideGames && sideGames.length > 0 && (
                    <ListItem disableGutters disablePadding>
                        <strong>Side Games:&nbsp;</strong>
                        <ul style={{ margin: 0, paddingLeft: 8 }}>
                            {sideGames.map(sg => (
                                <li key={sg.name}>{sg.name} - Fee: ${sg.fee}</li>
                            ))}
                        </ul>
                    </ListItem>
                )}
            </List>
        </Box>
    );
};

export default EventSummary;