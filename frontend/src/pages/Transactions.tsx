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
                        <div className="pl-2 text-sm divide-y divide-white lg:col-span-9">

                            {/* Transactions section */}
                            <div className="py-2">
                                <div>
                                    <p className="text-left text-xs text-yellow-300">
                                        Your entrance fees and winnings can be found here.
                                    </p>
                                </div>
                            </div>
                            <table className="w-full table-auto text-center text-sm divide-y divide-white lg:col-span-9">
                                <thead>
                                    <th className="text-left">Event</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Event Date</th>
                                </thead>
                                <tbody className="text-center text-sm divide-y divide-neutral-400 lg:col-span-9">
                                    {purchases.map((purchase) => (
                                        <tr key={purchase.id}>
                                            <td className="text-left">{purchase.cartItems}</td>
                                            <td>Entrance Fee</td>
                                            <td>$ {purchase.totalCost}</td>
                                            <td>{purchase.eventDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </Card >
    );
};

export default Transactions;