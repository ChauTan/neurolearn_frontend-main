"use client";
import * as React from "react";
import { FeatureCard } from "./FeatureCard";
import { LargeFeatureCard } from "./LargeFeatureCard";
import Arrow from "@/public/assets/home/Arrow.svg"
import Image from "next/image";
import image63 from "@/public/assets/home/image 63.svg";
import image64 from "@/public/assets/home/image 64.svg"

export const LearningGoals: React.FC = () => {
    return (
        <section className="max-w-[1280px] mx-auto py-16">
            <h1 className="text-2xl md:text-4xl text-black mb-10">
                Learning focused on your goals
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Section (3 cards) */}
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard
                            title="Hands-on training"
                            description="Upskill effectively with AI-powered coding exercises, practice tests, and quizzes."
                            icon={image63}
                        />
                        <FeatureCard
                            title="Certification prep"
                            description="Prep for industry-recognized certifications by solving real-world challenges and earn badges along the way"
                            icon={image64}
                        />
                    </div>

                    <LargeFeatureCard
                        title="Insights and analytics"
                        description="Fast-track goals with advanced insights plus a dedicated customer success team to help drive effective learning."
                    />
                </div>

                {/* Right Chart/Image */}
                <div className="w-full h-full relative">
                    <Image
                        src="https://res.cloudinary.com/dru8k4x8v/image/upload/v1750002042/0222e8011284b06733ebdc9a94474eda226417ef_xuahuh.png"
                        alt="Learning score chart"
                        width={800}
                        height={600}
                        className="w-full h-full object-contain rounded-3xl"
                        layout="responsive"
                    />
                    <Image
                        src={Arrow}
                        alt="Arrow"
                        className="top-0 right-0 z-100 absolute transition-transform group-hover:rotate-12"
                        width={60}
                        height={60}
                    />
                </div>
            </div>
        </section>
    );
};

export default LearningGoals;
