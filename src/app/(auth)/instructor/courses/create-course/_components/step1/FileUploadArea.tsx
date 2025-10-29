'use client';
import Image from 'next/image';
import * as React from 'react';

interface FileUploadAreaProps {
  thumbnail: string | { url: string } | null;
  setThumbnail: (value: string | { public_id: string; url: string }) => void;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const EXT_WHITELIST = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

export function FileUploadArea({ thumbnail, setThumbnail }: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Keep a ref to revoke ObjectURL to avoid leaks
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Sync preview when `thumbnail` comes from props (e.g., server URL)
    let next: string | null = null;
    if (typeof thumbnail === 'string') next = thumbnail;
    else if (thumbnail && typeof thumbnail === 'object' && 'url' in thumbnail) next = thumbnail.url;

    // Revoke old ObjectURL (if any) when switching to an external URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImagePreview(next);
  }, [thumbnail]);

  React.useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const isImageFile = (file: File) =>
    file.type.startsWith('image/') || EXT_WHITELIST.test(file.name);

  const validate = (file: File): string => {
    if (!isImageFile(file)) return 'Images only (png, jpg, jpeg, webp, gif, avif, svg).';
    if (file.size > MAX_BYTES) return 'File too large. Maximum size is 10MB.';
    return '';
  };

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const processImage = (file: File) => {
    const msg = validate(file);
    if (msg) {
      setError(msg);
      resetInput();
      return;
    }

    setError('');

    // Create a fresh ObjectURL for preview; revoke previous one
    const objectUrl = URL.createObjectURL(file);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = objectUrl;
    setImagePreview(objectUrl);

    // Example only: convert to base64. Replace this with your real upload call.
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const mockUploaded = {
          public_id: `courses/${file.name.split('.')[0]}`,
          url: reader.result, // replace with server URL after real upload
        };
        setThumbnail(mockUploaded);
      }
    };
    reader.readAsDataURL(file);

    resetInput();
  };

  return (
    <section className="flex flex-col p-6 bg-white rounded-3xl w-full">
      <button
        type="button"
        className={`flex flex-col justify-center items-center rounded-xl border-2 border-blue-600 border-dashed w-full h-64 cursor-pointer text-left p-0 ${isDragOver ? 'bg-blue-50' : ''
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        aria-label="Upload image area"
      >
        {/* ✅ Attach the ref so click opens the file dialog */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        {imagePreview ? (
          <div className="w-full h-full p-2 pointer-events-none">
            <Image
              src={imagePreview}
              alt="Thumbnail Preview"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        ) : (
            <div className="flex flex-col gap-3 items-center text-center pointer-events-none">
              {/* Simple image icon */}
            <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
              fill="none"
                className="text-blue-500"
                aria-hidden="true"
            >
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 15l3-3 3 3 4-4 2 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="9" cy="9" r="1.2" fill="currentColor" />
            </svg>
              <p className="text-base text-neutral-600">
                Drag & drop or <span className="font-semibold text-blue-600">Choose image</span> to upload
              </p>
              <p className="text-xs text-neutral-500">
                Images only (PNG, JPG, JPEG, WEBP, GIF, AVIF, SVG) • Max 10MB
              </p>
          </div>
        )}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
