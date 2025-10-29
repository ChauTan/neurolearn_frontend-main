import React from 'react';

interface PriceDisplayProps {
    originalPrice: string;
    salePrice: string;
    currency?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
    originalPrice,
    salePrice,
}) => {
    return (
        <div className="flex flex-col items-start gap-1 w-[134px]">
            <span className="text-xs font-medium text-gray-500">Sale</span>
            <div className="flex flex-col">
                <span className="text-xs line-through text-gray-500">
                    {originalPrice}
                </span>
                <span className="text-xl font-semibold text-blue-600">
                    {salePrice}
                </span>
            </div>
        </div>
    );
};

