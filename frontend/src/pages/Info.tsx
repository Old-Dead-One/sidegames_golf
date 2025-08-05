import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Card from '../components/defaultcard';

const faqs = [
    {
        question: "What personal data do you collect?",
        answer:
            "We use your email to identify you and maintain your play history. Additionally, use your name and address for financial transactions, and compliance with state and federal laws.",
    },
    {
        question: "Why are the processing costs added to the entrance fee?",
        answer:
            "To simplify the prize pool and payout. We could take the processing fees from your entrance fees but the prize pool would be a random number based on the remaining entrance fees after processing.",
    },
    {
        question: "Is this a sports betting site?",
        answer:
            "No, there is no gambling associated with this site. You cannot place a bet on someone in the field to win through this app. This app is intended to simplify golf side games, not bet on golf.",
    },
    // --- Additional FAQs ---
    // {
    //     question: "How do I join a game or event?",
    //     answer: "Browse available events on the Find a Game page, select one, and follow the prompts to join and pay.",
    // },
    // {
    //     question: "How do I create a new event?",
    //     answer: "Go to the Create a Game page, select a tour, and follow the prompts to create an event. You must have a complete profile and a verified email to create events.",
    // },
    {
        question: "How are payouts handled?",
        answer: "Payouts are processed through our payment provider. Winners will receive funds to their linked account within 24 hours after event completion.",
    },
    {
        question: "What payment methods are accepted?",
        answer: "We accept major credit cards and other secure payment methods as listed at checkout.",
    },
    {
        question: "Are my payments and personal data secure?",
        answer: "Yes, we use trusted payment processors and industry-standard security practices to protect your data.",
    },
    {
        question: "What happens if an event is canceled?",
        answer: "If an event is canceled, you will be notified and refunded according to our refund policy.",
    },
    // {
    //     question: "How do I contact support?",
    //     answer: "You can reach support via the contact form on our website or by emailing support@sidegames.golf.",
    // },
    {
        question: "Can I edit or delete my account?",
        answer: "Account management is available through the Profile dropdown menu. Navigate to the Account page to modify your profile information or delete your account. Warning: Account deletion is irreversible and will remove your profile and all associated data."
    },
    // {
    //     question: "What are the rules for side games?",
    //     answer: "Each event may have different side games. Rules are provided in the event details or by the event organizer.",
    // },
    {
        question: "Why do I need to verify my email or complete my profile to join or create events?",
        answer: "Verification helps ensure security, compliance, and a fair experience for all users.",
    },
    {
        question: "How are fees calculated?",
        answer: "Fees include payment processing and a small platform fee. Details are shown at checkout.",
    },
    // {
    //     question: "Is there a maximum number of participants for an event?",
    //     answer: "Yes, some events may have participant limits. Check the event details for specific requirements.",
    // },
    {
        question: "Can I invite friends to join an event?",
        answer: "Yes, you can share event links with friends so they can join.",
    },
    {
        question: "What if I forget my password?",
        answer: "Use the Forgot Password link on the login page to reset your password via email. If you need to change your password, you can do so in the Password page located in the Profile dropdown menu.",
    },
];

interface InfoProps {
    theme: string;
    openLegalModal: (section: string) => void;
    onContactClick?: () => void;
}

const FaqPage: React.FC<InfoProps> = ({ theme, openLegalModal, onContactClick }) => {
    return (
        <Card
            title="Frequently Asked Questions"
            theme={theme}
            includeInnerCard={true}
            topPaddingClassName=""
        >
            {/* Contact prompt section */}

            <div className="flex items-center justify-end w-full mb-4">
                <label className="text-xs text-gray-700 select-none mr-1">
                    Need Help?
                </label>
                <div className="group relative inline-flex w-[30px] h-[20px] shrink-0 items-center justify-center rounded-[5px] bg-neutral-200 hover:bg-indigo-600">
                    <button
                        onClick={onContactClick}
                    >
                        <svg
                            className="w-[40px] h-[32px] text-gray-700 group-hover:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            preserveAspectRatio="none"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* FAQ section */}
            <div className="space-y-px divide-y divide-black bg-neutral-700 rounded-[4px] px-2">
                {faqs.map((faq) => (
                    <Disclosure key={faq.question} as="div" className="p-2 text-left">
                        <dt>
                            <DisclosureButton className="group flex justify-between w-full">
                                <span className="text-left text-wrap text-neutral-200">{faq.question}</span>
                                <span>
                                    <PlusIcon aria-hidden="true" className="h-4 group-data-[open]:hidden" />
                                    <MinusIcon aria-hidden="true" className="h-4 [.group:not([data-open])_&]:hidden" />
                                </span>
                            </DisclosureButton>
                        </dt>
                        <DisclosurePanel className="text-xs bg-neutral-200 bg-opacity-95 rounded-[4px] p-2">
                            {/* Add links to legal sections in relevant answers */}
                            {faq.question.includes('payout') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-primary underline" type="button" onClick={() => openLegalModal('payout')}>
                                        payout policy
                                    </button>
                                </span>
                            ) : faq.question.includes('canceled') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-primary underline" type="button" onClick={() => openLegalModal('canceled')}>
                                        canceled events policy
                                    </button>
                                </span>
                            ) : faq.question.includes('unclosed') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-primary underline" type="button" onClick={() => openLegalModal('unclosed')}>
                                        unclosed events policy
                                    </button>
                                </span>
                            ) : faq.question.includes('fee') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-primary underline" type="button" onClick={() => openLegalModal('fees')}>
                                        refund policy for fees
                                    </button>
                                </span>
                            ) : (
                                <span>{faq.answer}</span>
                            )}
                        </DisclosurePanel>
                    </Disclosure>
                ))}
            </div>
        </Card>
    );
};

export default FaqPage;
