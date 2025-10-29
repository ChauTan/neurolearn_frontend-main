import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { StatusBadge } from './StatusBadge';

interface CourseDetailsProps {
  memberCount: string;
  creationDate: string;
  originalPrice: string;
  salePrice: string;
  status?: string;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({
  memberCount,
  creationDate,
  originalPrice,
  salePrice,
  status
}) => {
  return (
    <div className="flex flex-col mt-2 w-full">
      <div className="flex gap-10 items-start self-start text-xs font-medium leading-none">
        <div className="w-[179px]">
          <div className="text-neutral-500">
            People{" "}
          </div>
          <div className="flex gap-1 items-center mt-1 w-full text-stone-950">
            <div className="self-stretch my-auto text-stone-950">
              {memberCount}
            </div>
          </div>
        </div>
        <div className="w-20">
          <div className="text-neutral-500">
            Creation Date
          </div>
          <time className="mt-2.5 text-stone-950">
            {creationDate}
          </time>
        </div>
      </div>
      <div className="flex justify-between items-end w-full mt-3 gap-4">
        <PriceDisplay
          originalPrice={originalPrice}
          salePrice={salePrice}
        />
        <StatusBadge status={status} />
      </div>
    </div>
  );
};
