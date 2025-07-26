// App Constants
export const APP_NAME = 'SideGames Golf';
export const APP_VERSION = '1.0.0';

// Local Storage Keys
export const STORAGE_KEYS = {
    CART_ITEMS: 'cartItems',
    THEME_INDEX: 'themeIndex',
    USER_PREFERENCES: 'userPreferences',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    TOURS: 'tours',
    LOCATIONS: 'locations',
    EVENTS: 'events',
    SIDE_GAMES: 'side_games',
    PROFILES: 'profiles',
    PURCHASES: 'purchases',
} as const;

// Theme Colors
export const THEME_COLORS = {
    BLUE: '#66d3fa',
    GREEN: '#25f78c',
    GREY: '#808080',
    PINK: '#f72585',
    PURPLE: '#9159fe',
    ORANGE: '#ff6b35',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 8,
    DISPLAY_NAME_MIN_LENGTH: 2,
    DISPLAY_NAME_MAX_LENGTH: 50,
    PHONE_MIN_LENGTH: 10,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    INVALID_PHONE: 'Please enter a valid phone number',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful, welcome back!',
    SIGNUP_SUCCESS: 'Sign up successful, verification email sent!',
    LOGOUT_SUCCESS: 'Logout successful, see you next time!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PASSWORD_UPDATED: 'Password updated successfully!',
    CART_ITEM_ADDED: 'Event added to cart!',
    CART_ITEM_REMOVED: 'Item removed from cart!',
} as const; 