import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { supabase } from "../services/supabaseClient";
import Card from "../components/defaultcard";
import { Tour, EventItem } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUser } from "../context/UserContext";

interface CalendarProps {
    theme: string;
}

const Calendar: React.FC<CalendarProps> = ({ theme }) => {
    const [_tours, setTours] = useState<Tour[]>([]);
    const [_locations, setLocations] = useState<Location[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMyToursOnly, setShowMyToursOnly] = useState(false);

    const { joinedTours, isLoggedIn } = useUser();

    const [tooltip, setTooltip] = useState<{
        title: string;
        date: string;
        location_id: string;
        location_label: string;
        tour_id: string;
        tour_label: string;
        event_id: string;
        course_name: string; // <-- ad
        link: string;
        visible: boolean
    }>({ title: "", date: "", location_id: "", location_label: "", tour_id: "", tour_label: "", event_id: "", course_name: "", link: "", visible: false });
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: toursData, error: toursError } = await supabase.from('tours').select('*');
                const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');

                // Fetch events with joined location and tour data
                const { data: eventsData, error: eventsError } = await supabase
                    .from('events')
                    .select(`
                        *,
                        location:locations(id, name),
                        tour:tours(id, name)
                    `);

                if (toursError || locationsError || eventsError) {
                    throw new Error("Error fetching data from Supabase");
                }

                setTours(toursData);
                setLocations(locationsData);

                // Transform eventsData to match the structure required by FullCalendar
                const formattedEvents = eventsData.map(event => ({
                    id: event.id,
                    name: event.name,
                    event_date: event.event_date,
                    title: event.name,
                    start: event.event_date,
                    location_id: event.location?.id,
                    tour_id: event.tour?.id,
                    tour_label: event.tour?.name,
                    year: event.year,
                    description: event.description,
                    max_participants: event.max_participants,
                    current_participants: event.current_participants,
                    price: event.price,
                    created_at: event.created_at,
                    updated_at: event.updated_at,
                    course_name: event.course_name, // <-- add this
                    extendedProps: {
                        location: {
                            id: event.location?.id,
                            name: event.location?.name
                        },
                        tour: {
                            id: event.tour?.id,
                            name: event.tour?.name
                        },
                        event_id: event.id,
                        course_name: event.course_name // <-- add this
                    }
                }));

                setEvents(formattedEvents);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEventClick = (event: any) => {
        const eventDate = new Date(event.event.start).toLocaleDateString();
        setTooltip({
            title: event.event.title,
            date: eventDate,
            location_id: event.event.extendedProps.location.id,
            location_label: event.event.extendedProps.location.name,
            tour_id: event.event.extendedProps.tour.id,
            tour_label: event.event.extendedProps.tour.name,
            event_id: event.event.extendedProps.event_id,
            course_name: event.event.extendedProps.course_name, // <-- add this
            link: `/Dashboard?event_id=${event.event.extendedProps.event_id}&tour_id=${event.event.extendedProps.tour.id}&location_id=${event.event.extendedProps.location.id}`,
            visible: true,
        });
    };

    const closeTooltip = () => {
        setTooltip({ title: "", date: "", location_id: "", location_label: "", tour_id: "", tour_label: "", event_id: "", course_name: "", link: "", visible: false });
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

    // Filter tours based on toggle
    const filteredEvents = showMyToursOnly && joinedTours.length > 0
        ? events.filter(event => event.tour_id && joinedTours.includes(event.tour_id))
        : events;

    if (loading) {
        return (
            <Card title="Calendar" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    return (
        <Card
            title="Event Calendar"
            theme={theme}
            includeInnerCard={true}
            footerTitle="📅 Calendar Features"
            footerContent={
                <div className="text-xs text-gray-300 bg-gray-800 bg-opacity-80 rounded-lg p-3">
                    <ul className="list-disc list-inside space-y-1 text-left">
                        <li>Click on any event to see details and go to Find a Game</li>
                        <li>Use "My Tours" toggle to filter events (when logged in)</li>
                        <li>Navigate between months with arrow buttons</li>
                        <li>Click "Today" to return to current month</li>
                    </ul>
                    <div className="mt-2 text-yellow-300">
                        💡 <strong>Tip:</strong> Events link to the Find a Game page where you can join tournaments.
                    </div>
                    {!isLoggedIn && (
                        <div className="mt-2 text-blue-300">
                            🔍 <strong>Browse freely:</strong> You can view all events without an account. Sign in to join tournaments.
                        </div>
                    )}
                </div>
            }
        >
            {isLoggedIn && (
                <div className="flex items-center justify-end w-full mb-4">
                    <label htmlFor="my-tours-switch" className="text-xs text-gray-700 select-none mr-1">
                        My Tours:
                    </label>
                    <div className="group relative inline-flex h-5 w-10 shrink-0 items-center justify-center rounded-full">
                        <span
                            className={`absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out
                                ${showMyToursOnly ? 'bg-indigo-600' : 'bg-gray-200'}
                            `}
                        />
                        <span
                            className={`absolute left-0 size-5 rounded-full border bg-white shadow-xs transition-transform duration-200 ease-in-out
                                ${showMyToursOnly ? 'border-indigo-600 translate-x-5' : 'border-gray-300'}
                            `}
                        />
                        <input
                            id="my-tours-switch"
                            name="my-tours-switch"
                            type="checkbox"
                            aria-label="My Tours"
                            checked={showMyToursOnly}
                            onChange={() => setShowMyToursOnly(v => !v)}
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        />
                    </div>
                </div>
            )}
            <div className="text-left flex justify-center max-w-4xl mx-auto">
                <div className="p-4 text-xs bg-white bg-opacity-95 rounded-lg">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={filteredEvents}
                        headerToolbar={{
                            center: "title",
                            left: "prev,next",
                            right: "today",
                        }}
                        dayHeaderClassNames="bg-gray-400 font-semibold"
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
                        <div className="text-sm">{tooltip.tour_label}</div>
                        <div className="text-sm">{tooltip.location_label}</div>
                        <div className="text-sm">{tooltip.course_name}</div>
                        <div className="text-sm">{tooltip.date}</div>
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
