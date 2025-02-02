import React from "react";
import { EventItem } from "./Types";
import { Accordion, TextField, List, Box, ListItem } from "@mui/material";

interface EventSummaryProps {
    selectedEvent: EventItem | null;
    tourLabel: string | null;
    locationLabel: string | null;
}

const getEntryStatus = (event_date: string): string => {
    const eventDateObj = new Date(event_date);
    if (isNaN(eventDateObj.getTime())) {
        return "Invalid date"; // Handle invalid date
    }

    const closingEventDate = new Date(event_date);
    closingEventDate.setDate(closingEventDate.getDate() - 1);
    closingEventDate.setHours(22, 0, 0, 0); // 10:00 PM

    const now = new Date();
    const timeRemaining = closingEventDate.getTime() - now.getTime();

    // Check if the event date has already passed
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

const EventSummary: React.FC<EventSummaryProps> = ({ selectedEvent, tourLabel, locationLabel }) => {
    if (!selectedEvent) {
        return (
            <Accordion>
                <TextField
                    sx={{}}
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
            <List sx={{ maxWidth: "300px" }}>
                <ListItem disableGutters disablePadding><strong>Tour:&nbsp;</strong> {tourLabel}</ListItem>
                <ListItem disableGutters disablePadding><strong>Location:&nbsp;</strong> {locationLabel}</ListItem>
                <ListItem disableGutters disablePadding><strong>Event Name:&nbsp;</strong> {selectedEvent.name}</ListItem>
                <ListItem disableGutters disablePadding><strong>Course:&nbsp;</strong> {selectedEvent.course}</ListItem>
                <ListItem disableGutters disablePadding><strong>Date:&nbsp;</strong> {selectedEvent.event_date}</ListItem>
                <ListItem disableGutters disablePadding>
                    <strong>Closes in:&nbsp;</strong> {entryStatus}
                </ListItem>
            </List>
        </Box>
    );
};

export default EventSummary;