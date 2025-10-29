'use client';

import Image from 'next/image';

const notifications = [
  {
    user: 'Dao Tuan Kiet',
    time: '3d ago',
    content: `Exploring the World of 3D: Are You Ready?

We're entering an exciting 3D era! From product modeling and character design to virtual environments — 3D technology is transforming the way we learn and create.

This month, we’ll dive into:
• The latest trends in 3D design and modeling
• Top tools to explore: Blender, Unreal Engine, and more!
• Inspiring stories from leading 3D professionals in the industry

PS: Don’t forget to join our weekly discussion on Discord! This week’s topic: “Can AI replace 3D artists?” — you won’t want to miss the amazing insights from our community!`,
  },
  {
    user: 'Dao Tuan Kiet',
    time: '2w ago',
    content: `Ready to dive into 3D? This month we explore top tools like Blender, latest 3D trends, and pro tips from experts! Don’t miss our live 3D workshop this Sunday at 10 AM (GMT+7) on Zoom — perfect for beginners and creatives alike.
    
Plus, join our weekly Discord talk: “Can AI replace 3D artists?”`,
  },
];

export default function NotificationPanel() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow space-y-6">
      {notifications.map((note, index) => (
        <div key={index} className="flex gap-3 items-start">
          <Image
            src="/assets/images/avatar.png"
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="text-sm text-black font-semibold">
              {note.user},   
              <span className="text-gray-400 font-normal"> {note.time}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm mt-2 leading-relaxed text-[#0D0D0D]">
              {note.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
