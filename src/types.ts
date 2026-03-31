export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  displayOptions: string[];
  correctAnswer: string;
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
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}
