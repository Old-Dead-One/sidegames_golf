import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import Card from "../components/defaultcard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ReviewCartProps {
    theme: string;
}

const getGridColumns = (itemCount: number) => {
    if (itemCount === 0) return "grid-cols-1"; // No items
    if (itemCount === 1) return "grid-cols-1"; // 1 item
    if (itemCount <= 2) return "sm:grid-cols-2"; // 2 items on small screens and above
    if (itemCount <= 3) return "sm:grid-cols-3"; // 3 items on small screens and above
    return "lg:grid-cols-3";
};

const ReviewCart: React.FC<ReviewCartProps> = ({ theme }) => {
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

    const handleCheckout = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const userId = session.user.id;

            // Prepare the purchases data
            const purchasesData = cartItems.map(item => ({
                id: userId,
                cartItems: item.eventSummary.selectedEvent.name,
                totalCost: item.sideGamesData.totalCost,
                eventDate: item.eventSummary.selectedEvent.date,
                purchaseDate: new Date().toISOString()
            }));

            try {
                // Check if the purchases already exist
                const { data: existingPurchases, error: fetchError } = await supabase
                    .from('purchases')
                    .select('cartItems')
                    .eq('id', userId);

                if (fetchError) {
                    console.error("Error fetching existing purchases:", fetchError);
                    toast.error("An error occurred while checking existing purchases.");
                    return;
                }

                // Check for duplicates
                const existingCartItems = existingPurchases.map(purchase => purchase.cartItems);
                const duplicates = purchasesData.filter(purchase => existingCartItems.includes(purchase.cartItems));

                if (duplicates.length > 0) {
                    toast.error("You have already purchased the following events: " + duplicates.map(d => d.cartItems).join(", "));
                    return; // Exit the function to prevent further execution
                }

                // Insert the purchases into the purchases table
                const { error: purchaseError } = await supabase
                    .from('purchases')
                    .insert(purchasesData);

                if (purchaseError) {
                    console.error("Purchase Error:", purchaseError);
                    // Handle specific error codes
                    switch (purchaseError.code) {
                        case '23505': // Unique violation error code
                            toast.error("You have already purchased this event.");
                            return; // Exit the function to prevent further execution
                        default:
                            toast.error("An error occurred while adding your purchases. Please try again.");
                            break;
                    }
                    return; // Exit after handling the error
                }

                // Clear the cart in the database
                const { error } = await supabase
                    .from('cart')
                    .update({ cartItems: [] })
                    .eq('id', userId);

                if (error) {
                    throw new Error("Error clearing cart in database: " + error.message);
                }

                // Clear the local state
                setCartItems([]);
                toast.success("Checkout successful! Your purchases have been recorded.");
                navigate('/Dashboard');
            } catch (error: unknown) {
                console.error("Unexpected Error:", error);
                if (error instanceof Error) {
                    toast.error(error.message || "An unexpected error occurred.");
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        }
    };

    return (
        <Card
            title="Review Your Cart"
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
                                        <button className="w-max rounded-lg bg-yellow-400 p-2 hover:bg-primary hover:text-black" onClick={() => navigate('/Cart')}>
                                            Return to Cart
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center p-2">
                        <button className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-primary hover:text-black" onClick={() => handleCheckout()}>Confirm Checkout</button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ReviewCart; 