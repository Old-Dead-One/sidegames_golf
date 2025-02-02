import React, { useEffect, useState } from "react";
import Card from "../components/defaultcard";
import Profilenav from "../components/profilenav";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

interface TransactionsProps {
    theme: string;
}

const Transactions: React.FC<TransactionsProps> = ({ theme }) => {

    const { user } = useUser();
    const [purchases, setPurchases] = useState<any[]>([]);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('purchases')
                    .select('*')
                    .eq('id', user.id);

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

    return (

        <Card
            title="Transactions"
            theme={theme}
        // footerContent={<button className="text-blue-500">Footer Action</button>}
        >
            <div className="p-2 text-left flex justify-center mx-auto">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="divide-y divide-white lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                        <Profilenav />

                        {/* Transactions section */}
                        <div className="p-2 divide-y divide-white lg:col-span-9">
                            <div className="p-1">
                                <p className="text-xs text-yellow-300">
                                    Your entrance fees and winnings can be found here.
                                </p>

                                <table role="table" className="text-xs divide-y divide-white">
                                    <thead>
                                        <tr>
                                            <th className="pr-32">Event</th>
                                            <th className="pr-10">Type</th>
                                            <th className="pr-6">$$$</th>
                                            <th className="pr-7">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-400">
                                        {purchases.map((purchase) => (
                                            <tr key={`${purchase.id}-${purchase.eventDate}`}>
                                                <td className="py-1 pr-1">{purchase.cartItems}</td>
                                                <td className="">Fee</td>
                                                <td className="">${purchase.totalCost}</td>
                                                <td className="">{new Date(purchase.eventDate).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </Card >
    );
};

export default Transactions;