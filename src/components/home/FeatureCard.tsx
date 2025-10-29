"use client";
import * as React from "react";
import Arrow from "@/public/assets/home/Arrow.svg";
import Image, { StaticImageData } from "next/image";
import Subtract1 from "@/public/assets/home/Subtract-1.svg";

interface FeatureCardProps {
    title: string;
    description: string;
    className?: string;
    icon: StaticImageData;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    className = "",
    icon
}) => {
    return (
        <div className={`grow shrink self-stretch my-auto min-w-60 w-[249px] ${className}`}>
            <div className="relative aspect-[1.21] w-full flex flex-col items-start py-5 pr-6 pl-3 overflow-hidden rounded-2xl">
                {/* Background using Image (Subtract1.svg) */}
                <Image
                    src={Subtract1}
                    alt="Background"
                    fill
                    className="object-cover absolute inset-0 z-0"
                />

                {/* Overlay image 63 (e.g. top-right decoration) */}
                <Image
                    src={icon}
                    alt="Decoration 63"
                    width={72}
                    height={72}
                    className="absolute bottom-0 z-10"
                />

                {/* Text content */}
                <h2 className="relative z-10 text-xl font-medium text-black">
                    {title}
                </h2>
                <p className="relative z-10 mt-4 text-xs leading-4 text-neutral-500">
                    {description}
                </p>

                {/* Arrow icon */}
                <Image
                    src={Arrow}
                    alt="Arrow"
                    width={40}
                    height={40}
                    className="absolute right-1 top-0 z-10 transition-transform group-hover:rotate-12"
                />
            </div>
        </div>
    );
};
