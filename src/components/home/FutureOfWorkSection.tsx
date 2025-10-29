'use client';

import Button from '@/components/common/ui/Button';

interface FutureOfWorkSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

const FutureOfWorkSection = ({
  title = 'Top Trends For',
  subtitle = 'The Future Of Work',
  description = 'Our 2025 Global Learning & Skills Trends Report is out now! Find out how to build the skills to keep pace with change.',
  buttonText = 'Get Started',
  buttonUrl = '/trends',
}: FutureOfWorkSectionProps) => {
  return (
    <section className="py-10">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl overflow-hidden shadow-sm relative">
          <div
            className="absolute top-0 left-0 right-0 bottom-0 z-0"
            style={{
              backgroundImage: `url(/assets/home/TopTrend.png)`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="relative z-10 min-h-[240px] flex items-center">
            <div className="p-8 md:p-12 w-full md:w-3/5">
              <h2 className="text-3xl font-bold text-black mb-1">{title}</h2>
              <h3 className="text-3xl font-bold text-blue-600 mb-4">{subtitle}</h3>
              <p className="text-gray-700 mb-6 max-w-md">{description}</p>
              <Button href={buttonUrl} variant="primary">
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureOfWorkSection;
