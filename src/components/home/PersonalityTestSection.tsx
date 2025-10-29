'use client';

import Button from '../common/ui/Button';

const traits = [
  {
    label: 'REALISTIC',
    desc: 'Practical, hands-on, tangible work'
  },
  {
    label: 'CONVENTIONAL',
    desc: 'Structured, organized, careful'
  },
  {
    label: 'INVESTIGATIVE',
    desc: 'Practical, hands-on, tangible work'
  },
  {
    label: 'ENTERPRISING',
    desc: 'Practical, hands-on, tangible work'
  },
  {
    label: 'ARTISTIC',
    desc: 'Practical, hands-on, tangible work'
  },
  {
    label: 'SOCIAL',
    desc: 'Practical, hands-on, tangible work'
  }
];

export default function PersonalityTestSection() {
  return (
    <section className="py-10">
      <div className="container mx-auto flex flex-col gap-[60px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <h2 className="text-[54px] leading-[64px] text-[#0D0D0D] max-w-[648px] font-normal">
            Test your personality and interests
          </h2>
          <Button href="/courses" variant="primary">
            Explore Now
          </Button>
        </div>

        {/* Description */}
        <p className="text-[24px] leading-[29px] max-w-[525px] text-[#4B5563] font-medium">
          <span className="text-[#3858F8]">Explore your strengths, preferences</span>, and discover your <span className="text-[#3858F8]">growth path</span> with this quick personality quiz.
        </p>

        {/* Timeline */}
        <div className="relative h-[20px] w-full max-w-[1080px]">
          <div className="absolute top-[8px] left-0 right-0 h-1 bg-[#3858F8] rounded-[12px] z-0" />
          <div className="flex justify-between items-center absolute top-0 left-0 right-0 z-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="w-[20px] h-[20px] bg-[#3858F8] rounded-full" />
            ))}
          </div>
        </div>

        {/* Traits */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[32px] max-w-[1240px]">
          {traits.map((trait, idx) => (
            <div key={idx} className="flex flex-col gap-[10px] w-[180px]">
              <h3 className="text-[20px] text-[#0D0D0D]">{trait.label}</h3>
              <p className="text-[12px] text-[#6B6B6B] leading-[14px]">{trait.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
