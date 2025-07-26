import React, { useEffect, useState } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

interface TransactionsProps {
    theme: string;
}

const Transactions: React.FC<TransactionsProps> = ({ theme }) => {

    const { user, loading } = useUser();
    const [purchases, setPurchases] = useState<any[]>([]);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('purchases')
                    .select('id, total_cost, purchase_date, side_games_data, status, events:event_id(name, event_date)')
                    .eq('user_id', user.id);

                if (error) {
                    console.error("Error fetching purchases:", error);
                    toast.error("Error fetching purchases");
                } else {
                    setPurchases(data || []);
                }
            }
        };
        fetchPurchases();
    }, [user]);

    if (loading) {
        return (
            <Card title="Transactions" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    return (
        <Card
            title="Transactions"
            theme={theme}
        >
            <div className="p-2 text-left flex justify-center mx-auto">
                <div className="p-4 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                        <Profilenav />

                        {/* Transactions section */}
                        <form className="lg:pl-4 text-sm divide-y divide-white lg:col-span-9">
                            <div className="py-1">
                                <p className="text-xs text-yellow-300">
                                    Your entrance fees and winnings can be found here.
                                </p>
                                <table role="table" className="text-xs divide-y divide-white w-full table-fixed lg:table-auto">
                                    <thead>
                                        <tr className="">
                                            <th className="w-1/2">Event</th>
                                            <th className="w-1/4">Type</th>
                                            <th className="w-1/4">$$$</th>
                                            <th className="w-1/4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-400">
                                        {purchases.map((purchase) => (
                                            <tr key={purchase.id} className="w-full">
                                                <td className="py-1 pr-1">{purchase.events?.name || 'Unknown Event'}</td>
                                                <td>Fee</td>
                                                <td>${purchase.total_cost}</td>
                                                <td>{purchase.events?.event_date ? new Date(purchase.events.event_date).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }) : ''}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </Card >
    );
};

export default Transactions;