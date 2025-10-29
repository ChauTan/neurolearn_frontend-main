"use client";
import * as React from "react";

interface FormInputProps {
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    error?: string;
    disabled?: boolean;
}

export function FormInput({
    label,
    placeholder,
    required = false,
    type = "text",
    value,
    onChange,
    className = "",
    error,
    disabled = false,
}: FormInputProps) {
    return (
        <div className={`flex flex-col gap-2 items-start w-full ${className}`}>
            <label className="text-base text-gray-900 font-bold leading-5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`p-3 h-14 text-sm text-gray-900 rounded-xl bg-slate-50 border outline-none w-full
          ${error ? "ring-2 ring-red-500 focus:ring-red-500" : "border-none focus:ring-2 focus:ring-blue-600"}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
