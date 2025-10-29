"use client";
import { ChevronLeft, Loader2 } from "lucide-react";
import * as React from "react";

interface StepControlProps {
    active: boolean;
    completed: boolean;
    label: string;
    stepNumber: number;
}

function StepControl({ active, completed, label, stepNumber }: StepControlProps) {
    return (
        <div className="flex items-center gap-3 flex-1">
            <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${active
                    ? "bg-blue-600 text-white"
                    : completed
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    } font-medium text-sm`}
            >
                {stepNumber}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <span
                        className={`text-sm font-medium ${active
                            ? "text-gray-900"
                            : completed
                                ? "text-gray-700"
                                : "text-gray-500"
                            }`}
                    >
                        {label}
                    </span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-100 mt-1">
                    <div
                        className={`h-full transition-all duration-300 ${active || completed
                            ? completed
                                ? "bg-green-500"
                                : "bg-blue-600"
                            : "bg-transparent"
                            }`}
                        style={{
                            width: active
                                ? "70%"
                                : completed
                                    ? "100%"
                                    : "0%",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function HeaderStepControls({
    step,
    onContinue,
    onContinueAI,
    onBack,
    onSaveDraft,
    onPublish,
    draftSaved,
    loading,
}: {
    step: 1 | 2;
    onContinue: () => void;
    onContinueAI?: () => void;
    onBack: () => void;
    onSaveDraft: () => void;
    onPublish: () => void;
    draftSaved: boolean;
    loading?: {
        draft?: boolean;
        continue?: boolean;
        publish?: boolean;
        ai?: boolean;
    };
}) {
    const isStep1 = step === 1;
    const isLoading =
        (isStep1 && (loading?.continue || loading?.ai)) ||
        (!isStep1 && loading?.publish) ||
        loading?.draft;

    return (
        <div className="flex flex-col w-full gap-4 mb-6">
            <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                    {step === 1
                        ? "Fill in basic course information"
                        : "Build your course curriculum"}
                </div>

                <div className="flex gap-2">
                    {step === 2 && (
                        <button
                            onClick={onBack}
                            className={`p-2 rounded-full border transition-colors ${isLoading
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                                }`}
                            aria-label="Back"
                            disabled={isLoading}
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}

                    {/* Save Draft */}
                    <button
                        onClick={onSaveDraft}
                        className="px-4 py-2 rounded-4xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {loading?.draft ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" /> Saving...
                            </div>
                        ) : (
                            "Save Draft"
                        )}
                    </button>

                    {/* Continue / Publish */}
                    <button
                        onClick={isStep1 ? onContinue : onPublish}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-4xl font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isStep1
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />{" "}
                                {isStep1 ? "Continuing..." : "Publishing..."}
                            </div>
                        ) : isStep1 ? (
                            "Continue"
                        ) : (
                            "Publish"
                        )}
                    </button>

                    {/* Continue with AI (only step 1) */}
                    {isStep1 && onContinueAI && (
                        <button
                            onClick={onContinueAI}
                            disabled={!!loading?.ai}
                            className="px-4 py-2 rounded-4xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading?.ai ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" /> Generating...
                                </div>
                            ) : (
                                "Continue with AI"
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Step indicators */}
            <div className="flex flex-row items-center justify-between gap-4 w-full">
                <StepControl
                    active={step === 1}
                    completed={step > 1 || draftSaved}
                    label="Course Information"
                    stepNumber={1}
                />
                <StepControl
                    active={step === 2}
                    completed={false}
                    label="Course Curriculum"
                    stepNumber={2}
                />
            </div>
        </div>
    );
}