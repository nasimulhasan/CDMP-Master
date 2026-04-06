import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { QuizQuestion, QuizResult, QuizMode } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  timeLimitMinutes: number;
  mode: QuizMode;
  onComplete: (result: QuizResult) => void;
}

export default function Quiz({ questions, timeLimitMinutes, mode, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(mode === 'total' ? timeLimitMinutes * 60 : 54);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [isWarning, setIsWarning] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when question changes in per-question mode
  useEffect(() => {
    if (mode === 'per-question') {
      setTimeLeft(54);
      setIsWarning(false);
    }
  }, [currentIdx, mode]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (mode === 'per-question') {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(prev => prev + 1);
        } else {
          handleSubmit();
        }
      } else {
        handleSubmit();
      }
      return;
    }

    if (mode === 'total' && timeLeft < 60) setIsWarning(true);
    if (mode === 'per-question' && timeLeft < 10) setIsWarning(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setTotalTimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, currentIdx, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (option: string) => {
    const currentAnswers = answers[currentIdx] || [];
    if (currentAnswers.includes(option)) {
      setAnswers({ ...answers, [currentIdx]: currentAnswers.filter(a => a !== option) });
    } else {
      setAnswers({ ...answers, [currentIdx]: [...currentAnswers, option] });
    }
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let score = 0;
    const details = questions.map((q, idx) => {
      const userAnswers = answers[idx] || [];
      const isCorrect = userAnswers.length === q.correctAnswers.length && 
                        userAnswers.every(a => q.correctAnswers.includes(a));
      if (isCorrect) score++;
      return {
        question: q.question,
        userAnswers,
        correctAnswers: q.correctAnswers,
        isCorrect
      };
    });

    onComplete({
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      timeTaken: mode === 'total' ? (timeLimitMinutes * 60 - timeLeft) : totalTimeSeconds,
      mode,
      details
    });
  };

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-full w-full max-w-6xl mx-auto px-4 py-4 md:py-6 flex flex-col">
      {/* Header / Timer - Sticky on mobile */}
      <div className="sticky top-0 z-20 bg-[#f8fafc]/80 backdrop-blur-md -mx-4 px-4 py-2 mb-4 md:mb-6 md:static md:bg-transparent md:backdrop-blur-none md:p-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm md:text-base">
              {currentIdx + 1}
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Question</p>
              <p className="text-xs md:text-sm font-bold text-slate-700">of {questions.length}</p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border transition-colors ${
            isWarning ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Timer size={16} className={isWarning ? 'animate-pulse' : ''} />
            <span className="font-mono font-bold text-base md:text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-5 md:p-10 flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0">
              <h2 className="text-lg md:text-2xl font-bold text-slate-800 leading-tight">
                {currentQuestion.question}
              </h2>
              {currentQuestion.correctAnswers.length > 1 && (
                <span className="shrink-0 ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">
                  Select all that apply
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 items-start">
              {currentQuestion.displayOptions.map((option, idx) => {
                const isSelected = (answers[currentIdx] || []).includes(option);
                return (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelect(option)}
                    className={`w-full text-left p-3.5 md:p-5 rounded-2xl border-2 transition-colors duration-200 flex items-start justify-between cursor-pointer group ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-md' 
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="flex-1 text-sm md:text-base font-medium leading-snug break-words pr-4 whitespace-normal min-w-0">
                      {option}
                    </span>
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 group-hover:border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-4 md:mt-6 flex items-center justify-between shrink-0">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0 || mode === 'per-question'}
          className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {currentIdx === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 md:gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base"
          >
            Submit Exam
            <Send size={16} />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            className="flex items-center gap-1.5 md:gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base"
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
