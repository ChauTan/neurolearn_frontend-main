"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/common/ui/Button2";
import { FormInput } from "../step1/FormInput";
import { Save, X } from "lucide-react";
import { VideoUploader } from "./VideoUploader";

interface AddEditLessonModalProps {
    lesson?: any;
    onSubmit: (data: any) => void;
    onClose: () => void;
}

export default function AddEditLessonModal({
    lesson,
    onSubmit,
    onClose,
}: AddEditLessonModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isFree: false,
        videoUrl: { public_id: "", url: "" },
        links: [] as Array<{ title: string; url: string }>,
    });

    const [replaceVideo, setReplaceVideo] = useState(false);

    useEffect(() => {
        if (!lesson) return;
        setFormData({
            title: lesson.title || "",
            description: lesson.description || "",
            isFree: lesson.isFree || false,
            videoUrl: lesson.videoUrl || { public_id: "", url: "" },
            links: lesson.links || [],
        });
        setReplaceVideo(false); // về preview mỗi lần mở lesson khác
    }, [lesson]);

    const hasVideo = !!formData.videoUrl?.url;

    const handleSave = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        // Overlay + container
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-xl shadow-lg w-full max-w-xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {lesson ? "Edit Lesson" : "Add New Lesson"}
                </h3>

                <FormInput
                    label="Lesson Title"
                    placeholder="Enter lesson title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                        className="w-full border border-gray-300 rounded p-2 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">
                        Video Content
                    </label>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        {/* Khung 16:9, NHỎ LẠI nhờ max-w và canh giữa */}
                        <div
                            className="relative mx-auto w-full max-w-[500px] aspect-video rounded-lg overflow-hidden bg-slate-100"
                        >
                            {hasVideo && !replaceVideo ? (
                                <video
                                    key={formData.videoUrl?.url}
                                    className="absolute inset-0 w-full h-full object-contain bg-white"
                                    src={formData.videoUrl.url}
                                    controls
                                    playsInline
                                    // nếu có thumbnail -> đỡ bị nền đen khi pause/chưa play
                                    // poster={formData.videoUrl?.thumbnail || "/images/video-placeholder.png"}
                                />
                            ) : (
                                    <div className="absolute inset-0 flex items-center justify-center p-3">
                                        <VideoUploader
                                            key={lesson?._id || "new"}
                                            lessonId={lesson?._id || ""}
                                            onUploadComplete={(videoData) => {
                                                setFormData((prev) => ({ ...prev, videoUrl: videoData }));
                                                setReplaceVideo(false);
                                            }}
                                            initialVideo={formData.videoUrl}
                                        />
                                    </div>
                            )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            {hasVideo && !replaceVideo ? (
                                <>
                                    <Button variant="outline" size="sm" onClick={() => setReplaceVideo(true)}>
                                        Replace video
                                    </Button>
                                    <span className="text-xs text-slate-500">
                                        Current: <code className="text-slate-600">{formData.videoUrl.public_id || "—"}</code>
                                    </span>
                                </>
                            ) : (
                                <span className="text-xs text-slate-500">Upload or drag a video file</span>
                            )}
                        </div>
                    </div>
                </div>


                {/* Nút hành động — đã bỏ sticky */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSave}>
                        <Save className="mr-2" size={18} />
                        Save Lesson
                    </Button>
                </div>
            </div>
        </div>
    );
}
