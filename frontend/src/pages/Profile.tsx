import React, { useState, useEffect } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { getUserProfile } from "../services/supabaseUserAPI";
import tours from "../data/tours.json"; // Import your tours data
import TourAutoComplete from "../components/TourAutoComplete"; // Import the TourAutoComplete component
import { Tour } from '../components/Types'; // Adjust the path as necessary

interface ProfileProps {
    theme: string;
}

const Profile: React.FC<ProfileProps> = ({ theme }) => {
    const { user, updateUserProfile, handleError } = useUser();
    const [displayName, setDisplayName] = useState("");
    const [about, setAbout] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [tourLeague, setTourLeague] = useState("");
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null); // State for selected tour
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const profileData = await getUserProfile(user.id);
                    setDisplayName(profileData.displayName || "");
                    setEmail(profileData.email || "");
                    setAbout(profileData.about || "");
                    setImageUrl(profileData.imageUrl || "");
                    setFirstName(profileData.firstName || "");
                    setLastName(profileData.lastName || "");
                    setPhone(profileData.phone || "");
                    setTourLeague(profileData.tourLeague || "");

                    // Set selected tour based on tourLeague
                    const userTour = tours.find(tour => tour.label === profileData.tourLeague);
                    setSelectedTour(userTour || null);
                } catch (err) {
                    handleError(err, "Failed to fetch user profile.");
                }
            }
        };

        fetchUserProfile();
    }, [user, handleError]);

    const handleTourChange = (tour: Tour | null) => {
        setSelectedTour(tour);
        setTourLeague(tour?.label || "");
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
            try {
                await updateUserProfile({
                    displayName,
                    about,
                    imageUrl,
                    firstName,
                    lastName,
                    email,
                    phone,
                    tourLeague,
                    id: user.id,
                });
            } catch (err) {
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
        // footerContent={<button className="text-blue-500">Footer Action</button>}
        >
            <div className="p-2 text-left flex justify-center mx-auto">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                        <Profilenav />
                        <form onSubmit={handleSave} method="POST" className="text-sm pl-1 divide-y divide-white lg:col-span-9">
                            {/* Profile section */}
                            <div className="p-1">
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="mb-1">
                                    <p className="text-xs text-yellow-300">
                                        This information will be displayed publicly so be careful what you share.
                                    </p>
                                </div>
                                <div className="flex flex-col lg:flex-row">
                                    <div>
                                        <div>
                                            <div className="flex rounded-lg">
                                                <label className="text-sm inline-flex items-center rounded-l-lg border text-nowrap border-white px-2">
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
                                                    placeholder="Name"
                                                    className="block w-full grow rounded-r-lg border-0 py-1 placeholder:text-neutral-500 placeholder:text-sm focus:ring-2 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="about">
                                                About you:
                                            </label>
                                            <div className="">
                                                <textarea
                                                    id="about"
                                                    name="about"
                                                    rows={2}
                                                    maxLength={100}
                                                    className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                                    value={about}
                                                    onChange={(e) => setAbout(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-right">{about.length} / 100 characters</p>
                                        </div>
                                    </div>
                                    {/* other profile info */}
                                    <div className="grow lg:ml-2 lg:mt-0 lg:shrink-0 lg:grow-0">
                                        <div className="lg:hidden">
                                            <div className="flex items-center">
                                                <div
                                                    aria-hidden="true"
                                                    className="inline-block size-20 shrink-0 rounded-full"
                                                >
                                                    <img alt="" src={imageUrl} className="size-full rounded-full" />
                                                </div>
                                                <div className="ml-4">
                                                    <input
                                                        id="mobile-user-photo"
                                                        name="user-photo"
                                                        type="file"
                                                        className="absolute rounded-lg opacity-0 w-32 h-8"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                const file = e.target.files[0];
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setImageUrl(reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
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
                                            <img alt="" src={imageUrl} className="relative size-28 rounded-full" />
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
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-12">
                                        <label htmlFor="first-name">
                                            First name: (optional)
                                        </label>
                                        <input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            autoComplete="given-name"
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="last-name">
                                            Last Name: (optional)
                                        </label>
                                        <input
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            autoComplete="family-name"
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="url">
                                            Email: (optional)
                                        </label>
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            id="email"
                                            name="email"
                                            type="text"
                                            autoComplete="email"
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="url">
                                            Phone: (optional)
                                        </label>
                                        <input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            id="tel"
                                            name="url"
                                            type="tel"
                                            autoComplete="tel-national"
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="tour" className="">
                                            Tour/League:
                                        </label>
                                        <div className="bg-white rounded-lg w-full">
                                            <TourAutoComplete
                                                tours={tours}
                                                value={selectedTour || { tour_id: 0, label: "", year: 0 }}
                                                onSelect={(_, tour: Tour | null) => {
                                                    handleTourChange(tour);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
                            <div className="p-2 mt-2 flex justify-center">
                                {/* <button
                                    type="button"
                                    className="w-20 rounded-lg bg-white m-2 p-2 space-y-1 text-sm font-semibold hover:bg-neutral-200"
                                >
                                    Cancel
                                </button> */}
                                <button
                                    type="submit"
                                    className="w-20 rounded-lg bg-indigo-600 m-2 p-2 text-sm font-semibold text-white hover:bg-primary"
                                >
                                    Save
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