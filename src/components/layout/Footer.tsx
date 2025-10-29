'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import LogoSVG from '@/public/assets/icons/logo.svg';

export default function Footer() {
  return (
    <footer className="bg-[#F7F8FA] px-30 py-16 text-sm text-gray-600 relative z-0">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Left column - Logo + Headline */}
        <div className="col-span-1 space-y-4">
          <Link href="/" className="flex gap-2">
            <Image
              src={LogoSVG}
              alt="Academix Logo"
              width={45}
              height={45}
              priority
            />
            <span className="text-3xl font-bold text-[#0D0D0D]">
              Academix
            </span>
          </Link>
          <h2 className="text-3xl font-semibold text-black leading-tight">
            We would love to hear from you.
          </h2>
          <p className="text-xs text-gray-500 max-w-xs">
            Feel free to reach out if you want to collaborate with us, or simply have a chat
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3858F8] text-white rounded-full w-fit hover:bg-blue-700 transition"
          >
            Get Started <ArrowUpRight size={16} />
          </Link>
          <p className="text-xs mt-4">Don&apos;t like the forms? Drop us a line via email.</p>
          <p className="text-xs font-semibold text-black">info@awsmd.com</p>
        </div>

        {/* Contact Us */}
        <div className="space-y-2">
          <h4 className="text-lg font-medium text-black mb-2">Contact us</h4>
          <p className="text-xs">Our Email<br />info@gmail.com</p>
          <p className="text-xs mt-2">Our Phone<br />0123456789</p>
          <p className="text-xs mt-2">FPT UNIVERSITY<br />QUY NHON</p>
        </div>

        {/* Follow Us */}
        <div className="space-y-2">
          <h4 className="text-lg font-medium text-black mb-2">Follow us</h4>
          {['Facebook', 'Twitter', 'Instagram'].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs">{item}</span>
              <ArrowUpRight size={14} className="text-blue-600" />
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h4 className="text-lg font-medium text-black mb-2">Services</h4>
          {['About', 'Development', 'Science'].map((item, idx) => (
            <p key={idx} className="text-xs hover:text-blue-600 cursor-pointer">{item}</p>
          ))}
        </div>
      </div>

      {/* Bottom right - Back to top */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs text-black cursor-pointer hover:underline">
        Back to the top <ArrowUp size={14} className="text-blue-600 transform rotate-45" />
      </div>
    </footer>
  );
}
