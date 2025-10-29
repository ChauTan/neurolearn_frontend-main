"use client";
import * as React from "react";
import Image from "next/image";
import Arrow from "@/public/assets/dashboard/course/Arrow - Right 3.svg";

interface Option {
    label: string;
    value: string;
}

interface FormSelectProps {
    label?: string;
    placeholder?: string;
    options: Option[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export function FormSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Select",
    required = false,
    error,
    disabled = false,
    className = "",
    ...props
}: FormSelectProps) {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label className="text-base font-bold leading-5 text-stone-950">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`appearance-none w-full h-[56px] px-4 pr-10 rounded-xl text-sm text-stone-900 bg-[#F7F8FA] focus:ring-2 focus:ring-blue-600 outline-none
            ${error ? "ring-2 ring-red-500 focus:ring-red-500" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <Image
                    src={Arrow}
                    alt="Arrow icon"
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
