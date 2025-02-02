import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Card from '../components/defaultcard';

const faqs = [
    {
        question: "What personal data do you collect?",
        answer:
            "We believe your personal data is none of our business. We use your email to identify you and maintain your play history.",
    },
    {
        question: "Why do you add the prcessing costs to my entrance fee?",
        answer:
            "To simplify the prize pool and payout. We could take the processing fees from your entrance fees but the prize pool would be a random number based on the remaining entrance money after processing.",
    },
    {
        question: "Is this a sports betting site?",
        answer:
            "No, there is no gambling associated with this site. You cannot place a bet on someone in the field to win. This app is intended to simplify golf side games, not bet on golf.",
    },
];

interface InfoProps {
    theme: string;
}

const FaqPage: React.FC<InfoProps> = ({ theme }) => {
    return (
        <Card
            title="Frequently Asked Questions"
            theme={theme}
            className="mx-4"
            // footerContent={<button className="text-blue-600">Footer Action</button>}
        >

            {/* FAQ section */}
            <div className="p-2 w-auto mx-auto text-xs text-left">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="space-y-px divide-y divide-white">
                        {faqs.map((faq) => (
                            <Disclosure key={faq.question} as="div" className="p-2">
                                <dt>
                                    <DisclosureButton className="group flex justify-between w-full">
                                        <span className="text-left text-sm text-wrap font-semibold">{faq.question}</span>
                                        <span>
                                            <PlusIcon aria-hidden="true" className="h-4 group-data-[open]:hidden" />
                                            <MinusIcon aria-hidden="true" className="h-4 [.group:not([data-open])_&]:hidden" />
                                        </span>
                                    </DisclosureButton>
                                </dt>
                                <DisclosurePanel className="mt-2">
                                    <p className="text-left font-normal text-white">{faq.answer}</p>
                                </DisclosurePanel>
                            </Disclosure>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default FaqPage;
