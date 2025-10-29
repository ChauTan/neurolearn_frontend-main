"use client";
import * as React from "react";

interface FilterTagProps {
    label: string;
    isSelected?: boolean;
    onClick?: () => void;
}

export const FilterTag: React.FC<FilterTagProps> = ({
    label,
    isSelected = false,
    onClick
}) => {
    const baseClasses = "gap-2.5 self-stretch px-4 py-2.5 rounded-[44px] cursor-pointer transition-colors";
    const selectedClasses = "text-white bg-blue-600";
    const unselectedClasses = "text-neutral-500 bg-zinc-300 hover:bg-zinc-400";

    const classes = isSelected
        ? `${baseClasses} ${selectedClasses}`
        : `${baseClasses} ${unselectedClasses}`;

    return (
        <button
            className={classes}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    );
};
