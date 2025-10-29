'use client';

import Image from 'next/image';
import Button from '@/components/common/ui/Button';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { slideFromLeft, slideFromRight } from '@/utils/animations';

const HeroSection = () => {
  return (
    <section className="pt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <AnimatedSection variants={slideFromLeft} className="md:w-1/2 mb-8 md:mb-0">
          <div className='flex items-center justify-center bg-blue-600 w-50 rounded-full items-center mb-20'>
            #1 Online Courses 2025
          </div>
          <h1 className="text-4xl font-bold">
            <span className="text-blue-600 mb-10">All The Skills You</span>
            <br />
            <span className='text-black'>Need In One Place</span>
          </h1>
          <p className="text-gray-700 mb-6">
            From coding skills to business topics. Udemy helps
            <br />
            expand your professional development.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button href="/courses" variant="primary">
              Get Started
            </Button>
          </motion.div>
        </AnimatedSection>
        <AnimatedSection
          variants={slideFromRight}
          className="md:w-1/2 md:pl-8 relative"
          delay={0.2}
        >
          <div className="relative h-64 md:h-80">
            <Image
              src="/assets/home/HeroSection.png"
              alt="Students learning"
              fill
              className="object-contain"
              priority
            />
            <motion.div
              className="
              absolute top-2 right-2 w-[158px] h-[112px] bg-white shadow-md rounded-[12px] flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-[40px] font-semibold text-[#3858F8]">800</span>
              <span className="text-[32px] font-bold text-[#3858F8]">+</span>
              <span className="absolute mt-2 text-[14px] text-gray-500">Participants</span>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
