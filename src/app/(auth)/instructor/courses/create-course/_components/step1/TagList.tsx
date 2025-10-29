"use client";
import * as React from "react";
import Image from "next/image";
import closeIcon from "@/public/assets/dashboard/course/Close_Icons_UIA.svg";

interface TagListProps {
    tags: string | string[];
    onRemoveTag: (index: number) => void;
    className?: string;
    error?: string;
}

export function TagList({
    tags,
    onRemoveTag,
    className = "",
    error,
}: TagListProps) {
    const tagArray = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
            ? tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

    return (
        <div className={`w-full ${className}`}>
            <div className="flex flex-row flex-wrap gap-3 items-center">
                {tagArray.map((tag, index) => (
                    <div
                        key={index}
                        className="flex justify-center items-center px-3 py-[4px] h-6 bg-[#3858F8] rounded-[40px] gap-2"
                    >
                        <span className="text-[12px] leading-[14px] text-white font-normal">
                            {tag}
                        </span>
                        <button
                            type="button"
                            onClick={() => onRemoveTag(index)}
                            className="relative w-2 h-2"
                            aria-label={`Remove ${tag} tag`}
                        >
                            <Image src={closeIcon} alt="Remove tag" width={8} height={8} />
                        </button>
                    </div>
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}
