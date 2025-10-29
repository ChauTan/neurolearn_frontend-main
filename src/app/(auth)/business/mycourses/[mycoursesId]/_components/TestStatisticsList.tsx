import { ILearner } from '@/types/leaner';
import TestStatisticRow from './TestStatisticRow';

interface TestStatisticsListProps {
  learners: ILearner[];
}

const quizHeaders = ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'];

const TestStatisticsList: React.FC<TestStatisticsListProps> = ({ learners }) => {
  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col gap-6">
      {/* Header sẽ được quản lý bởi component cha */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 pb-4 text-gray-500 font-medium">
            <div className="col-span-4 pl-10">Full Name</div>
            <div className="col-span-8 grid grid-cols-5 gap-3 text-center">
              {quizHeaders.map(header => (
                <div key={header}>{header}</div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col gap-2">
            {learners.map((learner, index) => (
              <TestStatisticRow
                key={learner._id}
                learner={learner}
                index={index + 1}
                quizHeaders={quizHeaders}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestStatisticsList;
