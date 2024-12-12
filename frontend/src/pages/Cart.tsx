import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/20/solid";
import Card from "../components/defaultcard"
import { toast } from "react-toastify";

interface CartProps {
    theme: string;
}

const getGridColumns = (itemCount: number) => {
    if (itemCount === 0) return "grid-cols-1"; // No items
    if (itemCount === 1) return "grid-cols-1"; // 1 item
    if (itemCount <= 2) return "sm:grid-cols-2"; // 2 items on small screens and above
    if (itemCount <= 3) return "sm:grid-cols-3"; // 3 items on small screens and above
    return "lg:grid-cols-3";
};

const Cart: React.FC<CartProps> = ({ theme }) => {
    const { cartItems, setCartItems } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserCart = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const userId = session.user.id;

                const { data: userCart, error } = await supabase
                    .from('cart')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.error("Error fetching user cart:", error);
                } else {
                    if (userCart) {
                        setCartItems(userCart.cartItems || []);
                    } else {
                        setCartItems([]);
                    }
                }
            }
        };

        fetchUserCart();
    }, [setCartItems]);

    useEffect(() => {
        const saveCart = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const userId = session.user.id;

                // Format the cart items for the database
                const formattedCartItems = cartItems.map(item => ({
                    eventSummary: {
                        tourLabel: item.eventSummary.tourLabel,
                        locationLabel: item.eventSummary.locationLabel,
                        selectedEvent: {
                            eventId: item.eventSummary.selectedEvent.eventId,
                            name: item.eventSummary.selectedEvent.name,
                            course: item.eventSummary.selectedEvent.course,
                            date: item.eventSummary.selectedEvent.date
                        },
                    },
                    sideGamesData: {
                        net: item.sideGamesData.net,
                        superSkins: item.sideGamesData.superSkins,
                        division: item.sideGamesData.division,
                        totalCost: item.sideGamesData.totalCost
                    },
                }));

                const { error } = await supabase
                    .from('cart')
                    .upsert({
                        id: userId,
                        cartItems: formattedCartItems
                    });

                if (error) {
                    console.error("Error saving cart:", error);
                }
            }
        };

        if (cartItems.length > 0) {
            saveCart();
        }
    }, [cartItems]);

    const deleteCartItem = async (index: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const userId = session.user.id;

            // Remove the item from local state
            const updatedCartItems = cartItems.filter((_, i) => i !== index);
            setCartItems(updatedCartItems);

            // Update the database
            const { error } = await supabase
                .from('cart')
                .upsert({
                    id: userId,
                    cartItems: updatedCartItems
                });

            if (error) {
                console.error("Error deleting cart item:", error);
                toast.error("Failed to delete cart item.");
            } else {
                toast.success("Cart item deleted successfully.");
            }
        }
    };

    return (
        <Card
            title="Cart"
            theme={theme}
        // footerContent={<button className="text-blue-600">Footer Action</button>}
        >
            <div className="p-2 w-auto mx-auto text-xs text-left">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    {cartItems.length === 0 && <p className="text-sm text-white text-center">Your cart is empty</p>}
                    <ul className={`grid grid-cols-1 gap-1 ${getGridColumns(cartItems.length)}`}>
                        {cartItems.map((item, key) => (
                            <li key={key} className="rounded-lg p-2 text-nowrap">
                                <div className="border rounded-lg p-2">
                                    <div className="text-green-400">Selected Event:</div>
                                    <ul>
                                        <li><strong>Tour:</strong> {item.eventSummary.tourLabel}</li>
                                        <li><strong>Location:</strong> {item.eventSummary.locationLabel}</li>
                                        <li><strong>Event Name:</strong> {item.eventSummary.selectedEvent.name}</li>
                                        <li><strong>Course:</strong> {item.eventSummary.selectedEvent.course}</li>
                                        <li><strong>Date:</strong> {new Date(item.eventSummary.selectedEvent.date).toLocaleDateString()}</li>
                                    </ul>

                                    <div className="text-green-400">Selected Side Games:</div>
                                    <ul>
                                        <li><strong>Net Game:</strong> {item.sideGamesData.net || "None"}</li>
                                        <li><strong>Super Skins:</strong> {item.sideGamesData.superSkins ? "Yes" : "No"}</li>
                                        <li><strong>Division Skins:</strong> {item.sideGamesData.division || "None"}</li>
                                    </ul>

                                    <div className="text-yellow-400 text-right">
                                        Total Cost: ${item.sideGamesData.totalCost}
                                    </div>

                                    <div className="flex justify-center p-2">
                                        <button
                                            className="w-max flex items-center rounded-lg bg-red-600 p-2 text-white hover:bg-red-400 hover:text-black"
                                            onClick={() => deleteCartItem(key)}
                                        >
                                            <TrashIcon className="h-5" />
                                            Delete cart item
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center p-2">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-primary hover:text-black"
                            onClick={() => {
                                if (cartItems.length === 0) {
                                    toast.warn("There are no items in the cart.");
                                } else {
                                    navigate('/ReviewCart');
                                }
                            }}
                        >
                            Review Cart
                        </button>
                    </div>
                </div>
            </div>
        </Card >
    );
};

export default Cart;
