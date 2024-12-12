import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from 'react-toastify';
import { Tour, EventItem, LocationDetail, User } from "../components/Types";

interface UserContextUser extends User {
    id: string;
    email: string;
    displayName: string;
    about?: string;
    imageUrl?: string;
    phone?: string;
    tourLeague?: string;
    location?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    apartment?: string;
    country?: string;
    region?: string;
    postalCode?: string;
    makePrivate?: boolean;
    enableNotifications?: boolean;
    allowSMS?: boolean;
    allowEmail?: boolean;
    emailConfirmedAt?: string;
    lastSignInAt?: string;
    createdAt?: string;
    updatedAt?: string;
    isAnonymous?: boolean;
}

interface UserContextType {
    user: UserContextUser | null;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: boolean;
    cartItems: { eventSummary: any; sideGamesData: any }[];
    addToCart: (eventSummary: any, sideGamesData: any) => void;
    removeFromCart: (index: number) => void;
    isEventInCart: (event_id: number) => boolean;
    cartItemsCount: number;
    setCartItems: React.Dispatch<React.SetStateAction<{ eventSummary: any; sideGamesData: any }[]>>;
    updateUserProfile: (user: Partial<User> & { id: string }) => Promise<void>;
    handleError: (error: any, defaultMessage: string) => void;
    updateSelectedTourLocationEvent: (tour: Tour | null) => void;
    updateNotificationPreferences: (preferences: {
        makePrivate?: boolean;
        enableNotifications?: boolean;
        allowSMS?: boolean;
        allowEmail?: boolean;
    }) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    selectedTour: Tour | null;
    selectedLocation: LocationDetail | null;
    selectedEvent: EventItem | null;
    clearCart: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserContextUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<{ eventSummary: any; sideGamesData: any }[]>(() => {
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationDetail | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [error, setError] = useState("");

    // Fetch session on mount
    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const userWithDisplayName = {
                    ...session.user,
                    displayName: session.user.user_metadata?.displayName || '',
                    email: session.user.email || '',
                    phone: session.user.user_metadata?.phone || '',
                    firstName: session.user.user_metadata?.firstName || '',
                    lastName: session.user.user_metadata?.lastName || '',
                    address: session.user.user_metadata?.address || '',
                    apartment: session.user.user_metadata?.apartment || '',
                    country: session.user.user_metadata?.country || '',
                    region: session.user.user_metadata?.region || '',
                    postalCode: session.user.user_metadata?.postalCode || '',
                    tourLeague: session.user.user_metadata?.tourLeague || '',
                    makePrivate: session.user.user_metadata?.makePrivate || false,
                    enableNotifications: session.user.user_metadata?.enableNotifications || false,
                    allowSMS: session.user.user_metadata?.allowSMS || false,
                    allowEmail: session.user.user_metadata?.allowEmail || false,
                    emailConfirmedAt: session.user.email_confirmed_at,
                    lastSignInAt: session.user.last_sign_in_at,
                    createdAt: session.user.created_at,
                    updatedAt: session.user.updated_at,
                    isAnonymous: session.user.is_anonymous,
                };
                setUser(userWithDisplayName as UserContextUser);
                setIsLoggedIn(true);
            }
        };
        fetchSession();
    }, []);

    // Sync cart items with localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Utility function for error handling
    const handleError = (error: any, defaultMessage: string) => {
        const message = error.message || defaultMessage;
        setError(message);
        toast.error(message);
    };

    // SignUp function
    const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
        try {
            // Sign up the user with Supabase authentication
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { displayName },
                },
            });

            // Check for errors in sign-up
            if (error) throw error;

            // If sign-up is successful, insert user data into the profiles table
            if (data.user) {
                const { user } = data;

                // Insert user data into the profiles table
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: user.id, // Use the user's ID from Supabase
                            email: user.email,
                            displayName: displayName,
                        },
                    ]);

                // Check for errors during insertion
                if (insertError) throw insertError;

                // Update local state
                const userWithDisplayName = { ...user, displayName, email: user.email || '' } as UserContextUser;
                setUser(userWithDisplayName);
                setIsLoggedIn(true);
                setCartItems([]);
                toast.success("Sign Up successful, verification email sent to " + email);
            }
        } catch (error) {
            handleError(error, "Sign Up failed. Please try again.");
        }
    };

    // Login function
    const login = async (email: string, password: string): Promise<void> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (data.user) {
                const userWithDisplayName = {
                    ...data.user,
                    displayName: data.user.user_metadata?.displayName || '',
                    email: data.user.email || ''
                } as UserContextUser;
                setUser(userWithDisplayName);
                setIsLoggedIn(true);
                setCartItems([]);
                toast.success("Login successful, welcome back!");
            }
        } catch (error) {
            handleError(error, "Login failed. Please check your credentials and try again.");
        }
    };

    // Logout function
    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Logout error:", error);
                throw error;
            }

            // Clear all local state
            setUser(null);
            setIsLoggedIn(false);
            setCartItems([]);
            setSelectedTour(null);
            setSelectedLocation(null);
            setSelectedEvent(null);

            // Clear any local storage
            localStorage.removeItem('cartItems');

            toast.success("Logout successful, see you next time!");
        } catch (error: any) {
            console.error("Full logout error:", error);
            const message = error?.message || "Logout failed. Please try again.";
            if (message.includes('fetch')) {

                // If it's a connection error, force clear the session anyway
                setUser(null);
                setIsLoggedIn(false);
                setCartItems([]);
                localStorage.removeItem('cartItems');
                toast.warning("Connection issues, but you've been logged out locally.");
            } else {
                toast.error("Logout failed: " + message);
            }
        }
    };

    const updatePassword = async (password: string) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success("Password updated successfully!");
    };

    // Cart management
    const addToCart = (eventSummary: any, sideGamesData: any) => {
        setCartItems(prevItems => [...prevItems, { eventSummary, sideGamesData }]);
    };

    const removeFromCart = (index: number) => {
        setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const isEventInCart = (event_id: number) => {
        return cartItems.some(item => item.eventSummary.selectedEvent.event_id === event_id);
    };

    const cartItemsCount = cartItems.length;

    // Update User Profile
    const updateUserProfile = async (user: Partial<User> & { id: string }) => {
        try {
            // Prepare data to update, only include fields that are provided
            const dataToUpdate: Partial<User> = {};
            for (const key in user) {
                if (user[key as keyof User] !== undefined) {
                    dataToUpdate[key as keyof User] = user[key as keyof User];
                }
            }

            // Update user data in the profiles table
            const { error: dbError } = await supabase
                .from('profiles')
                .update(dataToUpdate)
                .eq('id', user.id);

            if (dbError) {
                console.error("Database error:", dbError);
                throw dbError;
            }

            // Update local user state
            setUser((prevUser) => {
                if (!prevUser) return null;
                return {
                    ...prevUser,
                    ...dataToUpdate, // Merge updated fields
                };
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            handleError(error, "Error updating profile. Please try again.");
        }
    };

    // Update Selected Tour, Location, and Event
    const updateSelectedTourLocationEvent = async (tour: Tour | null) => {
        try {
            setSelectedTour(tour);
            toast.success("Selected tour updated successfully!");
        } catch (error) {
            handleError(error, "Error updating selected tour. Please try again.");
        }
    };

    // Update Notification Preferences
    const updateNotificationPreferences = async (preferences: {
        makePrivate?: boolean;
        enableNotifications?: boolean;
        allowSMS?: boolean;
        allowEmail?: boolean;
    }) => {
        if (!user) return;

        // Update only the fields that exist in the profiles table
        const { error } = await supabase
            .from('profiles')
            .update({
                makePrivate: preferences.makePrivate,
                enableNotifications: preferences.enableNotifications,
                allowSMS: preferences.allowSMS,
                allowEmail: preferences.allowEmail,
            })
            .eq('id', user.id);

        if (error) {
            console.error("Error updating preferences:", error);
            throw error;
        }

        toast.success("Notification preferences updated successfully!");
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <UserContext.Provider value={{
            user,
            login,
            signUp,
            logout,
            isLoggedIn,
            cartItems,
            addToCart,
            removeFromCart,
            isEventInCart,
            cartItemsCount,
            setCartItems,
            updateUserProfile,
            updateSelectedTourLocationEvent,
            updateNotificationPreferences,
            updatePassword,
            selectedTour,
            selectedLocation,
            selectedEvent,
            handleError,
            error,
            setError,
            clearCart,
        }}>
            {children}
        </UserContext.Provider>
    );
};
