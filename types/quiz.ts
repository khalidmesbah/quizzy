export type QuestionType = 'multiple-choice' | 'true-false';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options: QuestionOption[];
  timeLimit?: number | null;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  attempts?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  sessionId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answersData: Record<string, string>;
}