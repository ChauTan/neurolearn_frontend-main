'use client';

import HeroSection from '@/components/home/HeroSection';
import CourseGrid from '@/components/home/CourseGrid';
import WhyStudySection from '@/components/home/WhyStudySection';
import ExpertsSection from '@/components/home/ExpertsSection';
import FutureOfWorkSection from '@/components/home/FutureOfWorkSection';
import PersonalityTestSection from '@/components/home/PersonalityTestSection';
import VideoSection from '@/components/home/VideoSection';
import FilterTagsContainer from '@/components/common/ui/FilterTagsContainer';
import LearningGoals from '@/components/home/LearningGoals';
import BecomeInstructorBusiness from '@/components/home/BecomeInstructorBusiness';
import CourseGridTopViewing from '@/components/home/CourseGridTopViewing';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <FilterTagsContainer />

      {/* Popular Courses */}
      <CourseGrid title="Popular Courses" />

      {/* Why Study Section */}
      <WhyStudySection />

      {/* Learners are viewing */}
      <CourseGridTopViewing title="Learners are viewing" />

      {/* Learning Focused */}
      <LearningGoals />

      {/* Our Experts */}
      <ExpertsSection />

      {/* Future of Work Section */}
      <FutureOfWorkSection />

      {/* Personality Test Section */}
      <PersonalityTestSection />

      {/* Video Section */}
      <VideoSection />

      {/*Become instructor/business*/}
      <BecomeInstructorBusiness />
    </div>
  );
}
