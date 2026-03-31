import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Clock, Target, Percent, CheckCircle2, XCircle } from 'lucide-react';
import { QuizResult } from '../types';

interface ResultsProps {
  result: QuizResult;
  onRestart: () => void;
}

export default function Results({ result, onRestart }: ResultsProps) {
  const isPassed = result.percentage >= 70;

  return (
    <div className="min-h-full w-full flex items-center justify-center px-4 py-4 md:py-6">
      <div className="max-w-6xl w-full bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col relative">
        {/* Background Decoration */}
        <div className={`absolute top-0 left-0 w-full h-1.5 md:h-2 shrink-0 ${isPassed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        
        <div className="flex flex-col md:flex-row">
          {/* Left Side: Summary Stats */}
          <div className="w-full md:w-1/3 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center text-center shrink-0">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4 ${
              isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <Trophy size={24} className="md:w-8 md:h-8" />
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-1 tracking-tight">
              Exam Completed!
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mb-4 md:mb-6">
              {isPassed ? "Outstanding performance!" : "Good effort! Keep practicing."}
            </p>

            <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-3 w-full mb-4 md:mb-6">
              <div className="bg-slate-50 rounded-xl p-2 md:p-3 border border-slate-100 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Target size={14} className="text-indigo-500" />
                  <span className="hidden md:inline text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                </div>
                <p className="text-sm md:text-lg font-black text-slate-800">{result.score}/{result.total}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2 md:p-3 border border-slate-100 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Percent size={14} className="text-indigo-500" />
                  <span className="hidden md:inline text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade</span>
                </div>
                <p className="text-sm md:text-lg font-black text-slate-800">{result.percentage}%</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2 md:p-3 border border-slate-100 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Clock size={14} className="text-indigo-500" />
                  <span className="hidden md:inline text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</span>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-lg font-black text-slate-800">
                    {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                  </p>
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">
                    {result.mode === 'total' ? 'Total Time Mode' : 'Per Question Mode'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onRestart}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 bg-slate-900 text-white rounded-xl font-bold text-sm md:text-base shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>

          {/* Right Side: Detailed Review */}
          <div className="flex-1 flex flex-col bg-slate-50/50">
            <div className="p-4 md:p-6 border-b border-slate-100 bg-white shrink-0">
              <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                Review Answers
                <span className="text-[10px] md:text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {result.total} Questions
                </span>
              </h2>
            </div>

            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              {result.details.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 md:p-4 rounded-xl md:rounded-2xl border bg-white transition-all ${
                    item.isCorrect ? 'border-emerald-100' : 'border-red-100'
                  }`}
                >
                  <div className="flex gap-2 md:gap-3">
                    <div className="shrink-0 mt-0.5">
                      {item.isCorrect ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-bold text-slate-800 mb-2 leading-snug">
                        {idx + 1}. {item.question}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        <div className={`p-2 rounded-lg text-[10px] md:text-xs ${
                          item.isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          <p className="font-bold uppercase tracking-tighter opacity-60 mb-0.5">Your Answer</p>
                          <p className="font-medium break-words whitespace-normal">{item.userAnswer}</p>
                        </div>
                        
                        {!item.isCorrect && (
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] md:text-xs">
                            <p className="font-bold uppercase tracking-tighter opacity-60 mb-0.5">Correct Answer</p>
                            <p className="font-medium break-words whitespace-normal">{item.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
