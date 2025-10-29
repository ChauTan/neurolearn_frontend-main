import { User } from './user'; // Giả sử user.ts ở cùng thư mục

export interface ILearner extends User {
  status: 'Learning' | string; // 'Learning' hoặc một chuỗi thời gian như '2 hours ago'
  lastOpenedContent: string;
  enrollmentDate: string;
  progress: number; // Phần trăm từ 0 đến 100
  quizResults: IQuizResult[]; // Thêm mảng kết quả quiz
  dueDate: string; // Ngày hết hạn khóa học
}

export interface IQuizResult {
  quizId: string;
  quizName: string; // "Quiz 1", "Quiz 2", ...
  status: 'passed' | 'failed' | 'not_taken';
  totalAssignment: number;
  maxAssignment: number;
  totalScore: number;
  maxScore: number;
}
