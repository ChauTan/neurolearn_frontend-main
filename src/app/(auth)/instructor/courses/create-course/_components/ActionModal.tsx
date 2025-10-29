"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/common/ui/Button2";
import { X, Loader2 } from "lucide-react";

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    description?: string;
    confirmText?: string;
    confirmTextLoading?: string;
    /** Nếu KHÔNG truyền hoặc là chuỗi rỗng -> ẩn nút Cancel */
    cancelText?: string;
    variant?: "default" | "primary" | "destructive" | "outline";
    /** true: luôn tự đóng sau khi onConfirm chạy xong (kể cả lỗi) */
    closeOnSuccess?: boolean;
}

const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    confirmTextLoading = "Processing...",
    cancelText, // ⬅️ mặc định undefined -> sẽ ẩn nút Cancel
    variant = "default",
    closeOnSuccess = true,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const hasCancel = !!(cancelText && cancelText.trim().length > 0);

    useEffect(() => {
        if (!isOpen) setIsLoading(false);
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isLoading) onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, isLoading, onClose]);

    const handleConfirm = useCallback(async () => {
        try {
            const maybe = onConfirm?.();
            if (maybe && typeof (maybe as any).then === "function") {
                setIsLoading(true);
                await (maybe as Promise<void>);
            }
        } catch {
            // modal này không hiển thị lỗi
        } finally {
            setIsLoading(false);
            if (closeOnSuccess) onClose();
        }
    }, [onConfirm, onClose, closeOnSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={!isLoading ? onClose : undefined}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="am-title"
                className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-auto z-50"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 id="am-title" className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-2 text-sm text-gray-600">{description}</p>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        {hasCancel && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                        )}

                        <Button
                            variant={variant}
                            size="sm"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? confirmTextLoading : confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
