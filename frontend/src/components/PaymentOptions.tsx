import React, { useState } from 'react';
import { FaApplePay, FaGooglePay, FaPaypal, FaCreditCard } from 'react-icons/fa';
import { SiVenmo, SiCashapp } from 'react-icons/si';
import { toast } from 'react-toastify';

interface PaymentOptionsProps {
    totalAmount: number;
    onPaymentSuccess: (paymentMethod: string, paymentDetails: any) => void;
    onPaymentError: (error: string) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
    totalAmount,
    onPaymentSuccess
}) => {
    const [processingPayment, setProcessingPayment] = useState<string | null>(null);

    const handlePayment = async (paymentMethod: string) => {
        setProcessingPayment(paymentMethod);

        // Simulate payment processing
        setTimeout(() => {
            setProcessingPayment(null);

            // Show demo notification
            toast.success(
                <div>
                    <div className="font-bold text-lg mb-2">🎯 DEMO MODE - Payment Successful!</div>
                    <div className="text-sm space-y-1">
                        <div><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</div>
                        <div><strong>Amount:</strong> {formatAmount(totalAmount)}</div>
                        <div><strong>Status:</strong> Simulated Success</div>
                        <div className="mt-2 text-xs text-gray-600">
                            This is a demonstration. In production, this would integrate with {paymentMethod} payment gateway.
                        </div>
                    </div>
                </div>,
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );

            onPaymentSuccess(paymentMethod, {
                id: `${paymentMethod}-${Date.now()}`,
                amount: totalAmount,
                status: 'completed'
            });
        }, 2000);
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Select Payment Method</h3>
                <div className="text-sm text-gray-300 space-y-1">
                    <div>Total: {formatAmount(totalAmount)}</div>
                    <div className="text-xs text-gray-400">Includes processing fee</div>
                </div>
            </div>

            <div className='flex flex-row justify-center gap-2'>
                {/* Apple Pay Button */}
                <button
                    onClick={() => handlePayment('apple-pay')}
                    disabled={processingPayment !== null}
                    className="w-full h-12 bg-black text-white rounded-lg flex items-center justify-center font-medium text-base hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                        background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    {processingPayment === 'apple-pay' ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaApplePay className="w-12 h-12 mr-2" />
                            {/* <span className="font-semibold">Pay</span> */}
                        </div>
                    )}
                </button>

                {/* Google Pay Button */}
                <button
                    onClick={() => handlePayment('google-pay')}
                    disabled={processingPayment !== null}
                    className="w-full h-12 bg-white text-black rounded-lg flex items-center justify-center font-medium text-base hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300"
                    style={{
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    {processingPayment === 'google-pay' ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaGooglePay className="w-12 h-12 mr-2" />
                            {/* <span className="font-semibold">Google Pay</span> */}
                        </div>
                    )}
                </button>

                {/* PayPal Button */}
                <button
                    onClick={() => handlePayment('paypal')}
                    disabled={processingPayment !== null}
                    className="w-full h-12 rounded-lg flex items-center justify-center font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                        background: 'linear-gradient(135deg, #0070ba 0%, #005ea6 100%)',
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    {processingPayment === 'paypal' ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaPaypal className="w-6 h-6 mr-2" />
                            <span className="text-lg">PayPal</span>
                        </div>
                    )}
                </button>

                {/* Venmo Button */}
                <button
                    onClick={() => handlePayment('venmo')}
                    disabled={processingPayment !== null}
                    className="w-full h-12 rounded-lg flex items-center justify-center font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                        background: 'linear-gradient(135deg, #008CFF 0%, #0070CC 100%)',
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    {processingPayment === 'venmo' ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <SiVenmo className="w-16 h-16" />
                            {/* <span className="font-semibold">Venmo</span> */}
                        </div>
                    )}
                </button>

                {/* Cash App Button */}
                <button
                    onClick={() => handlePayment('cash-app')}
                    disabled={processingPayment !== null}
                    className="w-full h-12 rounded-lg flex items-center justify-center font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                        background: 'linear-gradient(135deg, #00D632 0%, #00B329 100%)',
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    {processingPayment === 'cash-app' ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <SiCashapp className="w-6 h-6 mr-2" />
                            <span className="font-semibold">Cash App</span>
                        </div>
                    )}
                </button>

                {/* Traditional Credit Card Option */}
                <button
                    onClick={() => handlePayment('credit-card')}
                    disabled={processingPayment !== null}
                    className="w-full h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center font-medium text-base hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-600"
                >
                    {processingPayment === 'credit-card' ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaCreditCard className="w-6 h-6 mr-2" />
                            <span className="font-semibold">Credit</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentOptions; 