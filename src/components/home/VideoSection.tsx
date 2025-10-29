'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { slideUp } from '@/utils/animations';

const VideoSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto flex flex-col gap-9">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          {/* Left title */}
          <AnimatedSection variants={slideUp}>
            <motion.h2
              className="text-4xl mb-2 text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Top Trends For
            </motion.h2>
            <motion.h3
              className="text-4xl text-blue-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The Future Of Work
            </motion.h3>
          </AnimatedSection>

          {/* Right description */}
          <p className="text-[16px] leading-[19px] text-[#0D0D0D] max-w-[453px]">
            Our 2025 Global Learning & Skills Trends Report is out now!<br />
            Find out how to build the skills to keep pace with change.
          </p>
        </div>

        {/* Video thumbnail */}
        <motion.div
          className="w-full h-[610px] rounded-[16px] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/assets/home/TopTrend.png"
            alt="Video Cover"
            fill
            className="object-cover rounded-[16px]"
            priority
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              className="bg-white rounded-full p-5 shadow-xl hover:scale-110 transition"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
