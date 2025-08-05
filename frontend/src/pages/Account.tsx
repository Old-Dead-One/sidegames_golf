import React, { useState, useEffect } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { getUserProfile } from "../services/supabaseUserAPI";
import { toast } from 'react-toastify';
import { supabase } from '../services/supabaseClient';
import { isValidEmail } from '../utils/validation';
import LoadingSpinner from "../components/LoadingSpinner";

interface AccountProps {
    theme: string;
}

const Account: React.FC<AccountProps> = ({ theme }) => {
    const { user, updateUserProfile, handleError, loading } = useUser();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [editingEmail, setEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showEmailAlert, setShowEmailAlert] = useState(false);

    // Format phone as (123) 456-7890, drop leading 1 if 11 digits
    function formatPhone(value: string) {
        let digits = value.replace(/\D/g, "");
        if (digits.length === 11 && digits[0] === "1") {
            digits = digits.slice(1);
        }
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const profileData = await getUserProfile(user.id);
                    setFirstName(profileData.first_name || "");
                    setLastName(profileData.last_name || "");
                    setAddress(profileData.address || "");
                    setApartment(profileData.apartment || "");
                    setCountry(profileData.country || "");
                    setRegion(profileData.region || "");
                    setPostalCode(profileData.postal_code || "");
                    setEmail(profileData.email || user.email || "");
                    setNewEmail(profileData.email || user.email || "");
                    setPhone(profileData.phone || "");
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
                    id: user.id,
                    firstName,
                    lastName,
                    address,
                    apartment,
                    country,
                    region,
                    postalCode,
                    email,
                    phone,
                });
                toast.success("Account updated successfully!");
                setError("");
            } catch (err) {
                setError("Failed to update account.");
                handleError(err, "Failed to update account.");
            }
        } else {
            setError("User not found.");
            handleError(new Error("User not found"), "User not found");
        }
    };

    const handleReset = () => {
        if (user) {
            // Reset form to original values
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setAddress(user.address || "");
            setApartment(user.apartment || "");
            setCountry(user.country || "");
            setRegion(user.region || "");
            setPostalCode(user.postalCode || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setError("");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                // Account deletion functionality
                toast.error("Account deletion not yet implemented");
            } catch (err) {
                handleError(err, "Failed to delete account");
            }
        }
    };

    const handleEmailSave = async () => {
        setEmailError("");
        if (!isValidEmail(newEmail)) {
            setEmailError("Invalid email address.");
            return;
        }
        if (newEmail === email) {
            setEditingEmail(false);
            return;
        }
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (error) {
            setEmailError(error.message || "Failed to update email.");
            return;
        }
        if (!user) {
            setEmailError("User not found.");
            return;
        }
        try {
            await updateUserProfile({ id: user.id, email: newEmail });
            setEmail(newEmail);
            setEditingEmail(false);
            setShowEmailAlert(true);
            toast.success("Email updated! Please check your email for verification.");
        } catch (err) {
            setEmailError("Failed to update profile email.");
        }
    };
    const handleEmailCancel = () => {
        setNewEmail(email);
        setEditingEmail(false);
        setEmailError("");
    };

    if (loading) {
        return (
            <Card title="Account" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    return (
        <Card
            title="Account"
            theme={theme}
            includeInnerCard={true}
            paddingClassName="p-0"
        >
            <div className="p-2 text-left flex justify-center mx-auto w-full">
                <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0 w-full">
                    <Profilenav />

                    {/* Account section */}
                    <div className="text-sm divide-y divide-white lg:col-span-9 w-full lg:pl-4">
                        <form onSubmit={handleSave} method="POST">
                            <div className="py-1">
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="mb-1">
                                    <p className="text-xs text-yellow-300">
                                        Required for financial transactions and used to verify your account.
                                    </p>
                                </div>
                                <div className="text-xs flex flex-col">
                                    <div className="flex rounded-lg">
                                        <label htmlFor="first-name" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            First Name:
                                        </label>
                                        <input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            autoComplete="given-name"
                                            required
                                            placeholder="First Name"
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="last-name" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            Last Name:
                                        </label>
                                        <input
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            autoComplete="family-name"
                                            required
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600 "
                                        />
                                    </div>
                                    {/* Email field */}
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="email" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            Email:
                                            {editingEmail && (
                                                <button
                                                    type="button"
                                                    className="text-xs hover:text-red-400 ml-3"
                                                    onClick={handleEmailCancel}
                                                    aria-label="Cancel email edit"
                                                >
                                                    ❌
                                                </button>
                                            )}
                                        </label>
                                        {editingEmail ? (
                                            <div className="flex gap-2 items-center w-full grow">
                                                <div className="relative w-full grow">
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={newEmail}
                                                        onChange={e => setNewEmail(e.target.value)}
                                                        autoComplete="email"
                                                        required
                                                        className="w-full rounded-r-lg border-0 py-1 pr-8 focus:ring-1 focus:ring-indigo-600"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                                                        onClick={handleEmailSave}
                                                        disabled={newEmail === email || !isValidEmail(newEmail)}
                                                        aria-label="Save email"
                                                    >
                                                        ✅
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full grow">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={email}
                                                    readOnly
                                                    className="w-full rounded-r-lg border-0 py-1 pr-8 bg-neutral-200 text-neutral-700 cursor-not-allowed"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs hover:text-indigo-400"
                                                    onClick={() => setEditingEmail(true)}
                                                    aria-label="Edit email"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                                    </div>
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="phone" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            Phone:
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                                            autoComplete="tel"
                                            placeholder="Phone"
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="address" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            Address:
                                        </label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            autoComplete="street-address"
                                            required
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="apartment" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            Apt, Suite:
                                        </label>
                                        <input
                                            id="apartment"
                                            name="apartment"
                                            type="text"
                                            value={apartment}
                                            onChange={(e) => setApartment(e.target.value)}
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="country" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            Country:
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600"
                                        >
                                            <option value="">Select a country</option>
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="region" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            State:
                                        </label>
                                        <input
                                            id="region"
                                            name="region"
                                            type="text"
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            autoComplete="address-level1"
                                            required
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="mt-2 flex rounded-lg">
                                        <label htmlFor="postal-code" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 min-w-[80px] w-[80px] flex-shrink-0">
                                            Zip Code:
                                        </label>
                                        <input
                                            id="postal-code"
                                            name="postal-code"
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            autoComplete="postal-code"
                                            required
                                            className="w-full grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                    {/* </div> */}
                                    <div className="mt-2 flex justify-center gap-2 w-full">
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="w-full rounded-lg bg-white p-1.5 text-sm font-semibold hover:bg-neutral-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full rounded-lg bg-indigo-600 p-1.5 text-sm font-semibold text-white hover:bg-primary"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-center">Delete My Account</h2>
                                    <p className="text-xs text-center text-yellow-300">
                                        All information related to this account will be deleted permanently.
                                        <br />
                                        This action is not reversible.
                                    </p>
                                </div>
                                <div className="mt-2 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="w-full rounded-lg bg-red-500 py-1.5 text-sm font-semibold text-white hover:bg-red-400"
                                    >
                                        Yes, Delete My Account
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Email Verification Alert Dialog */}
            {showEmailAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-neutral-800 border border-white rounded-lg p-6 max-w-md mx-4">
                        <div className="text-center">
                            <div className="text-2xl mb-4">📧</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Email Verification Required</h3>
                            <p className="text-sm text-neutral-300 mb-4">
                                We've sent a verification email to your new address. Please check your inbox and click the verification link to complete the email change.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowEmailAlert(false)}
                                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}

export default Account;