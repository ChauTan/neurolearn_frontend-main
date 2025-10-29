import { CheckCircle2, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/ui/Popover'; // Đường dẫn từ shadcn/ui
import { IQuizResult } from '@/types/leaner';

interface QuizResultCellProps {
  result: IQuizResult | undefined;
}

const QuizResultCell: React.FC<QuizResultCellProps> = ({ result }) => {
  if (!result || result.status === 'not_taken') {
    return <span className="text-gray-400">—</span>;
  }

  const getIcon = () => {
    if (result.status === 'passed') {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    return <XCircle className="w-6 h-6 text-orange-500" />;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>{getIcon()}</button>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-xl shadow-lg">
        <div className="flex flex-col gap-4 p-2">
          <h4 className="font-semibold text-center text-black">{result.quizName}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-gray-500">Total Assignment</span>
              <span className="font-bold text-black">
                {result.totalAssignment}/{result.maxAssignment}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500">Total Score</span>
              <span className="font-bold text-black">
                {result.totalScore}/{result.maxScore}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-lg">
            {result.status === 'failed' ? (
              <XCircle className="w-5 h-5 text-orange-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            <span className="font-medium text-gray-800">
              {result.status === 'failed' ? 'Not completed' : 'Completed'}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuizResultCell;
