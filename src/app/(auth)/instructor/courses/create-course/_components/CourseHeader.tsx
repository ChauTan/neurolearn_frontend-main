"use client";

import Image from "next/image";
import React from "react";
import CardOption from "@/app/(auth)/instructor/courses/create-course/_components/CardOption";
import tag from "@/public/assets/dashboard/course/tag.svg";
import {
    courseApi,
    useDeleteCourseMutation,
    // usePublishCourseMutation,
    useUnpublishCourseMutation,
} from "@/lib/redux/features/course/courseApi";

import { useModal } from "@/context/ModalContext";
import { useDispatch } from "react-redux";

interface CourseHeaderProps {
    thumbnailImage: string;
    category: string;
    title: string;
    courseId: string;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
    thumbnailImage, category, title, courseId,
}) => {
    const [deleteCourse, { error: deleteError, isLoading: isDeleting }] = useDeleteCourseMutation();
    // const [publishCourse, { isLoading: isPublishing }] = usePublishCourseMutation();
    const [unpublishCourse, { isLoading: isUnpublishing }] = useUnpublishCourseMutation();
    const { showModal } = useModal();
    const dispatch = useDispatch();

    const getErrMsg = (e: unknown): string => {
        const anyE = e as any;
        if (!anyE) return "Failed to delete course.";
        if (typeof anyE === "string") return anyE;
        if (anyE.data) return anyE.data?.message || anyE.data?.error || JSON.stringify(anyE.data) || "Failed to delete course.";
        return anyE.message || "Failed to delete course.";
    };

    const handleDelete = async () => {
        try {
            await deleteCourse(courseId).unwrap();
            dispatch(courseApi.util.invalidateTags([{ type: "Course" }]));
            // ✅ Success modal
            showModal("actionConfirm", {
                title: "Deleted",
                description: "Course deleted successfully!",
                confirmTextLoading: "Closing…",
                variant: "primary",
            });
        } catch (err) {
            const msg = getErrMsg(err) || getErrMsg(deleteError);
            // ❌ no toast — show error modal
            showModal("actionConfirm", {
                title: "Delete failed",
                description: msg,
                confirmTextLoading: "Closing…",
                variant: "destructive",
            });
            // KHÔNG throw để tránh modal xác nhận cũ hiển thị lỗi
        }
    };

    // const handlePublish = async () => {
    //     try {
    //         await publishCourse(courseId).unwrap();
    //         showModal("actionConfirm", {
    //             title: "Published",
    //             description: "Course published successfully!",
    //             confirmTextLoading: "Closing…",
    //             variant: "primary",
    //         });
    //     } catch (err) {
    //         showModal("actionConfirm", {
    //             title: "Publish failed",
    //             description: "Failed to publish course.",
    //             confirmTextLoading: "Closing…",
    //             variant: "destructive",
    //         });
    //     }
    // };

    const handleUnpublish = async () => {
        try {
            await unpublishCourse(courseId).unwrap();
            showModal("actionConfirm", {
                title: "Unpublished",
                description: "Course unpublished successfully!",
                confirmTextLoading: "Closing…",
                variant: "primary",
            });
        } catch (err) {
            showModal("actionConfirm", {
                title: "Unpublish failed",
                description: "Failed to unpublish course.",
                confirmTextLoading: "Closing…",
                variant: "destructive",
            });
        }
    };

    return (
        <header className="w-full flex flex-col justify-between h-full relative">
            <div className="w-full text-xs font-medium leading-none text-blue-600">
                <Image
                    src={thumbnailImage || "/assets/business/book.svg"}
                    alt="Course thumbnail"
                    width={600}
                    height={320}
                    className="w-full h-[160px] object-cover rounded-2xl"
                    priority
                />

                <div className="flex justify-between items-center w-full max-w-[323px] mt-2 z-30">
                    <div className="flex gap-2 items-center">
                        <Image src={tag} alt="Tag icon" width={16} height={16} />
                        <span className="text-[#3858F8] text-sm font-medium">{category}</span>
                    </div>

                    <div className="relative z-[9999]">
                        <CardOption
                            courseId={courseId}
                            onDelete={() =>
                                showModal("actionConfirm", {
                                    title: "Delete Course",
                                    description: "Are you sure you want to delete this course?",
                                    confirmText: isDeleting ? "Deleting…" : "Delete",
                                    confirmTextLoading: "Deleting…",
                                    cancelText: "Cancel",
                                    variant: "destructive",
                                    onConfirm: handleDelete,  // sẽ mở success/error modal sau khi chạy
                                })
                            }
                            // onPublish={() =>
                            //     showModal("actionConfirm", {
                            //         title: "Publish Course",
                            //         description: "Do you want to publish this course?",
                            //         confirmText: isPublishing ? "Publishing…" : "Publish",
                            //         confirmTextLoading: "Publishing…",
                            //         cancelText: "Cancel",
                            //         variant: "primary",
                            //         onConfirm: handlePublish,
                            //     })
                            // }
                            onUnpublish={() =>
                                showModal("actionConfirm", {
                                    title: "Unpublish Course",
                                    description: "Do you want to unpublish this course?",
                                    confirmText: isUnpublishing ? "Unpublishing…" : "Unpublish",
                                    confirmTextLoading: "Unpublishing…",
                                    cancelText: "Cancel",
                                    variant: "outline",
                                    onConfirm: handleUnpublish,
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            <h2 className="w-full text-base font-semibold leading-5 text-stone-950 line-clamp-2 min-h-[40px]">
                {title}
            </h2>
        </header>
    );
};
