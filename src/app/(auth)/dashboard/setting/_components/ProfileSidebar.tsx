// src/app/(auth)/dashboard/setting/_components/ProfileSidebar.tsx
'use client';
import React, { useRef } from 'react'; // Thêm useRef
import Image from 'next/image';
import { Facebook, Mail } from 'lucide-react';
import { User } from '@/types/user';

interface ProfileSidebarProps {
  user?: User | null;
  // onPhotoEditClick: () => void; // Bỏ đi, xử lý trực tiếp ở đây
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Callback mới
  newAvatarPreview?: string | null; // Prop để nhận URL preview của ảnh mới
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  onFileChange,
  newAvatarPreview,
}) => {
  // Tạo một ref để truy cập vào input file ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditPhotoClick = () => {
    // Khi nhấn nút, kích hoạt click của input file
    fileInputRef.current?.click();
  };

  if (!user) {
    // Skeleton Loader
    return (
      <aside className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0 bg-white p-6 sm:p-8 rounded-2xl shadow-sm self-start animate-pulse">
        <div className="flex flex-col items-center text-center">
          <div className="bg-gray-300 w-32 h-32 rounded-full mb-4"></div>
          <div className="h-7 bg-gray-300 rounded-md w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
          <div className="mt-5 w-full h-11 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-gray-300 rounded-full w-5 h-5"></div>
              <div className="h-5 bg-gray-200 rounded-md w-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-300 rounded-full w-5 h-5"></div>
              <div className="h-5 bg-gray-200 rounded-md w-full"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const userRole =
    (user.profession || user.role).charAt(0).toUpperCase() +
    (user.profession || user.role).slice(1);

  // Xác định nguồn ảnh: ưu tiên ảnh preview mới, sau đó là ảnh từ user, cuối cùng là ảnh mặc định
  const avatarSrc = newAvatarPreview || user.avatar?.url || '/assets/images/default-avatar.png';

  return (
    <aside className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0 bg-white p-6 sm:p-8 rounded-2xl flex flex-col">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
          <Image
            src={avatarSrc} // <<-- SỬ DỤNG NGUỒN ẢNH ĐỘNG
            alt={user.name}
            fill
            sizes="128px"
            className="rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{user.name}</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">{userRole}</p>

        {/* Input file ẩn */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg, image/webp"
        />

        {/* Nút này giờ sẽ kích hoạt input file */}
        <button
          onClick={handleEditPhotoClick}
          className="mt-5 bg-blue-500 hover:cursor-pointer text-white px-8 py-2.5 rounded-3xl text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Edit your photo
        </button>
      </div>

      <div className="flex-grow"></div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Information</h2>
        <div className="space-y-3">
          {user.socialLinks?.facebook && (
            <a
              href={user.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Facebook size={18} className="text-gray-400" />
              <span className="text-sm truncate">
                {user.socialLinks.facebook.split('/').pop() || user.socialLinks.facebook}
              </span>
            </a>
          )}
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600 truncate">{user.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
