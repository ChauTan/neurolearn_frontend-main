"use client";

import React, { useState } from "react";
import { Button } from "@/components/common/ui/Button2";
import { File, UploadCloud, X } from "lucide-react";

interface UploadedFile {
    name: string;
    url: string;
    type: string;
    size: number;
}

interface FileUploaderProps {
    onUploadComplete: (file: UploadedFile) => void;
    onRemove?: (fileUrl: string) => void;
    initialFiles?: UploadedFile[];
    maxSize?: number; // in MB
    allowedTypes?: string[];
    multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onUploadComplete,
    onRemove,
    initialFiles = [],
    maxSize = 10, // 10MB default
    allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "image/jpeg",
        "image/png",
        "application/zip",
    ],
    multiple = false,
}) => {
    const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setError("");
        setIsUploading(true);

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                // Validate file type
                if (!allowedTypes.includes(file.type)) {
                    setError(`Unsupported file type: ${file.name}`);
                    continue;
                }

                // Validate file size
                if (file.size > maxSize * 1024 * 1024) {
                    setError(`File too large: ${file.name} (max ${maxSize}MB)`);
                    continue;
                }

                // Simulate upload - replace with actual API call
                const uploadedFile = await simulateFileUpload(file);

                setFiles((prev) => [...prev, uploadedFile]);
                onUploadComplete(uploadedFile);
            }
        } catch (err) {
            setError("Failed to upload files. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const simulateFileUpload = (file: File): Promise<UploadedFile> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                    size: file.size,
                });
            }, 1000);
        });
    };

    const handleRemoveFile = (index: number) => {
        const fileToRemove = files[index];
        setFiles((prev) => prev.filter((_, i) => i !== index));
        if (onRemove) {
            onRemove(fileToRemove.url);
        }
    };

    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return "📄";
        if (type.includes("word")) return "📝";
        if (type.includes("powerpoint")) return "📊";
        if (type.includes("excel")) return "📈";
        if (type.includes("image")) return "🖼️";
        if (type.includes("zip")) return "🗄️";
        return "📁";
    };

    return (
        <div className="space-y-4">
            <div className="border border-input rounded-lg p-4">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition">
                    <UploadCloud size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">
                        {isUploading ? "Uploading..." : "Click to upload files"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                        Supported: PDF, DOC, PPT, XLS, JPG, PNG, ZIP | Max: {maxSize}MB
                    </p>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                        multiple={multiple}
                        accept={allowedTypes.join(",")}
                    />
                </label>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{getFileIcon(file.type)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFile(index)}
                                    className="text-destructive hover:text-destructive/80"
                                >
                                    <X size={16} />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};