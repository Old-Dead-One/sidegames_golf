import React, { useRef, useEffect } from 'react';

interface LegalModalProps {
    open: boolean;
    onClose: () => void;
    section?: string | null;
}

const LegalModal: React.FC<LegalModalProps> = ({ open, onClose, section }) => {
    const payoutRef = useRef<HTMLDivElement>(null);
    const canceledRef = useRef<HTMLDivElement>(null);
    const unclosedRef = useRef<HTMLDivElement>(null);
    const feesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && section) {
            let ref: React.RefObject<HTMLDivElement> | null = null;
            if (section === 'payout') ref = payoutRef;
            if (section === 'canceled') ref = canceledRef;
            if (section === 'unclosed') ref = unclosedRef;
            if (section === 'fees') ref = feesRef;
            if (ref && ref.current) {
                ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                ref.current.classList.add('ring-2', 'ring-indigo-400');
                setTimeout(() => {
                    ref.current && ref.current.classList.remove('ring-2', 'ring-indigo-400');
                }, 1200);
            }
        }
    }, [open, section]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
            style={{ background: open ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
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
                <h2 className="text-lg font-semibold mb-2 text-center">Legal Disclosures & Policies</h2>
                <div className="text-xs text-gray-700 space-y-4">
                    <div>
                        <h3 className="font-semibold mb-1">General Legal Disclosure</h3>
                        <p>
                            This platform is intended for organizing and managing golf side games and events. All users must comply with local laws and regulations. No gambling or sports betting is permitted.
                        </p>
                    </div>
                    <div ref={payoutRef}>
                        <h3 className="font-semibold mb-1">Payout Policy</h3>
                        <p>
                            Payouts to winners, minus processing and platform fees, are processed within 24 hours after event completion, via our payment provider. All payouts are subject to verification and compliance checks. Users are responsible for providing accurate payout information.
                        </p>
                    </div>
                    <div ref={canceledRef}>
                        <h3 className="font-semibold mb-1">Canceled Events Policy</h3>
                        <p>
                            If an event is canceled, all entry fees will be refunded to participants within 3-5 business days. No payouts will be made for canceled events. Users will be notified via email in the event of a cancellation.
                        </p>
                    </div>
                    <div ref={unclosedRef}>
                        <h3 className="font-semibold mb-1">Unclosed Events Policy</h3>
                        <p>
                            If an event date has passed and the event creator does not close out the event within 48 hours, the event will be treated as canceled. All entry fees, minus processing and platform fees, will be refunded to participants within 3-5 business days. No payouts will be made for unclosed events.
                        </p>
                    </div>
                    <div ref={feesRef}>
                        <h3 className="font-semibold mb-1">Refund Policy for Fees</h3>
                        <p>
                            Processing and platform fees are non-refundable in the event of a cancellation or unclosed event. Only the remaining entry fee will be refunded to participants.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalModal; 