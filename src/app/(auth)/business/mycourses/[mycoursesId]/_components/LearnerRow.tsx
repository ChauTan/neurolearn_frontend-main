import Image from 'next/image';
import { ILearner } from '@/types/leaner';
import CircularProgress from './CircularProgress';
import { format } from 'date-fns';
import defaultAvatar from '@/public/assets/images/default-avatar.png';

interface LearnerRowProps {
  learner: ILearner;
  index: number;
}

const getStatusLabel = (status: 'not_started' | 'in_progress' | 'completed') => {
  switch (status) {
    case 'not_started':
      return 'Not Started';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

const getStatusColor = (status: 'not_started' | 'in_progress' | 'completed') => {
  switch (status) {
    case 'not_started':
      return 'bg-gray-400';
    case 'in_progress':
      return 'bg-yellow-500';
    case 'completed':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

const getStatusFromProgress = (progress: number) => {
  if (progress === 0) return 'not_started';
  if (progress === 100) return 'completed';
  return 'in_progress';
};

const LearnerRow: React.FC<LearnerRowProps> = ({ learner, index }) => {
  const status = getStatusFromProgress(learner.progress);
  const statusLabel = getStatusLabel(status);
  const statusDotColor = getStatusColor(status);
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM, yyyy');
    } catch {
      return 'Invalid date';
    }
  };
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      {/* Index and Full Name */}
      <div className="col-span-3 flex items-center gap-4">
        <span className="w-6 text-center text-md font-medium text-gray-900">{index}</span>
        <div className="flex items-center gap-3">
          <Image
            src={learner.avatar?.url || defaultAvatar}
            alt={learner.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-md text-black">{learner.name}</p>
            <p className="text-[10px] text-gray-600">{learner.email}</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-2">
        <div className="px-3 py-2 bg-gray-100 rounded-full inline-flex items-center justify-center gap-2 text-sm font-medium">
          <span className={`w-2.5 h-2.5 rounded-full ${statusDotColor}`}></span>
          <span className="text-gray-900">{statusLabel}</span>
        </div>
      </div>

      {/* Last Opened Content */}
      <div
        className="col-span-3 text-sm font-medium text-gray-900"
        title={learner.lastOpenedContent}
      >
        {formatDate(learner.enrollmentDate)}
      </div>

      {/* Enrollment Date */}
      <div className="col-span-2 text-[14px] font-medium text-gray-900 pl-2">
        {formatDate(learner.dueDate)}
      </div>

      {/* Progress */}
      <div className="col-span-2 flex items-center gap-3 pl-2">
        <CircularProgress value={learner.progress} />
        <span className="w-10 text-[14px] font-medium text-gray-900">{learner.progress}%</span>
      </div>
    </div>
  );
};

export default LearnerRow;
