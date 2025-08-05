import React, { useState, useEffect, useRef } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { getUserProfile } from "../services/supabaseUserAPI";
import { Tour } from '../types';
import { supabase } from "../services/supabaseClient";
import { toast } from 'react-toastify';
import { getUserTours, addUserTour, removeUserTour, uploadProfilePicture } from '../services/supabaseUserAPI';
import TextField from "@mui/material/TextField";
import TourAutoComplete from "../components/TourAutoComplete";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

interface ProfileProps {
    theme: string;
}

const Profile: React.FC<ProfileProps> = ({ theme }) => {
    // All hooks at the top!
    const { user, updateUserProfile, handleError, loading } = useUser();
    const navigate = useNavigate();

    // All useState, useRef, useEffect, etc. go here
    const [displayName, setDisplayName] = useState("");
    const [about, setAbout] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [joinedTours, setJoinedTours] = useState<Tour[]>([]);
    const [allTours, setAllTours] = useState<Tour[]>([]);
    const [error, setError] = useState("");
    const profileFetchedRef = useRef(false);
    const prevJoinedToursRef = useRef<Tour[]>([]);
    const [showEmail, setShowEmail] = useState(false);
    const [showFirstName, setShowFirstName] = useState(false);
    const [showLastName, setShowLastName] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            toast.info("Please log in or create an account.");
            navigate("/Login");
        }
    }, [user, loading, navigate]);

    // Fetch all tours and user's joined tours
    useEffect(() => {
        const fetchToursAndUserTours = async () => {
            if (!user?.id) return;
            try {
                const { data: toursData, error: toursError } = await supabase
                    .from('tours')
                    .select('*');
                if (toursError) throw toursError;
                setAllTours(toursData || []);
                const userTourIds = await getUserTours(user.id);
                const userTours = (toursData || []).filter((tour: Tour) => userTourIds.includes(tour.id));
                setJoinedTours(userTours);
                prevJoinedToursRef.current = userTours; // Store initial joined tours for comparison
            } catch (err) {
                setError('Failed to load tours.');
            }
        };
        fetchToursAndUserTours();
    }, [user?.id]);

    // Fetch and sync user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user?.id && !profileFetchedRef.current) {
                profileFetchedRef.current = true;
                try {
                    const profileData = await getUserProfile(user.id);

                    // Update all form fields with database data
                    setDisplayName(profileData.display_name || "");
                    setEmail(profileData.email || "");
                    setAbout(profileData.about || "");

                    setFirstName(profileData.first_name || "");
                    setLastName(profileData.last_name || "");
                    setPhone(profileData.phone || "");
                    setShowEmail(!!profileData.show_email);
                    setShowFirstName(!!profileData.show_first_name);
                    setShowLastName(!!profileData.show_last_name);
                    setShowPhone(!!profileData.show_phone);
                    setProfilePictureUrl(profileData.profile_picture_url || "");
                    // setTourLeagues(profileData.tour_leagues || []); // Assuming tour_leagues is an array of strings

                    // Set selected tours based on tourLeagues from database
                    // if (profileData.tour_leagues && tours.length > 0) {
                    //     const selectedTourNames = profileData.tour_leagues;
                    //     const userTours = tours.filter(tour => selectedTourNames.includes(tour.name));
                    //     setSelectedTours(userTours);
                    // }
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                    setError("Failed to fetch user profile.");
                }
            }
        };

        fetchUserProfile();

        // Reset the ref when user changes
        return () => {
            profileFetchedRef.current = false;
        };
    }, [user?.id, allTours.length]); // Only depend on user ID and tours length, not the entire tours array

    if (loading) {
        return (
            <Card title="Profile" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && user?.id) {
            const file = e.target.files[0];
            setUploading(true);
            try {
                const url = await uploadProfilePicture(user.id, file);
                setProfilePictureUrl(url);
                await updateUserProfile({ id: user.id, profilePictureUrl: url });
                toast.success("Profile picture uploaded and saved!");
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to upload profile picture.";
                toast.error(errorMessage);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user?.id) {
            try {
                // Update profile in database (all editable fields)
                await updateUserProfile({
                    id: user.id,
                    displayName,
                    about,
                    showEmail,
                    showFirstName,
                    showLastName,
                    showPhone,
                    profilePictureUrl,
                });

                // Update user_tours join table
                const prevTours = prevJoinedToursRef.current;
                const newTours = joinedTours;
                // Add new tours
                for (const tour of newTours) {
                    if (!prevTours.some(jt => jt.id === tour.id)) {
                        await addUserTour(user.id, tour.id);
                    }
                }
                // Remove unselected tours
                for (const tour of prevTours) {
                    if (!newTours.some(nt => nt.id === tour.id)) {
                        await removeUserTour(user.id, tour.id);
                    }
                }
                // Update the ref to the latest joined tours
                prevJoinedToursRef.current = [...newTours];

                // Update local user context
                await updateUserProfile({
                    id: user.id,
                    displayName,
                    about,
                    showEmail,
                    showFirstName,
                    showLastName,
                    showPhone,
                    profilePictureUrl,
                });

                toast.success("Profile updated successfully!");
                setError("");
            } catch (err) {
                console.error("Error updating profile:", err);
                setError("Failed to update profile.");
                handleError(err, "Failed to update profile.");
            }
        } else {
            setError("User not found.");
            handleError(new Error("User not found"), "User not found");
        }
    };

    return (
        <Card
            title="Profile"
            theme={theme}
            includeInnerCard={true}
            paddingClassName="p-0"
        >
            <div className="p-2 text-left flex justify-center mx-auto w-full">
                <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0 w-full">
                    <Profilenav />

                    {/* Profile section */}
                    <div className="px-2 ml-2 text-sm divide-y divide-white lg:col-span-9 w-full">
                        <form onSubmit={handleSave} method="POST">
                            <div>
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="mb-1">
                                    <p className="text-xs text-yellow-300">
                                        Information will be displayed publicly. Be careful what you share!
                                    </p>
                                </div>
                                <div className="text-xs flex flex-col">
                                    <div className="flex rounded-lg">
                                        <label htmlFor="username" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2">
                                            Display Name:
                                        </label>
                                        <input
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            id="username"
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            required
                                            placeholder="Display Name"
                                            className="w-full grow rounded-r-lg border-0 py-1 placeholder:text-neutral-500 placeholder:text-sm focus:ring-2 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor="about">
                                            About you:
                                        </label>
                                        <div className="">
                                            <textarea
                                                id="about"
                                                name="about"
                                                rows={4}
                                                maxLength={100}
                                                className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                                value={about}
                                                onChange={(e) => setAbout(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-right">{about.length} / 100 characters</p>
                                    </div>
                                    {/* other profile info */}
                                    <div className="pb-4 grow lg:ml-2 lg:mt-0 lg:shrink-0 lg:grow-0">
                                        <div className="lg:hidden">
                                            <div className="flex items-center">
                                                <div
                                                    aria-hidden="true"
                                                    className="inline-block size-20 shrink-0 rounded-full"
                                                >
                                                    <img alt="" src={profilePictureUrl || "/default-avatar.png"} className="size-full rounded-full" />
                                                </div>
                                                <div className="ml-4">
                                                    <input
                                                        id="mobile-user-photo"
                                                        name="user-photo"
                                                        type="file"
                                                        className="absolute rounded-lg opacity-0 w-32 h-8"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />
                                                    <label
                                                        htmlFor="mobile-user-photo"
                                                        className="pointer-events-none block rounded-lg px-3 py-1 ring-1 ring-white peer-hover:ring-neutral-500 peer-focus:ring-2 peer-focus:ring-indigo-600"
                                                    >
                                                        <h1>Change</h1>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="m-2 relative hidden overflow-hidden rounded-full lg:block">
                                            <img alt="" src={profilePictureUrl || "/default-avatar.png"} className="relative size-28 rounded-full" />
                                            <label
                                                htmlFor="desktop-user-photo"
                                                className="absolute inset-0 flex size-full items-center justify-center bg-black/60 text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                                            >
                                                <span>Change</span>
                                                <input
                                                    id="desktop-user-photo"
                                                    name="user-photo"
                                                    type="file"
                                                    className="absolute size-full cursor-pointer rounded-lg border-white opacity-0"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        {uploading && <LoadingSpinner size="medium" className="absolute top-0 left-0 right-0 bottom-0 m-auto z-10" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-12 flex items-center gap-2">
                                        <input
                                            id="show-first-name"
                                            name="show-first-name"
                                            type="checkbox"
                                            checked={showFirstName}
                                            onChange={(e) => setShowFirstName(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="show-first-name" className="mb-0">Show first name on public profile</label>
                                        {showFirstName && firstName && (
                                            <span className="ml-4 text-xs text-neutral-700">{firstName}</span>
                                        )}
                                    </div>
                                    <div className="col-span-12 flex items-center gap-2">
                                        <input
                                            id="show-last-name"
                                            name="show-last-name"
                                            type="checkbox"
                                            checked={showLastName}
                                            onChange={(e) => setShowLastName(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="show-last-name" className="mb-0">Show last name on public profile</label>
                                        {showLastName && lastName && (
                                            <span className="ml-4 text-xs text-neutral-700">{lastName}</span>
                                        )}
                                    </div>
                                    <div className="col-span-12 flex items-center gap-2">
                                        <input
                                            id="show-email"
                                            name="show-email"
                                            type="checkbox"
                                            checked={showEmail}
                                            onChange={(e) => setShowEmail(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="show-email" className="mb-0">Show email on public profile</label>
                                        {showEmail && email && (
                                            <span className="ml-4 text-xs text-neutral-700">{email}</span>
                                        )}
                                    </div>
                                    <div className="col-span-12 flex items-center gap-2">
                                        <input
                                            id="show-phone"
                                            name="show-phone"
                                            type="checkbox"
                                            checked={showPhone}
                                            onChange={(e) => setShowPhone(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="show-phone" className="mb-0">Show phone on public profile</label>
                                        {showPhone && phone && (
                                            <span className="ml-4 text-xs text-neutral-700">{phone}</span>
                                        )}
                                    </div>
                                    {/* Tour/League(s) section */}
                                    <div className="col-span-12 mb-2">
                                        <label htmlFor="tour" className="">
                                            Tour/League(s):
                                        </label>
                                        <TourAutoComplete
                                            tours={allTours}
                                            value={joinedTours}
                                            onSelect={(newValue) => {
                                                setJoinedTours(newValue as Tour[]);
                                            }}
                                            multiple
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select Tours/Leagues"
                                                    sx={{ backgroundColor: 'white' }}
                                                    className="w-full rounded-lg text-sm focus:ring-1 focus:ring-indigo-600"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-indigo-600 p-1.5 text-sm font-semibold text-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Profile;