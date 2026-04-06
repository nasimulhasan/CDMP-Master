/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Setup from './components/Setup';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { Question, QuizQuestion, QuizStatus, QuizResult, QuizMode } from './types';
import questionsData from './data/questions.json';

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [status, setStatus] = useState<QuizStatus>('setup');
  const [mode, setMode] = useState<QuizMode>('total');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [result, setResult] = useState<QuizResult | null>(null);

  const startQuiz = useCallback((selectedTime: number, selectedMode: QuizMode, selectedCount: number) => {
    setTimeLimit(selectedTime);
    setMode(selectedMode);
    
    // 1. Calculate number of questions
    const count = selectedCount;
    
    // 2. Randomize questions from pool
    const pool = shuffle(questionsData as Question[]);
    const selected = pool.slice(0, Math.min(count, pool.length));

    // 3. Process each question to have 4 options (1 correct + 3 random incorrect)
    const processed: QuizQuestion[] = selected.map(q => {
      const correctIndices = q.correctAnswerIndices || (q.correctAnswerIndex !== undefined ? [q.correctAnswerIndex] : []);
      const correctOptions = correctIndices.map(idx => q.options[idx]);
      const incorrectOptions = q.options.filter((_, idx) => !correctIndices.includes(idx));
      
      // Pick random incorrect options to fill up to 4 total options if possible
      // But if it's multiple choice, maybe we should just show all options?
      // The user said "some questions might have multiple correct answers".
      // Let's keep the "4 options" logic but ensure all correct ones are included.
      
      const neededIncorrect = Math.max(0, 4 - correctOptions.length);
      const randomIncorrect = shuffle(incorrectOptions).slice(0, neededIncorrect);
      
      // Combine and shuffle
      const displayOptions = shuffle([...correctOptions, ...randomIncorrect]);
      
      return {
        id: q.id,
        question: q.question,
        displayOptions,
        correctAnswers: correctOptions
      };
    });

    setQuizQuestions(processed);
    setStatus('active');
  }, []);

  const completeQuiz = useCallback((quizResult: QuizResult) => {
    setResult(quizResult);
    setStatus('finished');
  }, []);

  const restart = useCallback(() => {
    setStatus('setup');
    setResult(null);
    setQuizQuestions([]);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {status === 'setup' && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full w-full"
            >
              <Setup onStart={startQuiz} />
            </motion.div>
          )}
          
          {status === 'active' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full w-full"
            >
              <Quiz 
                questions={quizQuestions} 
                timeLimitMinutes={timeLimit} 
                mode={mode}
                onComplete={completeQuiz} 
              />
            </motion.div>
          )}

          {status === 'finished' && result && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full w-full"
            >
              <Results 
                result={result} 
                onRestart={restart} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
