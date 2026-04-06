export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex?: number;
  correctAnswerIndices?: number[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  displayOptions: string[];
  correctAnswers: string[];
}

export type QuizStatus = 'setup' | 'active' | 'finished';
export type QuizMode = 'total' | 'per-question';

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  mode: QuizMode;
  details: {
    question: string;
    userAnswers: string[];
    correctAnswers: string[];
    isCorrect: boolean;
  }[];
}
