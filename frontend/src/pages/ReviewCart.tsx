import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/supabaseClient";
import Card from "../components/defaultcard";
import PaymentOptions from "../components/PaymentOptions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ReviewCartProps {
    theme: string;
    onOpenCart?: () => void;
}

const getGridColumns = (itemCount: number) => {
    if (itemCount === 0) return "grid-cols-1"; // No items
    if (itemCount === 1) return "grid-cols-1"; // 1 item
    if (itemCount <= 2) return "sm:grid-cols-2"; // 2 items on small screens and above
    if (itemCount <= 3) return "sm:grid-cols-3"; // 3 items on small screens and above
    return "lg:grid-cols-3";
};

const ReviewCart: React.FC<ReviewCartProps> = ({ theme, onOpenCart }) => {
    const { cartItems, setCartItems } = useUser();
    const navigate = useNavigate();
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

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

    // Calculate subtotal amount
    const subtotalAmount = cartItems.reduce((total, item) => {
        return total + (item.sideGamesData.totalCost || 0);
    }, 0);

    // Calculate fee (3% + $0.60)
    const feeAmount = (subtotalAmount * 0.03) + 0.60;

    // Calculate total amount including fee
    const totalAmount = subtotalAmount + feeAmount;

    const handlePaymentSuccess = async () => {
        setProcessingPayment(true);

        try {
            // Use existing checkout logic
            await handleCheckout();
            // Demo toast is handled in PaymentOptions component
        } catch (error) {
            toast.error("Payment completed but order processing failed. Please contact support.");
        } finally {
            setProcessingPayment(false);
            setShowPaymentOptions(false);
        }
    };

    const handlePaymentError = (error: string) => {
        toast.error(`Payment failed: ${error}`);
        setProcessingPayment(false);
    };

    const handleCheckout = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const userId = session.user.id;

            // Prepare the purchases data to match the purchases table schema
            const purchasesData = cartItems.map(item => ({
                user_id: userId,
                event_id: item.eventSummary.selectedEvent.id,
                side_games_data: item.sideGamesData,
                total_cost: item.sideGamesData.totalCost,
                purchase_date: new Date().toISOString(),
                status: 'completed'
            }));

            try {
                // Check for existing purchases for these events
                const eventIds = cartItems.map(item => item.eventSummary.selectedEvent.id);
                const { data: existingPurchases, error: fetchError } = await supabase
                    .from('purchases')
                    .select('event_id, side_games_data')
                    .eq('user_id', userId)
                    .in('event_id', eventIds);

                if (fetchError) {
                    console.error("Error fetching existing purchases:", fetchError);
                    toast.error("An error occurred while checking existing purchases.");
                    return;
                }

                // Build a map of event_id to set of purchased side game keys
                const eventToPurchased: Record<string, Set<string>> = {};
                (existingPurchases || []).forEach((purchase: any) => {
                    const data = purchase.side_games_data || {};
                    let keys: string[] = [];
                    if (Array.isArray(data.rows) && data.rows.length > 0) {
                        data.rows.forEach((row: any) => {
                            if (row.selected) {
                                const normalizedKey = ((row.key || row.name || '')
                                    .toLowerCase()
                                    .replace(/^[0-9]+_/, '')
                                    .replace(/[^a-z0-9]/g, '_'));
                                keys.push(normalizedKey);
                            }
                        });
                    } else {
                        if (data.net) {
                            keys.push(
                                (data.net || '')
                                    .toLowerCase()
                                    .replace(/^[0-9]+_/, '')
                                    .replace(/[^a-z0-9]/g, '_')
                            );
                        }
                        if (data.division) {
                            keys.push(
                                (data.division || '')
                                    .toLowerCase()
                                    .replace(/^[0-9]+_/, '')
                                    .replace(/[^a-z0-9]/g, '_')
                            );
                        }
                        if (data.superSkins) {
                            keys.push('super_skins');
                        }
                    }
                    eventToPurchased[purchase.event_id] = new Set(keys);
                });

                // Filter purchasesData to only include new side games
                const newPurchases: any[] = [];
                const duplicateSideGamesByEvent: Record<string, string[]> = {};
                const idToName = Object.fromEntries(cartItems.map(item => [item.eventSummary.selectedEvent.id, item.eventSummary.selectedEvent.name]));

                purchasesData.forEach((purchase) => {

                    const purchasedSet = eventToPurchased[purchase.event_id] || new Set();
                    const newRows = (purchase.side_games_data.rows || []).filter((row: any) => {
                        const normalizedKey = ((row.key || row.name || '')
                            .toLowerCase()
                            .replace(/^[0-9]+_/, '')
                            .replace(/[^a-z0-9]/g, '_'));
                        return row.selected && !purchasedSet.has(normalizedKey);
                    });
                    const duplicateRows = (purchase.side_games_data.rows || []).filter((row: any) => {
                        const normalizedKey = ((row.key || row.name || '')
                            .toLowerCase()
                            .replace(/^[0-9]+_/, '')
                            .replace(/[^a-z0-9]/g, '_'));
                        return row.selected && purchasedSet.has(normalizedKey);
                    });
                    if (duplicateRows.length > 0) {
                        duplicateSideGamesByEvent[purchase.event_id] = duplicateRows.map((row: any) => row.name);
                    }
                    if (newRows.length > 0) {
                        // Only include the new side games in the purchase
                        newPurchases.push({
                            ...purchase,
                            side_games_data: {
                                ...purchase.side_games_data,
                                rows: newRows,
                            },
                            total_cost: newRows.reduce((sum: number, row: any) => sum + (row.cost || 0), 0),
                        });
                    }
                });

                // Show a toast for any duplicate side games
                const duplicateMsgs = Object.entries(duplicateSideGamesByEvent).map(([eventId, names]) => {
                    return `${idToName[eventId] || eventId}: ${names.join(", ")}`;
                });
                if (duplicateMsgs.length > 0) {
                    toast.error("You have already purchased the following side games: " + duplicateMsgs.join("; "));
                }
                if (newPurchases.length === 0) {
                    // All side games are duplicates, block purchase
                    return;
                }

                // Insert only new purchases
                if (newPurchases.length > 0) {
                    const { error: purchaseError } = await supabase
                        .from('purchases')
                        .insert(newPurchases);

                    if (purchaseError) {
                        console.error("Purchase Error:", purchaseError);
                        // Handle specific error codes
                        switch (purchaseError.code) {
                            case '23505': // Unique violation error code
                                toast.error("You have already purchased this event.");
                                return;
                            default:
                                toast.error("An error occurred while adding your purchases. Please try again.");
                                break;
                        }
                        return; // Exit after handling the error
                    }
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
                // Demo toast is handled in PaymentOptions component
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
                                        <button className="w-max rounded-lg bg-yellow-400 p-2 hover:bg-primary hover:text-black" onClick={() => onOpenCart?.()}>
                                            Return to Cart
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Fee Breakdown */}
                    <div className="border-t border-gray-400 mt-4 pt-4">
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${subtotalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-yellow-400">
                                <span>Processing Fee (3% + $0.60):</span>
                                <span>${feeAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-400 font-semibold border-t border-gray-400 pt-1">
                                <span>Total:</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center p-2">
                        {!showPaymentOptions ? (
                            <button
                                className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-primary hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setShowPaymentOptions(true)}
                                disabled={processingPayment || cartItems.length === 0}
                            >
                                {processingPayment ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        ) : (
                            <div className="w-full space-y-4">
                                <button
                                    className="w-full rounded-lg bg-gray-600 py-2 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setShowPaymentOptions(false)}
                                    disabled={processingPayment}
                                >
                                    ← Back to Review
                                </button>
                                <PaymentOptions
                                    totalAmount={totalAmount}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentError={handlePaymentError}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ReviewCart; 