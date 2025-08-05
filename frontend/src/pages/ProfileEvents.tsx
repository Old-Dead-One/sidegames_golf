import React, { useEffect, useState, useMemo } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

interface ProfileEventsProps {
    theme: string;
}

const ProfileEvents: React.FC<ProfileEventsProps> = ({ theme }) => {
    const { user, loading } = useUser();
    const [enteredEvents, setEnteredEvents] = useState<any[]>([]);
    const [createdEvents, setCreatedEvents] = useState<any[]>([]);
    const [tours, setTours] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);

    // Build lookup maps for tour and location names
    const tourMap = useMemo(
        () => Object.fromEntries(tours.map((t: any) => [t.id, t.name
        ])),
        [tours]
    );
    const locationMap = useMemo(
        () => Object.fromEntries(locations.map((l: any) => [l.id, l.name])),
        [locations]
    );

    useEffect(() => {
        const fetchLookUps = async () => {
            const { data: toursData } = await supabase.from('tours').select('id, name');
            setTours(toursData || []);
            const { data: locationsData } = await supabase.from('locations').select('id, name');
            setLocations(locationsData || []);
        };
        fetchLookUps();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            if (user) {
                // Events entered (from purchases)
                const { data: entered, error: enteredError } = await supabase
                    .from('purchases')
                    .select(`
                        id,
                        event_id,
                        purchase_date,
                        side_games_data,
                        total_cost,
                        events (
                            id,
                            name,
                            event_date,
                            course_name,
                            tour_id,
                            location_id
                        )
                    `)
                    .eq('user_id', user.id);
                if (enteredError) {
                    toast.error("Error fetching entered events");
                } else {
                    // Deduplicate events by event_id to show each event only once
                    const uniqueEvents = (entered || []).reduce((acc: any[], current: any) => {
                        const eventId = current.event_id;
                        const exists = acc.find(item => item.event_id === eventId);
                        if (!exists) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    setEnteredEvents(uniqueEvents);
                }

                // Events created (from events table)
                const { data: created, error: createdError } = await supabase
                    .from('events')
                    .select(`
                        id,
                        name,
                        event_date,
                        course_name,
                        tour_id,
                        location_id
                    `)
                    .eq('user_id', user.id);
                if (createdError) {
                    toast.error("Error fetching created events");
                } else {
                    setCreatedEvents(created || []);
                }
            }
        };
        fetchEvents();
    }, [user]);

    if (loading) {
        return (
            <Card title="My Events" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    return (
        <Card
            title="My Events"
            theme={theme}
            includeInnerCard={true}
            paddingClassName="p-0"
        >
            <div className="p-2 text-left flex justify-center mx-auto w-full">
                <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0 w-full">
                    <Profilenav />

                    {/* Events you have entered */}
                    <form className="mt-2 text-sm divide-y divide-white lg:col-span-9 w-full lg:pl-4">
                        <div className="py-1">
                            <p className="text-xs text-yellow-300">
                                Events you have entered:
                            </p>
                            <table role="table" className="text-xs divide-y divide-white w-full table-fixed lg:table-auto w-full">
                                <thead>
                                    <tr className="w-full">
                                        <th className="w-1/3">Event</th>
                                        <th className="w-1/4">Course</th>
                                        <th className="w-1/4">Date</th>
                                        <th className="w-1/4">Tour</th>
                                        <th className="w-1/4">Location</th>
                                        {/* <th>Cost</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-400">
                                    {enteredEvents.map((entry) => (
                                        <tr key={entry.event_id} className="w-full">
                                            <td className="py-1 pr-1">{entry.events?.name || 'Unknown Event'}</td>
                                            <td>{entry.events?.course_name || ''}</td>
                                            <td>
                                                {entry.events?.event_date
                                                    ? (() => {
                                                        const d = new Date(entry.events.event_date);
                                                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                                                        const dd = String(d.getDate()).padStart(2, '0');
                                                        const yy = d.getFullYear().toString().slice(-2);
                                                        return `${mm}/${dd}/${yy}`;
                                                    })()
                                                    : ''}
                                            </td>
                                            <td>{tourMap[entry.events?.tour_id] || ''}</td>
                                            <td>{locationMap[entry.events?.location_id] || ''}</td>
                                            {/* <td>${entry.total_cost}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-yellow-300">
                                Events you have created:
                            </p>
                            <table role="table" className="text-xs divide-y divide-white w-full table-fixed lg:table-auto w-full">
                                <thead>
                                    <tr className="w-full">
                                        <th className="w-1/3">Event</th>
                                        <th className="w-1/4">Course</th>
                                        <th className="w-1/4">Date</th>
                                        <th className="w-1/4">Tour</th>
                                        <th className="w-1/4">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-400">
                                    {createdEvents.map((event) => (
                                        <tr key={event.id} className="w-full">
                                            <td className="py-1">{event.name}</td>
                                            <td>{event.course_name || ''}</td>
                                            <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : ''}</td>
                                            <td>{tourMap[event.tour_id] || ''}</td>
                                            <td>{locationMap[event.location_id] || ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </Card>
    );
};

export default ProfileEvents; 