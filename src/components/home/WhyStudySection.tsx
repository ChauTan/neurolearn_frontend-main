// "use client";

// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import AnimatedSection from '@/components/animations/AnimatedSection';
// import { fadeIn, slideUp, staggerContainer } from '@/utils/animations';

// interface ReasonCardProps {
//   number: string;
//   title: string;
//   description: string;
//   index: number;
// }

// const ReasonCard = ({ number, title, description, index }: ReasonCardProps) => (
//   <motion.div
//     className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm relative"
//     variants={slideUp}
//     transition={{ delay: index * 0.2 }}
//     whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
//   >
//     <div className="flex items-center mb-3">
//       <motion.h3
//         className="text-2xl font-bold text-gray-900"
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
//       >
//         {number}
//       </motion.h3>
//       <div className="ml-auto">
//         <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
//           <Image src="/assets/home/Arrow.svg" alt="Arrow" width={24} height={24} />
//         </motion.div>
//       </div>
//     </div>
//     <h4 className="font-medium mb-2">{title}</h4>
//     <p className="text-sm text-gray-600">{description}</p>
//   </motion.div>
// );

// const WhyStudySection = () => {
//   const reasons = [
//     {
//       number: '01',
//       title: 'Learn from Top Industry Experts',
//       description: 'Get access to high-quality content from industry professionals'
//     },
//     {
//       number: '02',
//       title: 'Reasonable Cost, Exceptional Value',
//       description: 'Affordable pricing with premium features and lifetime access'
//     },
//     {
//       number: '03',
//       title: 'Flexible Learning, Anytime, Anywhere',
//       description: 'Study at your own pace and according to your personal schedule'
//     },
//   ];

//   return (
//     <section className="py-12">
//       <div className="container mx-auto px-4">
//         <AnimatedSection variants={fadeIn}>
//           <h2 className="text-xl font-medium mb-8">Why do you study on EDUIO?</h2>
//         </AnimatedSection>
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-3 gap-6"
//           variants={staggerContainer}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-50px" }}
//         >
//           {reasons.map((reason, index) => (
//             <ReasonCard
//               key={reason.number}
//               number={reason.number}
//               title={reason.title}
//               description={reason.description}
//               index={index}
//             />
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default WhyStudySection;
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, slideUp, staggerContainer } from '@/utils/animations';

interface ReasonCardProps {
  number: string;
  title: string;
  description: string;
  index: number;
}

const ReasonCard = ({ number, title, description, index }: ReasonCardProps) => (
  <motion.div
    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4"
    variants={slideUp}
    transition={{ delay: index * 0.2 }}
    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
  >
    <div className="flex items-center gap-4">
      <h3 className="text-[64px] font-light leading-none text-[#0D0D0D]">{number}</h3>
      <div className="ml-auto">
        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Image src="/assets/home/Arrow.svg" alt="Arrow" width={38} height={46} />
        </motion.div>
      </div>
    </div>
    <div className="mt-2">
      <h4 className="text-[24px] leading-[32px] text-[#0D0D0D] font-medium mb-1">{title}</h4>
      <p className="text-[14px] leading-[20px] text-[#6B6B6B]">{description}</p>
    </div>
  </motion.div>
);

const WhyStudySection = () => {
  const reasons = [
    {
      number: '01',
      title: 'Learn from Top Experts',
      description:
        'Our instructors are leading experts with extensive experience in finance and technology, helping you access practical and valuable knowledge.',
    },
    {
      number: '02',
      title: 'Reasonable Cost, Exceptional Value',
      description:
        'We offer high-quality courses at affordable prices, allowing you to invest in your future without financial burden.',
    },
    {
      number: '03',
      title: 'Flexible Learning, Anytime, Anywhere',
      description:
        'Our modern online learning system lets you study anytime, anywhere via the cloud, track your progress, and improve your skills in the most convenient way.',
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto">
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-3xl md:text-4xl text-[#0D0D0D] mb-12">
            Why do you study on Academix ?
          </h2>
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {reasons.map((reason, index) => (
            <ReasonCard
              key={reason.number}
              number={reason.number}
              title={reason.title}
              description={reason.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyStudySection;
