import React, { useState } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";

interface PasswordProps {
    theme: string;
}

const Password: React.FC<PasswordProps> = ({ theme }) => {
    const { updatePassword, handleError } = useUser();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentPassword && newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                setError("New password and confirmation do not match.");
                handleError(new Error("New password and confirmation do not match."), "Password mismatch.");
                return;
            }
            try {
                await updatePassword(newPassword);
                setNewPassword("");
                setConfirmPassword("");
                setError("");
            } catch (err) {
                setError("Failed to update password.");
                handleError(err, "Failed to update password.");
            }
        } else {
            setError("All fields are required.");
            handleError(new Error("All fields are required."), "All fields are required.");
        }
    };

    return (
        <Card
            title="Password"
            theme={theme}
            // footerContent={<button className="text-blue-500">Footer Action</button>}
        >
            <div className="min-w-[320px] p-2 text-left flex justify-center mx-auto">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                        <Profilenav />

                        <form onSubmit={handleSave} className="text-sm pl-1 divide-y divide-white lg:col-span-9">
                            {/* Password section */}
                            <div className="p-1">
                                <div className="mb-2">
                                    <p className="text-xs text-yellow-300">
                                        Use 8 to 32 characters with at least one number and one special character.
                                    </p>
                                </div>
                                <div className="mt-2 grid grid-cols-12 gap-2">
                                    <div className="col-span-12">
                                        <label htmlFor="current-password">
                                            Current Password:
                                        </label>
                                        <input
                                            id="current-password"
                                            name="current-password"
                                            type="password"
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <label htmlFor="new-password">
                                            New Password:
                                        </label>
                                        <input
                                            id="new-password"
                                            name="new-password"
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <label htmlFor="confirm-password">
                                            Confirm Password:
                                        </label>
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
                            </div>
                            <div className="p-2 flex justify-center">
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
                        </form>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Password;