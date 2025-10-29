"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface CardOptionProps {
    courseId: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPublish?: (id: string) => void;
    onUnpublish?: (id: string) => void;
}

const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 0.5,
            staggerChildren: 0.05,
            when: "beforeChildren",
        },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            type: "spring",
            stiffness: 300,
        },
    }),
};

const CardOption: React.FC<CardOptionProps> = ({
    courseId,
    onDelete,
    onPublish,
    onUnpublish,
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
        setOpen(false);
    };

    const handleAction = (action?: (id: string) => void) => {
        if (action) action(courseId);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuItems = [
        {
            label: "Edit",
            action: () => handleNavigate(`/instructor/courses/edit-course/${courseId}`),
            color: "text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:ring-1 hover:ring-gray-300 hover:rounded-xl"
        },
        {
            label: "Course Detail",
            action: () => handleNavigate(`/instructor/courses/${courseId}`),
            color: "text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:ring-1 hover:ring-gray-300 hover:rounded-xl"
        },
        {
            label: "Analytics",
            action: () => handleNavigate(`/instructor/dashboard`),
            color: "text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:ring-1 hover:ring-gray-300 hover:rounded-xl"
        },
        onPublish && {
            label: "Publish",
            action: () => handleAction(onPublish),
            color: "text-green-700 hover:bg-green-100 hover:text-green-900 hover:ring-1 hover:ring-green-300 hover:rounded-xl"
        },
        onUnpublish && {
            label: "Unpublish",
            action: () => handleAction(onUnpublish),
            color: "text-yellow-700 hover:bg-yellow-100 hover:text-yellow-900 hover:ring-1 hover:bg-yellow-50 hover:rounded-xl"
        },
        onDelete && {
            label: "Delete",
            action: () => handleAction(onDelete),
            color: "text-red-700 hover:bg-red-100 hover:text-red-900 hover:ring-1 hover:ring-red-300 hover:rounded-xl"
        },
    ].filter(Boolean) as { label: string; action: () => void; color: string }[];



    return (
        <div className="relative z-[9999] inline-block text-left" ref={dropdownRef}>
            <motion.button
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 rounded hover:bg-muted transition"
                aria-label="Open options"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <MoreVertical className="rotate-90 text-gray-900" size={18} />
            </motion.button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="absolute right-0 z-[9999] mt-2 w-48 rounded-xl shadow-xl bg-white ring-1 ring-black/5 py-2"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                            zIndex: 99999,
                        }}
                    >
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={item.label}
                                onClick={item.action}
                                variants={itemVariants}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`block w-full z-[9999] text-left px-4 py-2 text-sm font-semibold rounded-xl transition box-shadow ${item.color}`}

                            >
                                {item.label}

                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CardOption;
