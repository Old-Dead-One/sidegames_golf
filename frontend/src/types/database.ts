// Database types matching the current schema
// Based on tabledef.json schema

export interface Tour {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Location {
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

export interface TourLocation {
    id: string;
    tour_id: string;
    location_id: string;
    created_at: string;
}

export interface Event {
    id: string;
    name: string;
    tour_id?: string;
    location_id?: string;
    event_date: string; // ISO date string
    year: number;
    description?: string;
    max_participants?: number;
    current_participants: number;
    price?: number;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    email: string;
    display_name?: string;
    about?: string;
    image_url?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    apartment?: string;
    country?: string;
    region?: string;
    postal_code?: string;
    phone?: string;
    tour_league?: string;
    location?: string;
    make_private: boolean;
    enable_notifications: boolean;
    allow_sms: boolean;
    allow_email: boolean;
    created_at: string;
    updated_at: string;
}

export interface SideGame {
    id: number;
    name: string;
    key: string;
    value: number;
    description?: string;
    created_at: string;
}

export interface Purchase {
    id: number;
    user_id?: string;
    event_id?: number;
    side_games_data: any; // JSONB data
    total_cost: number;
    purchase_date: string;
    status: string;
}

// Database table names
export type DatabaseTable =
    | 'tours'
    | 'locations'
    | 'tour_locations'
    | 'events'
    | 'profiles'
    | 'side_games'
    | 'purchases';

// Helper types for API responses
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    error: string | null;
} 