import React, { useState } from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    footerContent?: React.ReactNode; // Optional footer content
    footerTitle?: string; // Optional title for the footer toggle
    className?: string; // Optional className for additional styling
    theme?: string | null;
    includeInnerCard?: boolean; // Optional prop to include inner grey card
    innerCardClassName?: string; // Optional className for inner card styling
    paddingClassName?: string; // Optional className for padding (overrides default p-4)
    topPaddingClassName?: string; // Optional className for top padding only
}

const Card: React.FC<CardProps> = ({
    title,
    children,
    footerContent,
    footerTitle = "Help & Instructions",
    className,
    theme,
    paddingClassName,
    topPaddingClassName,
    includeInnerCard = false,
    innerCardClassName = ""
}) => {
    const [footerOpen, setFooterOpen] = useState(false);

    // Default padding is p-4, but can be overridden with paddingClassName
    const defaultPadding = "p-4";
    const finalPadding = paddingClassName || defaultPadding;

    // If topPaddingClassName is provided, we need to construct custom padding
    const getInnerCardPadding = () => {
        if (topPaddingClassName) {
            // If top padding is specified, use it for top and default p-4 for other sides
            return `${topPaddingClassName} px-4 pb-4`;
        }
        return finalPadding;
    };

    return (
        <div className='flex justify-center'>
            {/* Standardized width based on screen size instead of content */}
            <div className='w-full mx-4 max-w-xl sm:max-w-4xl md:max-w-4xl lg:max-w-4xl xl:max-w-4xl 2xl:max-w-4xl'>
                <div className={`shadow-[0_10px_50px_-10px_rgba(0,0,0,0.5)] p-4 text-center rounded-lg ${className}`} style={{ backgroundColor: theme || undefined }}>
                    {/* Header Section */}
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    {/* Body Section */}
                    <div>
                        {includeInnerCard ? (
                            <div className="text-left flex justify-center mx-auto w-full">
                                <div className={`bg-neutral-500 bg-opacity-90 rounded-lg w-full p-2 ${innerCardClassName} ${getInnerCardPadding()}`}>
                                    {children}
                                </div>
                            </div>
                        ) : (
                            children
                        )}
                    </div>
                    {/* Footer Section */}
                    {footerContent && (
                        <div className="mt-4">
                            <button
                                onClick={() => setFooterOpen(!footerOpen)}
                                className="w-full flex items-center justify-between text-xs text-gray-300 hover:text-white transition-colors p-2 rounded-lg bg-gray-800 bg-opacity-80"
                            >
                                <span className="font-semibold">{footerTitle}</span>
                                <span className={`transition-transform duration-200 ${footerOpen ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${footerOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="pt-2">
                                    {footerContent}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;