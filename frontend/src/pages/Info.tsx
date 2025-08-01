import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Card from '../components/defaultcard';

const faqs = [
    {
        question: "What personal data do you collect?",
        answer:
            "We use your email to identify you and maintain your play history. Additionally, use your name and address for financial transactions, and compliance with local laws.",
    },
    {
        question: "Why are the processing costs added to the entrance fee?",
        answer:
            "To simplify the prize pool and payout. We could take the processing fees from your entrance fees but the prize pool would be a random number based on the remaining entrance money after processing.",
    },
    {
        question: "Is this a sports betting site?",
        answer:
            "No, there is no gambling associated with this site. You cannot place a bet on someone in the field to win. This app is intended to simplify golf side games, not bet on golf.",
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
        answer: "Yes, you can update your profile information in the Account page or delete your account. Deleting your account will remove your profile and all associated data.",
    },
    // {
    //     question: "What are the rules for side games?",
    //     answer: "Each event may have different side games. Rules are provided in the event details or by the event organizer.",
    // },
    {
        question: "Why do I need to verify my email or complete my profile?",
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
        answer: "Use the Forgot Password link on the login page to reset your password via email.",
    },
];

interface InfoProps {
    theme: string;
}

const FaqPage: React.FC<InfoProps & { openLegalModal: (section: string) => void }> = ({ theme, openLegalModal }) => {
    return (
        <Card
            title="Frequently Asked Questions"
            theme={theme}
            includeInnerCard={true}
        >

            {/* FAQ section */}
            <div></div>
            <div className="space-y-px divide-y divide-black bg-white bg-opacity-95 rounded-lg px-2">
                {faqs.map((faq) => (
                    <Disclosure key={faq.question} as="div" className="p-2 text-left">
                        <dt>
                            <DisclosureButton className="group flex justify-between w-full">
                                <span className="text-left text-wrap font-semibold">{faq.question}</span>
                                <span>
                                    <PlusIcon aria-hidden="true" className="h-4 group-data-[open]:hidden" />
                                    <MinusIcon aria-hidden="true" className="h-4 [.group:not([data-open])_&]:hidden" />
                                </span>
                            </DisclosureButton>
                        </dt>
                        <DisclosurePanel className="mt-2 text-sm">
                            {/* Add links to legal sections in relevant answers */}
                            {faq.question.includes('payout') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-indigo-400 underline" type="button" onClick={() => openLegalModal('payout')}>
                                        payout policy
                                    </button>
                                </span>
                            ) : faq.question.includes('canceled') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-indigo-400 underline" type="button" onClick={() => openLegalModal('canceled')}>
                                        canceled events policy
                                    </button>
                                </span>
                            ) : faq.question.includes('unclosed') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-indigo-400 underline" type="button" onClick={() => openLegalModal('unclosed')}>
                                        unclosed events policy
                                    </button>
                                </span>
                            ) : faq.question.includes('fee') ? (
                                <span>
                                    {faq.answer} For more details, see our{' '}
                                    <button className="text-indigo-400 underline" type="button" onClick={() => openLegalModal('fees')}>
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
