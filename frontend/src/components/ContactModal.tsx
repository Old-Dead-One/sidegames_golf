import React, { useState } from 'react';

interface ContactModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: { name: string; email: string; message: string }) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ name, email, message });
        }
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setMessage('');
            onClose();
        }, 1500);
    };

    // Close modal on click outside
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
            style={{ background: open ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)' }}
            onClick={handleBackdropClick}
        >
            <div
                className={`w-full max-w-md bg-white rounded-t-2xl shadow-lg p-6 transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'} relative`}
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-lg font-semibold mb-2 text-center">Contact Support</h2>
                {submitted ? (
                    <div className="text-green-600 text-center py-8">Thank you! Your message has been sent.</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label htmlFor="contact-name" className="block text-xs font-medium text-gray-700">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-xs font-medium text-gray-700">Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-xs font-medium text-gray-700">Message</label>
                            <textarea
                                id="contact-message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                rows={4}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactModal; 