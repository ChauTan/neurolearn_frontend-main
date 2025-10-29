// app/.../SectionContentList.tsx
"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
    GripVertical, BookOpen, HelpCircle, Pencil, Trash2, CheckCircle2,
    FileText,
} from "lucide-react";
import { Button } from "@/components/common/ui/Button2";
import { toast } from "@/hooks/use-toast";
import {
    useReorderSectionMutation,
    useRemoveItemFromSectionMutation,
} from "@/lib/redux/features/course/section/sectionApi";
import {
    useUpdateLessonMutation,
    useDeleteLessonMutation,
} from "@/lib/redux/features/course/section/lesson/lessonApi";
import { useModal } from "@/context/ModalContext";

type MixedItem =
    | { kind: "lesson"; _id: string; order: number; title?: string; payload: any }
    | { kind: "quiz"; _id: string; order: number; name?: string; payload: any };

// Badge chỉ dựa trên isPublished
const PublishBadge: React.FC<{ published: boolean }> = ({ published }) => {
    const cls = published
        ? "text-green-700 bg-green-50 ring-1 ring-green-200"
        : "text-gray-700 bg-gray-100 ring-1 ring-gray-200";
    const Icon = published ? CheckCircle2 : FileText;
    const label = published ? "Published" : "Draft";

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
            title={label}
        >
            <Icon size={14} />
            {label}
        </span>
    );
};

