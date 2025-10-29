'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function QnA() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow text-[#0D0D0D] space-y-6">
      {/* Search bar */}
      <div className="flex items-center gap-4 relative">
        {/* Avatar */}
        <div className="w-12 h-12 relative shrink-0">
          <Image
            src="/assets/images/avatar.png"
            alt="Avatar"
            fill
            className="rounded-full border border-gray-300 object-cover"
          />
        </div>
        {/* Search input with send button */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search for questions or answers"
            className="w-full bg-[#F7F8FA] rounded-full px-5 py-3 pr-12 text-sm outline-none placeholder-[#A0AEC0]"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <Image src="/assets/icons/send.svg" alt="Send" width={30} height={30} />
          </button>
        </div>
      </div>
      {/* Filter bar */}
      <div className="flex items-center gap-4 text-sm">
        <Image src="/assets/icons/filter.svg" alt="Filter" width={30} height={30} />
        <button className="flex items-center gap-1 px-4 py-2 bg-[#F7F8FA] rounded-full">
          Current lesson
          <Image src="/assets/icons/current-lesson.svg" alt="Filter" width={16} height={16} />
        </button>
        <button className="px-4 py-2 bg-[#F7F8FA] rounded-full flex items-center gap-1">
          Most recent
          <ChevronDown size={16} className="text-[#0D0D0D]" />
        </button>
      </div>
      {/* Title */}
      <h2 className="text-base font-semibold">All question in this course</h2>
      {/* Q&A List */}
      <div className="space-y-6">
        {/* Question block */}
        <div>
          <div className="flex items-start gap-3">
            <Image
              src="/assets/images/avatar.png"
              alt="User"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold">
                Dao Tuan Kiet, <span className="font-normal text-gray-500">at 5:05</span>
              </div>
              <p className="text-sm mt-1">
                Hey guys, I&apos;m having trouble understanding how to add curves in Blender. Any tips?
              </p>
              <div className="flex gap-4 text-xs text-gray-500 mt-1">
                <Image
                  src="/assets/icons/empty-heart.svg"
                  alt="Empty Heart"
                  width={15}
                  height={15}
                />
                <Image src="/assets/icons/comment.svg" alt="Reply Icon" width={15} height={15} />
              </div>
              {/* Reply */}
              <div className="border-l pl-3 mt-3">
                <div className="text-sm font-semibold">
                  Le Xuan Huy, <span className="font-normal text-gray-500">replied</span>
                </div>
                <p className="text-sm mt-1">
                  Sure thing, Andrew! You can go to the &quot;Add&quot; menu in Blender and select &quot;Curve&quot; to
                  add different types of curves.
                </p>
                <div className="flex items-center gap-x-1">
                  <Image
                    src="/assets/icons/empty-heart.svg"
                    alt="Empty Heart"
                    width={15}
                    height={15}
                  />
                  <span className="text-sm">2</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400">3d ago</span>
          </div>
        </div>
        {/* Another question block */}
        <div>
          <div className="flex items-start gap-3">
            <Image
              src="/assets/images/avatar.png"
              alt="User"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold">
                Le Xuan Huy, <span className="font-normal text-gray-500">at 5:05</span>
              </div>
              <p className="text-sm mt-1">
                Hey guys, I&apos;m having trouble understanding how to add curves in Blender.
              </p>
            </div>
            <span className="text-xs text-gray-400">3d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
