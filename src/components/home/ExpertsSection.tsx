"use client";

import ExpertCard from '@/components/common/ExpertCard';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Loading from '@/components/common/Loading';
import { useGetAllExpertsQuery } from '@/lib/redux/features/expert/expertApi';

const ExpertsSection = () => {
  const { data: experts, isLoading, error } = useGetAllExpertsQuery();
  const displayExperts = experts ? experts.slice(0, 3) : [];

  if (isLoading) {
    return <Loading title="Our Experts" />;
  }

  if (error) {
    console.error('Error fetching experts:', error);  
    return (
      <section className="py-10">
        <div className="container mx-auto">
          <h2 className="text-4xl font-medium mb-6 text-black">Our Experts</h2>
          <div className="text-center text-gray-500">Error loading experts</div>
        </div>
      </section>
    );
  }

  if (displayExperts.length === 0) {
    return (
      <section className="py-10">
        <div className="container mx-auto">
          <h2 className="text-4xl font-medium mb-6 text-black">Our Experts</h2>
          <div className="text-center text-gray-500">No experts available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto">
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-4xl mb-8 text-black">Our Experts</h2>
        </AnimatedSection>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayExperts.map((expert) => (
            <motion.div
              key={expert._id}
              variants={fadeIn}
            >
              <ExpertCard
                name={expert.name}
                profession={expert.profession ?? ''}
                description={expert.introduce ?? ''}
                imageUrl={expert.avatar?.url ?? '/assets/images/default-avatar.png'}
                socialLinks={expert.socialLinks}
                profileUrl={`/instructors/${expert._id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertsSection;