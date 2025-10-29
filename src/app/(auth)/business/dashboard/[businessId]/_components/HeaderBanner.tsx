import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/common/ui/Button2';

interface HeaderBannerProps {
  businessId: string;
}

export default function HeaderBanner({}: HeaderBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-8 text-white">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/business/Rectangle 424.png"
          alt="Decorative background"
          fill
          className="object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-600/60 to-transparent"></div>
      </div>

      {/* Text Content */}
      <div className="relative z-20 max-w-lg">
        <h1 className="text-3xl font-bold">Empower Your Team with Smarter Learning</h1>
        <p className="mt-2 text-primary-50">
          Unlock special savings for businesses with bulk course purchases. Efficiently upskill your
          team with our AI-powered training platform.
        </p>

        {/* 2. Thay thế bằng Button component */}
        <Button variant="hero" size="hero" className="mt-6">
          Get Started
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
