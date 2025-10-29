"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/common/ui/Button2";
import {
    GripVertical,
    ChevronUp,
    ChevronDown,
    Plus,
    Trash2,
    HelpCircle,
    CheckCircle2,
    FileText,
} from "lucide-react";

interface SectionItemProps {
    section: any;
    index: number;
    isEditing: boolean;
    editingTitle: string;
    isExpanded: boolean;
    onEdit: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    onChange: (title: string) => void;
    onSave: (id: string) => void;
    onToggleExpand: (id: string) => void;
    onAddLesson: (id: string) => void;
    onAddQuiz: (id: string) => void; // ✅ thêm prop mới
}

// Badge rất gọn: Published / Draft dựa trên isPublished
export const StatusBadge: React.FC<{ published: boolean }> = ({ published }) => {
    const cls = published
        ? "text-green-700 bg-green-50 ring-1 ring-green-200"
        : "text-gray-700 bg-gray-100 ring-1 ring-gray-200";
    const Icon = published ? CheckCircle2 : FileText;
    const label = published ? "Published" : "Draft";

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`} title={label}>
            <Icon size={14} />
            {label}
        </span>
    );
};

const SectionItem: React.FC<SectionItemProps> = ({
    section,
    index,
    isEditing,
    editingTitle,
    isExpanded,
    onEdit,
    onDelete,
    onChange,
    onSave,
    onToggleExpand,
    onAddLesson,
    onAddQuiz
}) => {
    return (
        <Draggable draggableId={section._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                                {...provided.dragHandleProps}
                                className="text-gray-400 hover:text-gray-600 cursor-grab shrink-0"
                            >
                                <GripVertical size={18} />
                            </div>

                            {/* 🆕 Status badge nằm trước title để luôn nhìn thấy */}
                            <StatusBadge published={!!section?.isPublished} />

                            {isEditing ? (
                                <input
                                    value={editingTitle}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={() => onSave(section._id)}
                                    onKeyDown={(e) => e.key === "Enter" && onSave(section._id)}
                                    autoFocus
                                    className="border-b border-blue-500 focus:border-blue-600 focus:outline-none w-full px-2 py-1 text-gray-800 font-medium"
                                />
                            ) : (
                                <span
                                    onClick={() => onEdit(section._id, section.title)}
                                        className="text-gray-800 font-medium cursor-text hover:bg-gray-50 px-2 py-1 rounded truncate"
                                        title={section.title}
                                >
                                    {section.title}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <Button variant="ghost2" size="sm" onClick={() => onToggleExpand(section._id)}>
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </Button>

                            <Button variant="ghost" size="sm" onClick={() => onAddLesson(section._id)}>
                                <Plus size={16} className="mr-1" />
                                Add Lesson
                            </Button>

                            <Button variant="ghost" size="sm" onClick={() => onAddQuiz(section._id)}>
                                <HelpCircle size={16} className="mr-1" />
                                Add Quiz
                            </Button>

                            <Button variant="ghost" size="sm" onClick={() => onDelete(section._id)}>
                                <Trash2 size={16} className="mr-1" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default SectionItem;