export default function SectionContentList({
    section,
    onRefetch,
}: {
    section: any;
    onRefetch: () => Promise<any> | void;
}) {
    const items: MixedItem[] = section?.items || [];
    const { showModal } = useModal();

    const [reorderSection] = useReorderSectionMutation();
    const [removeItem] = useRemoveItemFromSectionMutation();

    const [updateLesson] = useUpdateLessonMutation();
    const [deleteLesson] = useDeleteLessonMutation();

    // 🔹 Helper nhỏ trong file: chuẩn hóa lỗi từ RTK/BE và bắn toast
    const showApiError = (err: any, fallback = "Request failed") => {
        let message = fallback;
        let details: string[] = [];

        const toArray = (val: any): string[] => {
            if (!val) return [];
            if (Array.isArray(val)) {
                return val
                    .map((x) =>
                        typeof x === "string" ? x : x?.msg || x?.message || x?.error || ""
                    )
                    .filter(Boolean);
            }
            if (typeof val === "object") {
                const out: string[] = [];
                for (const [k, v] of Object.entries(val)) {
                    if (Array.isArray(v)) v.forEach((s) => out.push(`${k}: ${s}`));
                    else if (typeof v === "string") out.push(`${k}: ${v}`);
                }
                return out;
            }
            if (typeof val === "string") return [val];
            return [];
        };

        // RTK FetchBaseQueryError: { status, data }
        if (err && typeof err === "object" && "status" in err) {
            const data = (err as any).data;
            if (typeof data === "string") {
                message = data;
            } else {
                message = data?.message || data?.error || err?.error || fallback;
                details = toArray(data?.errors);
            }
        }
        // SerializedError | Error | string | object tự do
        else if (err instanceof Error) {
            message = err.message || fallback;
        } else if (typeof err === "string") {
            message = err;
        } else if (err && typeof err === "object") {
            const data = (err as any).data ?? err;
            if (typeof data === "string") {
                message = data;
            } else {
                message = data?.message || data?.error || fallback;
                details = toArray(data?.errors);
            }
        }

        toast({
            title: "Error",
            description:
                details.length > 0 ? (
                    <ul className="list-disc pl-4">
                        {details.map((d, i) => (
                            <li key={i}>{d}</li>
                        ))}
                    </ul>
                ) : (
                    <span>{message}</span>
                ),
            variant: "destructive",
            duration: 6000,
        });
    };

    const handleReorder = async (result: DropResult) => {
        if (!result.destination) return;

        const reordered = [...items];
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        try {
            await reorderSection({
                sectionId: section._id,
                items: reordered.map((it, i) => ({ kind: it.kind, id: it._id, order: i })),
            }).unwrap();
            await onRefetch?.();
            toast({ title: "Success", description: "Items reordered successfully", variant: "success" });
        } catch (error) {
            showApiError(error, "Failed to reorder items");
            console.error(error);
        }
    };

    const handleEdit = async (item: MixedItem) => {
        if (item.kind === "lesson") {
            const lesson = item.payload ?? { _id: item._id, title: item.title };
            showModal("addEditLesson", {
                lesson,
                onSubmit: async (data: any) => {
                    try {
                        await updateLesson({ lessonId: lesson._id, data }).unwrap();
                        await onRefetch?.();
                        toast({ title: "Success", description: "Lesson updated successfully", variant: "success" });
                    } catch (error) {
                        showApiError(error, "Failed to update lesson");
                        console.error(error);
                    }
                },
            });
        } else {
            // TODO: mở modal edit quiz riêng
            toast({ title: "Todo", description: "Hook up quiz edit flow", variant: "default" });
        }
    };

    const handleDelete = (item: MixedItem) => {
        showModal("actionConfirm", {
            title: `Delete ${item.kind === "quiz" ? "Quiz" : "Lesson"}`,
            description: `Are you sure you want to delete "${item.kind === "quiz" ? item.payload?.name ?? item.name : item.payload?.title ?? item.title
                }"?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "destructive",
            onConfirm: async () => {
                try {
                    if (item.kind === "lesson") {
                        await deleteLesson(item._id).unwrap();
                    } else {
                        await removeItem({
                            sectionId: section._id,
                            kind: "quiz",
                            id: item._id,
                            hardDelete: false,
                        }).unwrap();
                    }
                    await onRefetch?.();
                    toast({
                        title: "Success",
                        description: `${item.kind === "quiz" ? "Quiz" : "Lesson"} deleted successfully`,
                        variant: "success",
                    });
                } catch (err) {
                    console.error(err);
                    showApiError(
                        err,
                        `Failed to delete ${item.kind === "quiz" ? "quiz" : "lesson"}`
                    );
                }
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-900">Items ({items.length})</h4>
            </div>

            <DragDropContext onDragEnd={handleReorder}>
                <Droppable droppableId={`section-items-${section._id}`}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-2 bg-secondary/30 rounded-lg p-2"
                        >
                            {items.length === 0 ? (
                                <div className="text-center py-4 text-sm text-gray-600">
                                    No items yet. Add a lesson or attach a quiz!
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <Draggable
                                        draggableId={`${item.kind}-${item._id}`}
                                        index={index}
                                        key={`${item.kind}-${item._id}`}
                                    >
                                        {(drag) => (
                                            <div
                                                ref={drag.innerRef}
                                                {...drag.draggableProps}
                                                className="bg-background border-y border-gray-200 rounded-lg overflow-hidden mb-3"
                                            >
                                                <div className="flex items-center justify-between p-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div
                                                            {...drag.dragHandleProps}
                                                            className="text-gray-400 hover:text-gray-600 cursor-grab"
                                                        >
                                                            <GripVertical size={18} />
                                                        </div>

                                                        {item.kind === "lesson" ? (
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <BookOpen size={16} className="text-gray-600" />

                                                                {/* ✅ Badge publish cho lesson */}
                                                                <PublishBadge published={!!(item.payload?.isPublished ?? (item as any)?.isPublished)} />

                                                                <span
                                                                    className="text-gray-600 truncate"
                                                                    title={item.payload?.title ?? item.title}
                                                                >
                                                                    {item.payload?.title ?? item.title}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <HelpCircle size={16} className="text-gray-600" />
                                                                    <span className="text-gray-600 truncate" title={item.payload?.name ?? item.name}>
                                                                        {item.payload?.name ?? item.name}
                                                                    </span>
                                                            </div>
                                                        )}

                                                    </div>

                                                    <div className="flex gap-2">
                                                        {item.kind === "lesson" && (
                                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                                                <Pencil size={16} />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
