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
    showEmail?: boolean;
    showFirstName?: boolean;
    showLastName?: boolean;
    showPhone?: boolean;
    profilePictureUrl?: string; // URL to the user's profile picture in Supabase Storage
}

// Tour interface to represent tour data (persistent, no year)
export interface Tour {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

// Location interface to represent location data (persistent, no tour_id)
export interface LocationDetail {
    id: string;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
    website?: string;
    created_at: string;
    updated_at: string;
}

// Event interface to represent individual event details
export interface EventItem {
    id: string;
    tour_id?: string;
    location_id?: string;
    name: string;
    event_date: string;
    year: number;
    course_name?: string;
    created_at: string;
    updated_at: string;
}

// SideGames interface to represent side games data
export interface SideGames {
    name: string;
    key: string;
    value: number;
    selected: boolean;
}

export interface CourseDetails {
    course_name: string;
}

// Cart and Purchase Types
export interface CartItem {
    eventSummary: EventSummary;
    sideGamesData: SideGamesData;
}

export interface EventSummary {
    selectedEvent: EventItem;
    tourLabel: string | null;
    locationLabel: string | null;
}

export interface SideGamesData {
    net: string | null;
    division: string | null;
    superSkins: boolean;
    rows: SideGameRow[];
    totalCost: number;
}

export interface SideGameRow {
    name: string;
    cost: number;
    selected: boolean;
}

// API Response Types
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

// Form Types
export interface FormField {
    value: string;
    error: string | null;
    touched: boolean;
}

// Theme Types
export interface Theme {
    primary: string;
    background: string;
    text: string;
}

// Notification Types
export interface NotificationPreferences {
    makePrivate: boolean;
    enableNotifications: boolean;
    allowSMS: boolean;
    allowEmail: boolean;
}