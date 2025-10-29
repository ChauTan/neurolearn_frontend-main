'use client';

import { ILearner } from '@/types/leaner';
import LearnerRow from './LearnerRow';

interface LearnerListProps {
  learners: ILearner[];
}

const LearnerList: React.FC<LearnerListProps> = ({ learners }) => {
  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-medium text-black">Learner</h2>
      </div>

      {/* Overview */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-12 gap-6 pb-4 text-gray-500 font-medium">
            <div className="col-span-3 pl-10">Full Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Start Date</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">Progress</div>
          </div>

          {learners.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No employees are currently enrolled in this course
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {learners.map((learner, index) => (
                <LearnerRow key={learner._id} learner={learner} index={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnerList;
