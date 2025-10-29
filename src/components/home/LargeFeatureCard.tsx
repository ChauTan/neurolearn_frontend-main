"use client";
import Image from "next/image";
import * as React from "react";
import Arrow from "@/public/assets/home/Arrow.svg"
import Subtract2 from "@/public/assets/home/Subtract-2.svg";
import image65 from "@/public/assets/home/image 65.svg"

interface LargeFeatureCardProps {
    title: string;
    description: string;
    className?: string;
}

export const LargeFeatureCard: React.FC<LargeFeatureCardProps> = ({
    title,
    description,
    className = "",
}) => {
    return (
        <div className={`mt-3 w-full max-md:max-w-full ${className}`}>
            <div className="flex overflow-hidden relative flex-col items-start pt-3 pr-16 pb-1 pl-3 w-full fill-white min-h-[171px] max-md:pr-5 max-md:max-w-full">
                <Image
                    src={Subtract2}
                    alt="subtract-2"
                    className="object-cover absolute inset-0 size-full"
                />
                <Image
                    src={image65}
                    alt="Decoration 63"
                    width={72}
                    height={72}
                    className="absolute bottom-0 z-10"
                />
                <h2 className="relative text-xl font-medium text-black">
                    {title}
                </h2>
                <p className="relative mt-2.5 text-xs leading-4 text-neutral-500 w-[300px]">
                    {description}
                </p>
                <Image
                    src={Arrow}
                    alt="Arrow"
                    className="right-1 top-0 absolute transition-transform group-hover:rotate-12"
                    width={40}
                    height={40}
                />
            </div>
        </div>
    );
};
