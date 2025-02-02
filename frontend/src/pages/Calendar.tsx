import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { supabase } from "../services/supabaseClient";
import Card from "../components/defaultcard";
import { Tour, Location, EventItem } from "../components/Types";
// import eventsData from "../data/events.json";

interface CalendarProps {
    theme: string;
}

const Calendar: React.FC<CalendarProps> = ({ theme }) => {
    const [_tours, setTours] = useState<Tour[]>([]);
    const [_locations, setLocations] = useState<Location[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);

    const [tooltip, setTooltip] = useState<{
        title: string;
        date: string;
        location_id: number;
        location_label: string;
        tour_id: number;
        tour_label: string;
        event_id: number;
        link: string;
        visible: boolean
    }>({ title: "", date: "", location_id: 0, location_label: "", tour_id: 0, tour_label: "", event_id: 0, link: "", visible: false });
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: toursData, error: toursError } = await supabase.from('tours').select('*');
                const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');

                // Fetch events with joined location and tour labels
                const { data: eventsData, error: eventsError } = await supabase
                    .from('events')
                    .select(`
                        *,
                        location:locations(location_id, label),
                        tour:tours(tour_id, label)
                    `);

                if (toursError || locationsError || eventsError) {
                    throw new Error("Error fetching data from Supabase");
                }

                setTours(toursData);
                setLocations(locationsData);

                // Transform eventsData to match the structure required by FullCalendar
                const formattedEvents = eventsData.map(event => ({
                    event_id: event.event_id,
                    name: event.name,
                    course: event.course,
                    event_date: event.event_date,
                    title: event.name,
                    start: event.event_date,
                    location_id: event.location.location_id,
                    tour_id: event.tour.tour_id,
                    tour_label: event.tour.label,
                    year: new Date(event.event_date).getFullYear(),
                    events: [],
                    extendedProps: {
                        location: {
                            id: event.location.location_id,
                            label: event.location.label
                        },
                        tour: {
                            id: event.tour.tour_id,
                            label: event.tour.label
                        },
                        event_id: event.event_id
                    }
                }));

                setEvents(formattedEvents);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [events]);

    const handleEventClick = (event: any) => {
        const eventDate = new Date(event.event.start).toLocaleDateString();
        setTooltip({
            title: event.event.title,
            date: eventDate,
            location_id: event.event.extendedProps.location.id,
            location_label: event.event.extendedProps.location.label,
            tour_id: event.event.extendedProps.tour.id,
            tour_label: event.event.extendedProps.tour.label,
            event_id: event.event.extendedProps.event_id,
            link: `/Dashboard?event_id=${event.event.extendedProps.event_id}&tour_id=${event.event.extendedProps.tour.id}&location_id=${event.event.extendedProps.location.id}`,
            visible: true,
        });
    };

    const closeTooltip = () => {
        setTooltip({ title: "", date: "", location_id: 0, location_label: "", tour_id: 0, tour_label: "", event_id: 0, link: "", visible: false });
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
            className="mx-4"
        // footerContent={<button className="text-blue-600">Footer Action</button>}
        >
            <div className="p-2 text-left flex justify-center max-w-4xl mx-auto">
                <div className="p-4 text-xs text-white bg-neutral-500 bg-opacity-95 rounded-lg">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        headerToolbar={{
                            center: "title",
                            left: "prev,next",
                            right: "today",
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
                                        textAlign: 'center',
                                        width: '100%',
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
                        className="bg-white border border-gray-300 rounded p-2 text-opacity-100"
                    >
                        <span className="font-bold">{tooltip.title}</span>
                        <div className="text-sm">Date: {tooltip.date}</div>
                        <div className="text-sm">Location: {tooltip.location_label}</div>
                        <div className="text-sm">Tour: {tooltip.tour_label}</div>
                        <a
                            href={tooltip.link}
                            className="text-blue-500 underline"
                            onClick={(e) => {
                                e.preventDefault();
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
