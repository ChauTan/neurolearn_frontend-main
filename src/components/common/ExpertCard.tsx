'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SocialLinks } from '@/types/user';
import Arrow from '@/public/assets/home/Arrow.svg';
import Facebook from '@/public/assets/home/Facebook.svg';
import Linkedin from '@/public/assets/home/Linkedin.svg';
import Mail from '@/public/assets/home/Mail.svg';

interface ExpertCardProps {
  name: string;
  profession: string;
  description?: string;
  imageUrl: string;
  socialLinks?: SocialLinks;
  profileUrl?: string;
  isActive?: boolean;
  priorityImage?: boolean; // (không cần cho avatar nhưng giữ để backward-compat)
}

const ExpertCard = ({
  name,
  profession,
  description,
  imageUrl,
  socialLinks,
  profileUrl = '#',
  isActive = false,
}: ExpertCardProps) => {
  // avatar size (px)
  const AVATAR = 112; // hiển thị 112px → Next sẽ cấp 2x/3x cho màn hình retina, rất nét

  return (
    <div
      className={[
        'w-[419px] h-[350px] rounded-2xl p-5 bg-white shadow-sm',
        'border transition-all duration-200 hover:shadow-md hover:-translate-y-[2px]',
        isActive ? 'border-[#A18EFF]' : 'border-gray-100',
        'bg-clip-padding relative',
      ].join(' ')}
    >
      {/* Gradient border halo rất nhẹ */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent [background:linear-gradient(180deg,rgba(56,88,248,0.08),rgba(161,142,255,0.08))_border-box]"></div>

      {/* Header với avatar tròn */}
      <div className="w-full flex flex-col items-center">
        <div className="relative">
          {/* vòng sáng viền gradient */}
          <div className="absolute inset-0 rounded-full blur-[10px] opacity-70 bg-[conic-gradient(from_180deg,rgba(56,88,248,0.25),rgba(161,142,255,0.25),rgba(56,88,248,0.25))]" />
          <div className="relative z-[1] h-[124px] w-[124px] rounded-full bg-white p-[6px]">
            <div className="h-full w-full rounded-full bg-gradient-to-tr from-[#A18EFF] to-[#3858F8] p-[2px]">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {/* Dùng width/height cố định để Next tối ưu độ nét */}
                <Image
                  src={imageUrl}
                  alt={name}
                  width={AVATAR}
                  height={AVATAR}
                  className="rounded-full object-cover"
                  // sizes cố định theo kích thước hiển thị, đảm bảo chọn đúng biến thể ảnh
                  sizes={`${AVATAR}px`}
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tên & nghề nghiệp */}
        <div className="mt-4 text-center px-2">
          <h3
            className="text-[20px] leading-6 font-bold text-[#111827] truncate"
            title={name}
          >
            {name}
          </h3>
          <p
            className="mt-1 text-[14px] leading-5 text-[#3858F8] font-medium truncate"
            title={profession}
          >
            {profession}
          </p>
        </div>
      </div>

      {/* Description (giữ chỗ cố định để không xê dịch layout) */}
      <div className="mt-3 px-1">
        <div className="text-[13px] leading-5 text-[#6B6B6B] min-h-[60px]">
          {description && description.trim() ? (
            <p className="line-clamp-3" title={description}>
              {description}
            </p>
          ) : (
            <div className="h-[60px]" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Divider mềm */}
      <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Social + CTA */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={socialLinks?.linkedin || '#'}
            target={socialLinks?.linkedin ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="group w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ring-1 ring-inset ring-gray-200 hover:bg-[#EEF2FF] transition"
          >
            <Image src={Linkedin} alt="LinkedIn" width={16} height={16} className="opacity-90 group-hover:opacity-100" />
          </Link>
          <Link
            href={socialLinks?.facebook || '#'}
            target={socialLinks?.facebook ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="group w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ring-1 ring-inset ring-gray-200 hover:bg-[#EEF2FF] transition"
          >
            <Image src={Facebook} alt="Facebook" width={16} height={16} className="opacity-90 group-hover:opacity-100" />
          </Link>
          <Link
            href={socialLinks?.email ? `mailto:${socialLinks.email}` : '#'}
            aria-label="Email"
            className="group w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ring-1 ring-inset ring-gray-200 hover:bg-[#EEF2FF] transition"
          >
            <Image src={Mail} alt="Email" width={16} height={16} className="opacity-90 group-hover:opacity-100" />
          </Link>
        </div>

        <Link
          href={profileUrl}
          aria-label="View profile"
          className="group w-10 h-10 flex items-center justify-center rounded-full ring-1 ring-inset ring-gray-200 hover:ring-[#A18EFF] hover:bg-[#F5F3FF] transition"
        >
          <Image
            src={Arrow}
            alt="Arrow"
            width={40}
            height={40}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
};

export default ExpertCard;
