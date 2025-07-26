import React from 'react';

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, children }) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
            style={{ background: open ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className={`w-full max-w-md h-full bg-white shadow-lg p-0 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} relative flex flex-col`}
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 z-10"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <div className="h-full overflow-y-auto pt-10 pb-4 px-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer; 