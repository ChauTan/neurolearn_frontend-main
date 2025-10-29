"use client";

import React, { useState } from "react";
import { Button } from "@/components/common/ui/Button2";
import { UploadCloud, X } from "lucide-react";
import { useUploadLessonVideoMutation } from "@/lib/redux/features/course/section/lesson/lessonApi";
import VideoPlayer from "./VideoPlayer";

interface VideoUploaderProps {
    lessonId: string;
    onUploadComplete: (data: { public_id: string; url: string }) => void;
    initialVideo?: { public_id: string; url: string };
    maxSize?: number;
    allowedTypes?: string[];
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
    lessonId,
    onUploadComplete,
    initialVideo,
    maxSize = 100,
    allowedTypes = ["video/mp4", "video/webm", "video/ogg"],
}) => {
    const [video, setVideo] = useState(initialVideo);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [uploadLessonVideo] = useUploadLessonVideoMutation();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setError(`Unsupported file type. Please upload: ${allowedTypes.join(", ")}`);
            return;
        }

        if (file.size > maxSize * 1024 * 1024) {
            setError(`File too large. Maximum size: ${maxSize}MB`);
            return;
        }

        setError("");
        setIsUploading(true);

        try {
            const res = await uploadLessonVideo({
                lessonId,
                file,
            }).unwrap();

            if (res?.data?.videoUrl) {
                setVideo(res.data.videoUrl);
                onUploadComplete(res.data.videoUrl);
            } else {
                setError("Upload succeeded but no video URL returned.");
            }
        } catch (err: any) {
            setError(err?.data?.message || "Failed to upload video.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setVideo(undefined);
        onUploadComplete({ public_id: "", url: "" });
        setError("");
    };

    return (
        <div className="space-y-4">
            {video?.url ? (
                <div className="space-y-2">
                    <div className="aspect-video rounded overflow-hidden border">
                        <VideoPlayer url={video.url} controls />
                    </div>

                    <Button
                        variant="ghost" size="sm"
                        onClick={handleRemove}
                        className="self-end"
                    >
                        <X size={14} className="item-end" />
                        Remove Video
                    </Button>
                </div>
            ) : (
                <div className="border border-input rounded-lg p-4">
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition">
                        <UploadCloud size={24} className="text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">
                            {isUploading ? "Uploading..." : "Click to upload video"}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                            Supported: MP4, WebM, OGG | Max: {maxSize}MB
                        </p>
                        <input
                            type="file"
                            accept={allowedTypes.join(",")}
                            onChange={handleUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </label>
                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </div>
            )}
        </div>
    );
};