import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Card from "../components/defaultcard";
import eventsData from "../data/events.json";

interface CalendarProps {
    theme: string;
}

const Calendar: React.FC<CalendarProps> = ({ theme }) => {
    const [tooltip, setTooltip] = useState<{
        title: string;
        date: string;
        location_id: number;
        tour_id: number;
        event_id: number;
        link: string;
        visible: boolean
    }>({ title: "", date: "", location_id: 0, tour_id: 0, event_id: 0, link: "", visible: false });
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const events = eventsData.flatMap(tour =>
        tour.events.flatMap(location =>
            location.events.map(event => ({
                title: event.name,
                start: event.date,
                extendedProps: {
                    location: location.location_id,
                    tour: tour.tour_label,
                    event_id: event.event_id
                }
            }))
        )
    );

    const handleEventClick = (event: any) => {
        const eventDate = new Date(event.event.start).toLocaleDateString();
        setTooltip({
            title: event.event.title,
            date: eventDate,
            location_id: event.event.extendedProps.location,
            tour_id: event.event.extendedProps.tour,
            event_id: event.event.extendedProps.event_id,
            link: `/Dashboard?event_id=${event.event.extendedProps.event_id}&tour_id=${event.event.extendedProps.tour}&location_id=${event.event.extendedProps.location}`,
            visible: true,
        });
    };

    const closeTooltip = () => {
        setTooltip({ title: "", date: "", location_id: 0, tour_id: 0, event_id: 0, link: "", visible: false });
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
            closeTooltip();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <Card
            title="Event Calendar"
            theme={theme}
        // footerContent={<button className="text-blue-600">Footer Action</button>}
        >
            <div className="p-2">
                <div className="p-4 flex text-center text-xs text-white bg-neutral-500 bg-opacity-95 rounded-lg">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        headerToolbar={{
                            center: "title",
                            left: "prev,next today",
                            right: "",
                        }}
                        dayHeaderClassNames="bg-gray-100 text-gray-700 font-semibold"
                        dayCellClassNames="border border-gray-700"
                        eventContent={(arg) => (
                            <div
                                className="flex flex-col items-center cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(arg);
                                }}
                            >
                                <span
                                    style={{
                                        maxWidth: '32px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        display: 'block',
                                    }}
                                    className="text-white"
                                >
                                    {arg.event.title}
                                </span>
                            </div>
                        )}
                        height="auto"
                        contentHeight="auto"
                    />
                </div>
            </div>
            {tooltip.visible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div
                        ref={tooltipRef}
                        className="bg-white border border-gray-300 rounded p-4 text-opacity-100"
                    >
                        <span className="font-bold">{tooltip.title}</span>
                        <div className="text-sm">Date: {tooltip.date}</div>
                        <div className="text-sm">Location: {tooltip.location_id}</div>
                        <div className="text-sm">Tour: {tooltip.tour_id}</div>
                        <a
                            href={tooltip.link}
                            className="text-blue-500 underline"
                            onClick={(e) => {
                                e.preventDefault();
                                console.log("Event data being passed to Dashboard:", {
                                    title: tooltip.title,
                                    date: tooltip.date,
                                    location_id: tooltip.location_id,
                                    tour_id: tooltip.tour_id,
                                    event_id: tooltip.event_id,
                                    link: tooltip.link,
                                });
                                closeTooltip();
                                window.location.href = tooltip.link;
                            }}
                        >
                            Go to Event
                        </a>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default Calendar;
