import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    footerContent?: React.ReactNode; // Optional footer content
    className?: string; // Optional className for additional styling
    theme?: string | null;
}

const Card: React.FC<CardProps> = ({ title, children, footerContent, className, theme }) => {
    return (
        <div className='flex justify-center'>
            <div className='min-w-[380px]'>
                <div className={`shadow-[0_10px_50px_-10px_rgba(0,0,0,0.5)] text-center rounded-lg p-2 ${className}`} style={{ backgroundColor: theme || undefined }}>
                    {/* Header Section */}
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    {/* Body Section */}
                    <div>{children}</div>
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