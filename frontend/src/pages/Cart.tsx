import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/20/solid";
import Card from "../components/defaultcard"
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

interface CartProps {
    theme: string;
    onClose?: () => void;
}

const getGridColumns = (itemCount: number) => {
    if (itemCount === 0) return "grid-cols-1"; // No items
    if (itemCount === 1) return "grid-cols-1"; // 1 item
    if (itemCount <= 2) return "sm:grid-cols-2"; // 2 items on small screens and above
    if (itemCount <= 3) return "sm:grid-cols-3"; // 3 items on small screens and above
    return "lg:grid-cols-3";
};

const Cart: React.FC<CartProps> = ({ theme, onClose }) => {
    const { cartItems, setCartItems, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserCart = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const userId = session.user.id;

                const { data: userCart, error } = await supabase
                    .from('cart')
                    .select('cartItems')
                    .eq('id', userId)
                    .maybeSingle();

                if (error) {
                    if (error.code === 'PGRST116') {
                        // No cart found for this user - this is normal for new users
                        setCartItems([]);
                    } else {
                        console.error("Error fetching user cart:", error);
                    }
                } else {
                    if (userCart) {
                        setCartItems((userCart.cartItems || []).map((item: any) => ({
                            ...item,
                            sideGamesData: {
                                ...item.sideGamesData,
                                rows: Array.isArray(item.sideGamesData?.rows) ? item.sideGamesData.rows : [],
                            },
                        })));
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
                    eventSummary: item.eventSummary,
                    sideGamesData: {
                        ...item.sideGamesData,
                        rows: Array.isArray(item.sideGamesData.rows) ? item.sideGamesData.rows : [],
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
        if (!session) {
            toast.error("You must be logged in to manage your cart.");
            return;
        }

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
    };

    if (loading) {
        return (
            <Card title="Cart" theme={theme}>
                <LoadingSpinner size="large" />
            </Card>
        );
    }

    return (
        <Card
            title="Cart"
            theme={theme}
        // footerContent={<button className="text-blue-600">Footer Action</button>}
        >

            {/* Cart section */}
            <div className="p-2 w-auto mx-auto text-xs text-left">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    {cartItems.length === 0 && <p className="text-sm text-white text-center">Your cart is empty</p>}
                    <ul className={`grid grid-cols-1 gap-1 ${getGridColumns(cartItems.length)}`}>
                        {cartItems.map((item, key) => (
                            <li key={key} className="p-2 rounded-lg text-nowrap">
                                <div className="border rounded-lg p-2">
                                    <div className="text-green-400">Selected Event:</div>
                                    <ul>
                                        <li><strong>Tour:</strong> {item.eventSummary.tourLabel}</li>
                                        <li><strong>Location:</strong> {item.eventSummary.locationLabel}</li>
                                        <li><strong>Event Name:</strong> {item.eventSummary.selectedEvent.name}</li>
                                        <li><strong>Course:</strong> {item.eventSummary.selectedEvent.course_name}</li>
                                        <li><strong>Date:</strong> {new Date(item.eventSummary.selectedEvent.event_date).toLocaleDateString()}</li>
                                    </ul>

                                    <div className="text-green-400">Selected Side Games:</div>
                                    <ul>
                                        {(Array.isArray(item.sideGamesData.rows) ? item.sideGamesData.rows : []).filter(row => row.selected).map((row, i) => (
                                            <li key={i}><strong>{row.name}:</strong> ${row.cost}</li>
                                        ))}
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
                                    onClose?.();
                                    navigate('/review-cart');
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
