"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Eye, Copy, Trash2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface QuizOptionsProps {
    quizId: string;
    onDelete?: (id: string) => Promise<void>; // <-- cho phép async
    onEdit?: (id: string) => void;
    onPreview?: (id: string) => void;
    onDuplicate?: (id: string) => void;
}
const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -12, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", damping: 18, stiffness: 260, mass: 0.5 },
    },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: -8 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.04, type: "spring", stiffness: 260 },
    }),
};

const QuizOptions: React.FC<QuizOptionsProps> = ({
    quizId,
    onDelete,
    onEdit,
    onPreview,
    onDuplicate,
}) => {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Đảm bảo click vào button không trigger Link parent
    const toggleOpen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen((s) => !s);
    };

    const handleNav = (path: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(path);
        setOpen(false);
    };

    const handleAction =
        (fn?: (id: string) => Promise<void> | void) => async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!fn) return;

            try {
                setPending(true);
                await fn(quizId); // <-- CHỜ callback async từ cha
                setOpen(false);
            } finally {
                setPending(false);
            }
        };


    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const items: {
        key: string;
        label: string;
        icon: React.ReactNode;
        onClick: (e: React.MouseEvent) => void;
        className?: string;
    }[] = [
        {
            key: "builder",
            label: "Open Builder",
            icon: <Pencil size={16} />,
            onClick: handleNav(`/instructor/quizzes/builder/${quizId}`),
        },
        onEdit && {
            key: "edit",
            label: "Edit",
            icon: <Pencil size={16} />,
            onClick: handleAction(onEdit),
        },
        onPreview && {
            key: "preview",
            label: "Preview",
            icon: <Eye size={16} />,
            onClick: handleAction(onPreview),
        },
        onDuplicate && {
            key: "duplicate",
            label: "Duplicate",
            icon: <Copy size={16} />,
            onClick: handleAction(onDuplicate),
        },
            onDelete && {
                key: 'delete',
                label: pending ? 'Deleting…' : 'Delete',
                icon: <Trash2 size={16} />,
                onClick: handleAction(onDelete),
                className: 'text-red-600 hover:bg-red-50 disabled:opacity-60',
                disabled: pending, // optional
            },
        ].filter(Boolean) as any[];

    return (
        <div className="relative z-[100]" ref={dropdownRef}>
            <motion.button
                onClick={toggleOpen}
                className="p-1.5 rounded hover:bg-gray-100 transition"
                aria-label="Open quiz options"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* dùng MoreVertical xoay 90 độ giống MoreHorizontal nếu muốn */}
                <MoreVertical className="rotate-90 text-gray-700" size={18} />
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black/5 py-2"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {items.map((it, idx) => (
                            <motion.button
                                key={it.key}
                                onClick={it.onClick}
                                variants={itemVariants}
                                custom={idx}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 rounded-lg transition ${it.className ?? ""}`}
                            >
                                {it.icon}
                                {it.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizOptions;
