import React, { useState, useEffect } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { getUserProfile } from "../services/supabaseUserAPI";

interface AccountProps {
    theme: string;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    country: string;
    region: string;
    postalCode: string;
}

const Account: React.FC<AccountProps> = ({ theme }) => {
    const { user, updateUserProfile, handleError } = useUser() as { user: User | null; updateUserProfile: (profileData: User) => Promise<void>; handleError: (error: any, defaultMessage: string) => void };
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const profileData = await getUserProfile(user.id);
                    setFirstName(profileData.firstName || "");
                    setLastName(profileData.lastName || "");
                    setAddress(profileData.address || "");
                    setApartment(profileData.apartment || "");
                    setCountry(profileData.country || "");
                    setRegion(profileData.region || "");
                    setPostalCode(profileData.postalCode || "");
                } catch (err) {
                    handleError(err, "Failed to fetch user account.");
                }
            }
        };

        fetchUserProfile();
    }, [user, handleError]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
            try {
                await updateUserProfile({
                    firstName,
                    lastName,
                    address,
                    apartment,
                    country,
                    region,
                    postalCode,
                    id: user.id,
                    email: user.email,
                });
            } catch (err) {
                setError("Failed to update account.");
                handleError(err, "Failed to update account.");
            }
        } else {
            setError("User not found.");
            handleError(new Error("User not found"), "User not found");
        }
    };

    return (
        <Card
            title="Account"
            theme={theme}
        // footerContent={<button className="text-blue-500">Footer Action</button>}
        >
            <div className="p-2 text-left flex justify-center mx-auto">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                        <Profilenav />

                        {/* Account section */}
                        <form onSubmit={handleSave} method="POST" className="p-2 text-sm divide-y divide-white lg:col-span-9">
                            <div className="p-1">
                                {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
                                <div>
                                    <p className="text-xs text-yellow-300">
                                        Required for financial transactions and used to verify your account.
                                    </p>
                                </div>
                                <div className="mt-2 grid grid-cols-12 gap-2">
                                    <div className="col-span-12">
                                        <label htmlFor="first-name">First Name:</label>
                                        <input
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            autoComplete="given-name"
                                            required
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="last-name">Last Name:</label>
                                        <input
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            autoComplete="family-name"
                                            required
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="address">Address:</label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            autoComplete="street-address"
                                            required
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="apartment">Apartment, suite, etc.</label>
                                        <input
                                            id="apartment"
                                            name="apartment"
                                            type="text"
                                            value={apartment}
                                            onChange={(e) => setApartment(e.target.value)}
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="country">Country</label>
                                        <select
                                            id="country"
                                            name="country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        >
                                            <option value="">Select a country</option>
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                    <div className="col-span-12">
                                        <label htmlFor="region">State/Province</label>
                                        <input
                                            id="region"
                                            name="region"
                                            type="text"
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            autoComplete="address-level1"
                                            required
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="col-span-12 mb-2">
                                        <label htmlFor="postal-code">Postal Code</label>
                                        <input
                                            id="postal-code"
                                            name="postal-code"
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            autoComplete="postal-code"
                                            required
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div className="p-2 mt-2 flex justify-center">
                                    <button
                                        type="button"
                                        className="w-20 rounded-lg bg-white m-2 p-2 space-y-1 text-sm font-semibold hover:bg-neutral-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-20 rounded-lg bg-indigo-600 m-2 p-2 text-sm font-semibold text-white hover:bg-primary"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="">
                        <div>
                            <h2 className="text-center">Delete account</h2>
                            <p className="text-xs text-center text-yellow-300">
                                This action is not reversible. All information related to this account will be deleted permanently.
                            </p>
                        </div>
                        <form className="my-2 flex justify-center">
                            <button
                                type="submit"
                                className="rounded-lg bg-red-500 px-3 py-2 font-semibold text-white hover:bg-red-400"
                            >
                                Yes, delete my account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default Account;