"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/common/ui/Button2";
import { FormInput } from "../step1/FormInput";
import { Save, Plus, X } from "lucide-react";

interface AddEditSectionProps {
    onClose: () => void;
    courseId: string;
    onSubmit: (data: {
        title: string;
        description: string;
        isPublished: boolean;
        courseId?: string; // tiện nếu parent cần kèm courseId
    }) => void | Promise<any>;
    mode?: "add" | "edit";
    initialData?: {
        title: string;
        description: string;
        isPublished: boolean;
    };
}

const AddEditSection: React.FC<AddEditSectionProps> = ({
    onClose,
    onSubmit,
    mode = "add",
    initialData,
    courseId,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // 👇 dùng boolean thay vì string
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setIsPublished(!!initialData.isPublished);
        } else {
            setTitle("");
            setDescription("");
            setIsPublished(false);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            // nếu parent là async, chờ xong rồi mới đóng để tránh “đóng nhưng chưa publish”
            await onSubmit({
                title,
                description,
                isPublished,
                courseId, // gửi kèm nếu BE cần
            });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div
                className="relative bg-white rounded-xl shadow-lg w-full max-w-lg p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {mode === "edit" ? "Edit Section" : "Create New Section"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Section Title"
                        placeholder="Enter section title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <FormInput
                        label="Description"
                        placeholder="Enter section description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                            {mode === "edit" ? (
                                <>
                                    <Save className="mr-2" size={18} />
                                    {submitting ? "Saving..." : "Save Changes"}
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2" size={18} />
                                        {submitting ? "Adding..." : "Add Section"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditSection;
