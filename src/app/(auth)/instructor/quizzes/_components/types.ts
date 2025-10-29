// types.ts

export interface AnswerOptionData {
  id: string;
  text: string;
}

export interface QuestionData {
  id: string;
  questionNumber: number;
  title: string;
  questionType: 'single-choice' | 'multiple-choice';
  questionImage?: File | string | null;
  choicesConfig: {
    isMultipleAnswer: boolean;
    isAnswerWithImageEnabled: boolean;
  };
  options: AnswerOptionData[];
  correctAnswerIds: string[];
  points: string;
  isRequired: boolean;
}

export interface Quiz {
  _id: string;
  name: string;
  questions: QuestionData[];
  passingScore?: number;
  maxAttempts?: number;
  createdAt?: string;
  examTitle?: string;
  totalQuestions?: number;
  duration?: string;
  progress?: number;
  imageUrl?: string;
  category?: string;
}

export interface QuestionSummary {
  id: string;
  number: number;
  textPreview: string;
  type: 'single-choice' | 'multiple-choice';
  typeIcon?: React.ReactNode;
}

// >>> THÊM HOẶC ĐẢM BẢO CÁC INTERFACE NÀY ĐƯỢC EXPORT <<<
export interface ManualCreationDetails {
  mode: 'manual';
  examTitle: string;
  duration: string;
}

export interface AICreationDetails {
  mode: 'ai';
  examTitle: string;
  documentFile?: File | null;
  difficultyLevel: string;
  topic: string;
  questionConfigs: Array<{ type: string; count: number }>;
}
// >>> -------------------------------------------------- <<<

export interface UserAnswer {
  questionId: string; // ID của câu hỏi
  selectedOptionIds: Set<string>; // Tập hợp các ID lựa chọn mà người dùng đã chọn
}

export interface QuestionResultItemData {
  questionNumber: number; // Số thứ tự câu hỏi (1, 2, 3...)
  status: 'correct' | 'incorrect' | 'skipped'; // Trạng thái: đúng, sai, bỏ qua
  questionData: QuestionData; // Dữ liệu gốc của câu hỏi
  userAnswer: UserAnswer; // Câu trả lời của người dùng
  pointsEarned: number; // Điểm đạt được cho câu hỏi này
  maxPoints: number; // Tổng điểm tối đa của câu hỏi này
  rationale?: string; // Tùy chọn: giải thích đáp án đúng
}

export interface QuizResultsSummary {
  totalQuestions: number;
  attemptedQuestions: number; // Số câu đã cố gắng trả lời
  correctQuestions: number; // Số câu đúng
  incorrectQuestions: number; // Số câu sai
  skippedQuestions: number; // Số câu bỏ qua
  totalScore: number; // Tổng điểm người dùng đạt được
  maxPossibleScore: number; // Tổng điểm tối đa của toàn bài quiz
  overallStatus: 'completed' | 'submitted' | 'time-out'; // Trạng thái chung của bài quiz
  resultsBreakdown: QuestionResultItemData[]; // Chi tiết kết quả từng câu hỏi
}
