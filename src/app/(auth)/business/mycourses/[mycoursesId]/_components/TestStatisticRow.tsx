import Image from 'next/image';
import { ILearner } from '@/types/leaner';
import QuizResultCell from './QuizResultCell';

interface TestStatisticRowProps {
  learner: ILearner;
  index: number;
  quizHeaders: string[]; // Mảng các tên quiz, vd: ["Quiz 1", "Quiz 2", ...]
}

const TestStatisticRow: React.FC<TestStatisticRowProps> = ({ learner, index, quizHeaders }) => {
  return (
    <div className="grid grid-cols-12 gap-3 items-center py-2">
      {/* Learner Info */}
      <div className="col-span-4 flex items-center gap-4">
        <span className="w-6 text-center text-md font-medium text-gray-900">{index}</span>
        <div className="flex items-center gap-3">
          <Image
            src={learner.avatar?.url || '/default-avatar.png'}
            alt={learner.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-md text-black">{learner.name}</p>
            <p className="text-xs text-gray-600">{learner.email}</p>
          </div>
        </div>
      </div>

      {/* Quiz Results */}
      <div className="col-span-8 grid grid-cols-5 gap-3 text-center">
        {quizHeaders.map(quizName => {
          const result = learner.quizResults.find(r => r.quizName === quizName);
          return (
            <div key={quizName} className="flex justify-center">
              <QuizResultCell result={result} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestStatisticRow;
