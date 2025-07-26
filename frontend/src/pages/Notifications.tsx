import React, { useState, useEffect } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { getUserProfile } from "../services/supabaseUserAPI";

interface NotificationsProps {
    theme: string;
}

const Notifications: React.FC<NotificationsProps> = ({ theme }) => {
    const { user, updateNotificationPreferences, handleError } = useUser();
    const [makePrivate, setMakePrivate] = useState(false);
    const [enableNotifications, setEnableNotifications] = useState(false);
    const [allowSMS, setAllowSMS] = useState(false);
    const [allowEmail, setAllowEmail] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const profileData = await getUserProfile(user.id);
                    setMakePrivate(profileData.make_private || false);
                    setEnableNotifications(profileData.enable_notifications || false);
                    setAllowSMS(profileData.allow_sms || false);
                    setAllowEmail(profileData.allow_email || false);
                } catch (err) {
                    handleError(err, "Failed to fetch user profile.");
                }
            }
        };

        fetchUserProfile();
    }, [user, handleError]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
            try {
                await updateNotificationPreferences({
                    makePrivate,
                    enableNotifications,
                    allowSMS,
                    allowEmail,
                });
            } catch (err) {
                setError("Failed to update notification preferences.");
                handleError(err, "Failed to update notification preferences.");
            }
        } else {
            setError("User not found.");
            handleError(new Error("User not found"), "User not found");
        }
    };

    return (
        <Card
            title="Notification Preferences"
            theme={theme}
        // footerContent={<button className="text-blue-500">Footer Action</button>}
        >
            <div className="p-2 text-left flex justify-center mx-auto">
                <div className="p-4 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                        <Profilenav />

                        {/* Notification preferences section */}
                        <form onSubmit={handleSave} method="POST" className="lg:pl-4 text-sm divide-y divide-white lg:col-span-9">
                            <div className="py-1">
                                <div className="mb-1">
                                    <p className="text-xs text-yellow-300">
                                        You can set your notification preferences here.
                                    </p>
                                </div>
                                <ul role="list" className="divide-y divide-white text-xs">
                                    <li className="flex items-center justify-between pb-1">
                                        <div className="flex flex-col">
                                            <label>
                                                Make my account private:
                                            </label>
                                            <p className="text-white">
                                                No one will be able to connect with you through sidegames.golf.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={makePrivate}
                                            onChange={(e) => setMakePrivate(e.target.checked)}
                                        />
                                    </li>
                                    <li className="flex items-center justify-between py-1">
                                        <div className="flex flex-col">
                                            <label>
                                                Enable notifications:
                                            </label>
                                            <p className="text-white">
                                                Receive updates and alerts.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={enableNotifications}
                                            onChange={(e) => setEnableNotifications(e.target.checked)}
                                        />
                                    </li>
                                    <li className="flex items-center justify-between py-1">
                                        <div className="flex flex-col">
                                            <label>
                                                Allow SMS notifications:
                                            </label>
                                            <p className="text-white">
                                                Receive notifications via SMS.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={allowSMS}
                                            onChange={(e) => setAllowSMS(e.target.checked)}
                                        />
                                    </li>
                                    <li className="flex items-center justify-between py-1">
                                        <div className="flex flex-col">
                                            <label>
                                                Allow email notifications:
                                            </label>
                                            <p className="text-white">
                                                Receive notifications via email.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={allowEmail}
                                            onChange={(e) => setAllowEmail(e.target.checked)}
                                        />
                                    </li>
                                </ul>
                                <div>
                                    <div>
                                        <p className="text-xs text-yellow-300">
                                            You will still receive emails from sidegames.golf related to your account.
                                        </p>
                                    </div>
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="mt-2 flex justify-center gap-2 w-full">
                                    <button
                                        type="button"
                                        className="w-full rounded-lg bg-white p-2 space-y-1 text-sm font-semibold hover:bg-neutral-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-indigo-600 p-2 text-sm font-semibold text-white hover:bg-primary"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Notifications;