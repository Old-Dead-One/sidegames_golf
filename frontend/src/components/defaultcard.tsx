import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    footerContent?: React.ReactNode; // Optional footer content
    className?: string; // Optional className for additional styling
    theme?: string | null;
    includeInnerCard?: boolean; // Optional prop to include inner grey card
    innerCardClassName?: string; // Optional className for inner card styling
}

const Card: React.FC<CardProps> = ({
    title,
    children,
    footerContent,
    className,
    theme,
    includeInnerCard = false,
    innerCardClassName = ""
}) => {
    return (
        <div className='flex justify-center'>
            {/* Standardized width based on screen size instead of content */}
            <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl'>
                <div className={`shadow-[0_10px_50px_-10px_rgba(0,0,0,0.5)] text-center rounded-lg p-2 ${className}`} style={{ backgroundColor: theme || undefined }}>
                    {/* Header Section */}
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    {/* Body Section */}
                    <div>
                        {includeInnerCard ? (
                            <div className="p-2 text-left flex justify-center mx-auto w-full">
                                <div className={`p-4 bg-neutral-500 bg-opacity-95 rounded-lg w-full ${innerCardClassName}`}>
                                    {children}
                                </div>
                            </div>
                        ) : (
                            children
                        )}
                    </div>
                    {/* Footer Section */}
                    {footerContent && (
                        <div className="p-2">
                            {footerContent}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;