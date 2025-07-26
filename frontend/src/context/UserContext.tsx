import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from 'react-toastify';
import { Tour, EventItem, LocationDetail, User, CartItem, EventSummary, SideGamesData, NotificationPreferences } from "../types";
import { STORAGE_KEYS, SUCCESS_MESSAGES } from "../constants";
import { useLocation } from "react-router-dom";
import { getUserTours } from "../services/supabaseUserAPI";

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
    cartItems: CartItem[];
    addToCart: (eventSummary: EventSummary, sideGamesData: SideGamesData) => void;
    removeFromCart: (index: number) => void;
    isEventInCart: (event_id: string) => boolean;
    cartItemsCount: number;
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    updateUserProfile: (user: Partial<User> & { id: string }) => Promise<void>;
    handleError: (error: unknown, defaultMessage: string) => void;
    updateSelectedTourLocationEvent: (tour: Tour | null) => void;
    updateNotificationPreferences: (preferences: NotificationPreferences) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    selectedTour: Tour | null;
    selectedLocation: LocationDetail | null;
    selectedEvent: EventItem | null;
    clearCart: () => void;
    loading: boolean;
    joinedTours: string[];
    refreshJoinedTours: (userId: string) => Promise<void>;
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
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const savedCartItems = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationDetail | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [joinedTours, setJoinedTours] = useState<string[]>([]);

    // Safety check: fetch profile on session load
    useEffect(() => {
        const fetchSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                let { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError || !profileData) {
                    // Try to create the profile
                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert([{
                            id: session.user.id,
                            email: session.user.email,
                            display_name: session.user.user_metadata?.displayName || '',
                        }]);
                    if (insertError) {
                        await supabase.auth.signOut();
                        setUser(null);
                        setIsLoggedIn(false);
                        setError("Your profile could not be created. Please contact support.");
                        return;
                    }
                    // Try fetching again
                    ({ data: profileData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single());
                }

                // Map database fields to frontend fields
                const userWithProfile = {
                    ...session.user,
                    displayName: profileData?.display_name || session.user.user_metadata?.displayName || '',
                    email: profileData?.email || session.user.email || '',
                    phone: profileData?.phone || session.user.user_metadata?.phone || '',
                    firstName: profileData?.first_name || session.user.user_metadata?.firstName || '',
                    lastName: profileData?.last_name || session.user.user_metadata?.lastName || '',
                    about: profileData?.about || '',
                    profilePictureUrl: profileData?.profile_picture_url || "",
                    address: profileData?.address || session.user.user_metadata?.address || '',
                    apartment: profileData?.apartment || session.user.user_metadata?.apartment || '',
                    country: profileData?.country || session.user.user_metadata?.country || '',
                    region: profileData?.region || session.user.user_metadata?.region || '',
                    postalCode: profileData?.postal_code || session.user.user_metadata?.postalCode || '',
                    tourLeague: profileData?.tour_league || session.user.user_metadata?.tourLeague || '',
                    makePrivate: profileData?.make_private || session.user.user_metadata?.makePrivate || false,
                    enableNotifications: profileData?.enable_notifications || session.user.user_metadata?.enableNotifications || false,
                    allowSMS: profileData?.allow_sms || session.user.user_metadata?.allowSMS || false,
                    allowEmail: profileData?.allow_email || session.user.user_metadata?.allowEmail || false,
                    emailConfirmedAt: session.user.email_confirmed_at,
                    lastSignInAt: session.user.last_sign_in_at,
                    createdAt: session.user.created_at,
                    updatedAt: session.user.updated_at,
                    isAnonymous: session.user.is_anonymous,
                };
                setUser(userWithProfile as UserContextUser);
                setIsLoggedIn(true);
            }
            setLoading(false);
        };
        fetchSession();
    }, []);

    // Optional: Safety check on route change if logged in but profile is missing
    useEffect(() => {
        // Only check if user is logged in and profile is not loaded
        if (isLoggedIn && !user) {
            const checkProfile = async () => {
                try {
                    const { data: sessionData } = await supabase.auth.getSession();
                    const session = sessionData.session;
                    if (session) {
                        const { data: profileData, error: profileError } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();
                        if (profileError || !profileData) {
                            await supabase.auth.signOut();
                            setUser(null);
                            setIsLoggedIn(false);
                            setError("Your profile could not be found. Please contact support or sign up again.");
                        }
                    }
                } catch (error) {
                    await supabase.auth.signOut();
                    setUser(null);
                    setIsLoggedIn(false);
                    setError("A critical error occurred. Please try again later.");
                }
            };
            checkProfile();
        }
    }, [location]);

    // Sync cart items with localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
    }, [cartItems]);

    // On login/profile update, fetch joined tours
    useEffect(() => {
        if (user && user.id) {
            refreshJoinedTours(user.id);
        } else {
            setJoinedTours([]);
        }
    }, [user]);

    // Utility function for error handling
    const handleError = (error: unknown, defaultMessage: string) => {
        const message = error instanceof Error ? error.message : defaultMessage;
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

            // If your Supabase project requires email verification, data.session will be null
            if (!data.session) {
                toast.info("Check your email to verify your account before continuing.");
                return;
            }

            // Now insert into profiles table
            const { user } = data;
            const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: user?.id,
                        email: user?.email,
                        display_name: displayName,
                    },
                ]);
            if (insertError) throw insertError;

            // Update local state
            const userWithDisplayName = { ...user, displayName, email: user?.email || '' } as UserContextUser;
            setUser(userWithDisplayName);
            setIsLoggedIn(true);
            setCartItems([]);
            toast.success(SUCCESS_MESSAGES.SIGNUP_SUCCESS + " " + email);
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
                toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
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
            localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);

            toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
        } catch (error: unknown) {
            console.error("Full logout error:", error);
            const message = error instanceof Error ? error.message : "Logout failed. Please try again.";
            if (message.includes('fetch')) {

                // If it's a connection error, force clear the session anyway
                setUser(null);
                setIsLoggedIn(false);
                setCartItems([]);
                localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
                toast.warning("Connection issues, but you've been logged out locally.");
            } else {
                toast.error("Logout failed: " + message);
            }
        }
    };

    const updatePassword = async (password: string) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success(SUCCESS_MESSAGES.PASSWORD_UPDATED);
    };

    // Cart management
    const addToCart = (eventSummary: EventSummary, sideGamesData: SideGamesData) => {
        setCartItems(prevItems => [...prevItems, { eventSummary, sideGamesData }]);
    };

    const removeFromCart = (index: number) => {
        setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const isEventInCart = (event_id: string) => {
        return cartItems.some(item => item.eventSummary.selectedEvent.id === event_id);
    };

    const cartItemsCount = cartItems.length;

    // Update User Profile
    const updateUserProfile = async (user: Partial<User> & { id: string }) => {
        try {
            // Map camelCase frontend fields to snake_case database fields
            const dbDataToUpdate: any = {};

            if (user.displayName !== undefined) dbDataToUpdate.display_name = user.displayName;
            if (user.about !== undefined) dbDataToUpdate.about = user.about;
            if (user.profilePictureUrl !== undefined) dbDataToUpdate.profile_picture_url = user.profilePictureUrl;
            if (user.firstName !== undefined) dbDataToUpdate.first_name = user.firstName;
            if (user.lastName !== undefined) dbDataToUpdate.last_name = user.lastName;
            if (user.email !== undefined) dbDataToUpdate.email = user.email;
            if (user.phone !== undefined) dbDataToUpdate.phone = user.phone;
            if (user.tourLeague !== undefined) dbDataToUpdate.tour_league = user.tourLeague;
            if (user.address !== undefined) dbDataToUpdate.address = user.address;
            if (user.apartment !== undefined) dbDataToUpdate.apartment = user.apartment;
            if (user.country !== undefined) dbDataToUpdate.country = user.country;
            if (user.region !== undefined) dbDataToUpdate.region = user.region;
            if (user.postalCode !== undefined) dbDataToUpdate.postal_code = user.postalCode;
            if (user.profilePictureUrl !== undefined) dbDataToUpdate.profile_picture_url = user.profilePictureUrl;
            if (user.showEmail !== undefined) dbDataToUpdate.show_email = user.showEmail;
            if (user.showFirstName !== undefined) dbDataToUpdate.show_first_name = user.showFirstName;
            if (user.showLastName !== undefined) dbDataToUpdate.show_last_name = user.showLastName;
            if (user.showPhone !== undefined) dbDataToUpdate.show_phone = user.showPhone;

            // Update user data in the profiles table
            const { error: dbError } = await supabase
                .from('profiles')
                .update(dbDataToUpdate)
                .eq('id', user.id);

            if (dbError) {
                console.error("Database error:", dbError);
                throw dbError;
            }

            // Update local user state with camelCase fields
            setUser((prevUser) => {
                if (!prevUser) return null;
                return {
                    ...prevUser,
                    ...user, // Merge updated fields (keep camelCase for frontend)
                };
            });
            toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
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

        // Update only the fields that exist in the profiles table (snake_case)
        const { error } = await supabase
            .from('profiles')
            .update({
                make_private: preferences.makePrivate,
                enable_notifications: preferences.enableNotifications,
                allow_sms: preferences.allowSMS,
                allow_email: preferences.allowEmail,
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

    // Fetch joined tours for the user
    const refreshJoinedTours = async (userId: string) => {
        if (!userId) return;
        try {
            const userTourIds = await getUserTours(userId);
            if (userTourIds && Array.isArray(userTourIds)) {
                // allTours may not be available here, so just store the IDs
                setJoinedTours(userTourIds);
            }
        } catch (err) {
            console.error('Failed to refresh joined tours:', err);
        }
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
            loading,
            joinedTours,
            refreshJoinedTours,
        }}>
            {children}
        </UserContext.Provider>
    );
};
