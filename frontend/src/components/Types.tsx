// User interface to represent user data
export interface User {
    id: string;
    email: string;
    displayName?: string;
    about?: string;
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    apartment?: string;
    country?: string;
    region?: string;
    postalCode?: string;
    phone?: string;
    tourLeague?: string;
    location?: string;
}

// Tour interface to represent tour data
export interface Tour {
    tour_id: number | null;
    label: string | null;
    year: number | null;
}

// Location interface to represent location data
export interface Location {
    tour_id: number;
    tour_label: string;
    year: number;
    locations: LocationDetail[];
}

// LocationDetail interface to represent detailed location data
export interface LocationDetail extends Location {
    location_id: number;
    label: string;
    year: number;
}

// Event interface to represent event data
export interface Event {
    tour_id: number;
    tour_label: string;
    year: number;
    events: LocationEvent[];
}

// LocationEvent interface to represent events for a specific location
export interface LocationEvent extends Event {
    location_id: number;
    events: EventItem[];
}

// EventItem interface to represent individual event details
export interface EventItem extends LocationEvent {
    event_id: number;
    name: string;
    course: string;
    date: string;
}

// EventSummaryProps interface to represent event summary data
export interface EventSummaryProps {
    selectedEvent: EventItem | null;
    tourLabel: string | null;
    locationLabel: string | null;
}

// SideGame interface to represent side game data
export interface SideGame {
    name: string;
    cost: number;
    selected: boolean;
}

// SideGames interface to represent side games data
export interface SideGames {
    name: string;
    key: string;
    value: number;
    selected: boolean;
}
