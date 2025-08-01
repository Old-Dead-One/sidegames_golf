import React, { useState } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-toastify';
import { isValidPassword } from '../utils/validation';

interface PasswordProps {
    theme: string;
}

const Password: React.FC<PasswordProps> = ({ theme }) => {
    const { updatePassword, handleError } = useUser();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [forgotting, setForgotting] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentPassword && newPassword && confirmPassword) {
            if (!isValidPassword(newPassword) || newPassword.length > 32) {
                setError("Password must be 8-32 characters, include a number and a special character.");
                handleError(new Error("Password must be 8-32 characters, include a number and a special character."), "Password requirements not met.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("New password and confirmation do not match.");
                handleError(new Error("New password and confirmation do not match."), "Password mismatch.");
                return;
            }
            try {
                await updatePassword(newPassword);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                toast.success("Password updated successfully!");
            } catch (err) {
                setError("Failed to update password.");
                handleError(err, "Failed to update password.");
            }
        } else {
            setError("All fields are required.");
            handleError(new Error("All fields are required."), "All fields are required.");
        }
    };

    const handleReset = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
    };

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error("Please enter your email.");
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail);
        if (error) {
            toast.error(error.message || "Failed to send reset email.");
        } else {
            toast.success("Password reset email sent!");
            setForgotting(false);
            setForgotEmail("");
        }
    };

    return (
        <Card
            title="Password"
            theme={theme}
            includeInnerCard={true}
        >
            {forgotting ? (
                <form onSubmit={handleForgotPassword} className="w-full max-w-md mx-auto p-8 flex flex-col items-center bg-neutral-700 rounded-lg mt-4">
                    <label htmlFor="forgot-email" className="mb-2 text-white text-center">Enter your email to reset password:</label>
                    <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="mb-2 w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                        required
                    />
                    <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => setForgotting(false)} className="rounded-lg bg-white px-3 py-1 text-sm font-semibold hover:bg-neutral-200">Cancel</button>
                        <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-semibold text-white hover:bg-primary">Send Reset Email</button>
                    </div>
                </form>
            ) : (
                <div className="p-2 text-left flex justify-center mx-auto">
                    {/* <div className="p-4 bg-neutral-500 bg-opacity-95 rounded-lg"> */}
                    <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                        <Profilenav />

                        {/* Password section */}
                        <div className="lg:pl-4 text-sm divide-y divide-white lg:col-span-9 w-full">
                            <form onSubmit={handleSave} method="POST">
                                <div className="py-1">
                                    {error && <p className="text-red-500">{error}</p>}
                                    <div className="mb-1">
                                        <p className="text-xs text-yellow-300">
                                            Password must be 8-32 characters with at least one number and one special character.
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="text-xs text-blue-200 underline mb-1"
                                            onClick={() => setForgotting(true)}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="text-xs flex flex-col gap-2">
                                        <div className="flex rounded-lg relative">
                                            <label htmlFor="current-password" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 w-[120px]">
                                                Current Password:
                                            </label>
                                            <input
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                id="current-password"
                                                name="current-password"
                                                type={showCurrent ? "text" : "password"}
                                                autoComplete="current-password"
                                                required
                                                placeholder="Current Password"
                                                className="grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600 text-xs"
                                            />
                                            <button
                                                type="button"
                                                className="text-sm absolute right-2 top-1/2 -translate-y-1/2"
                                                tabIndex={-1}
                                                onClick={() => setShowCurrent((v) => !v)}
                                                aria-label={showCurrent ? "Hide password" : "Show password"}
                                            >
                                                {showCurrent ? '🙈' : '👁️'}
                                            </button>
                                        </div>

                                        <div className="mt-2 flex rounded-lg relative">
                                            <label htmlFor="new-password" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 w-[120px]">
                                                New Password:
                                            </label>
                                            <input
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                id="new-password"
                                                name="new-password"
                                                type={showNew ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                placeholder="New Password"
                                                className="grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600 text-xs"
                                            />
                                            <button
                                                type="button"
                                                className="text-sm absolute right-2 top-1/2 -translate-y-1/2"
                                                tabIndex={-1}
                                                onClick={() => setShowNew((v) => !v)}
                                                aria-label={showNew ? "Hide password" : "Show password"}
                                            >
                                                {showNew ? '🙈' : '👁️'}
                                            </button>
                                        </div>

                                        <div className="mt-2 flex rounded-lg relative">
                                            <label htmlFor="confirm-password" className="inline-flex items-center rounded-l-lg border text-nowrap border-white px-2 w-[120px]">
                                                Confirm Password:
                                            </label>
                                            <input
                                                id="confirm-password"
                                                name="confirm-password"
                                                type={showConfirm ? "text" : "password"}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="grow rounded-r-lg border-0 py-1 focus:ring-1 focus:ring-indigo-600 text-xs"
                                            />
                                            <button
                                                type="button"
                                                className="text-sm absolute right-2 top-1/2 -translate-y-1/2"
                                                tabIndex={-1}
                                                onClick={() => setShowConfirm((v) => !v)}
                                                aria-label={showConfirm ? "Hide password" : "Show password"}
                                            >
                                                {showConfirm ? '🙈' : '👁️'}
                                            </button>
                                        </div>
                                    </div>
                                    {error && <p className="text-red-500">{error}</p>}
                                    <div className="mt-2 gap-2">
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
                            </form>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default Password;