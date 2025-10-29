'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500/60 to-transparent">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3858F8]/60 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center p-12">
        <div className="max-w-[420px] space-y-3">
          <h2 className="text-2xl font-semibold text-white leading-7">
            Empower Your Team with Smarter Learning
          </h2>
          <p className="text-white text-sm leading-4 opacity-90">
            Unlock special savings for businesses with bulk course purchases. Efficiently upskill
            your team with our AI-powered training platform.
          </p>
          <button className="flex items-center gap-2 bg-black text-white text-sm px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[400px] h-full">
        <div className="absolute top-4 right-20 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">9+</span>
        </div>
        <div className="absolute top-16 right-40 w-8 h-8 rounded-full bg-white/20"></div>
        <div className="absolute bottom-20 right-16 w-12 h-12 rounded-full bg-white/15"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
