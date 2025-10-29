"use client";
import * as React from "react";
import { FilterTag } from "./FilterTag";

interface FilterTagsProps {
    tags: string[];
    selectedTag?: string;
    onTagSelect?: (tag: string) => void;
}

export const FilterTags: React.FC<FilterTagsProps> = ({
    tags,
    selectedTag,
    onTagSelect,
}) => {
    return (
        <section className="relative w-full max-w-[1280px] mx-auto py-2 mt-30">
            {/* Background rounded bar */}
            {/* <div className="absolute inset-0 h-16 bg-[#E5E5E5] rounded-[120px] z-0 items-center justify-center" /> */}

            {/* Tag buttons */}
            <nav className="relative z-10 flex flex-row flex-wrap items-center gap-2">
                {tags.map((tag) => (
                    <FilterTag
                        key={tag}
                        label={tag}
                        isSelected={selectedTag === tag}
                        onClick={() => onTagSelect?.(tag)}
                    />
                ))}
            </nav>
        </section>
    );
};
