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
    <div className="min-h-full w-full flex items-center justify-center px-4 py-4 md:py-8">
      <div className="max-w-6xl w-full bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col relative overflow-hidden">
        {/* Background Decoration */}
        <div className={`absolute top-0 left-0 w-full h-1.5 md:h-2 shrink-0 ${isPassed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        
        {/* Top Summary Section */}
        <div className="p-6 md:p-10 border-b border-slate-100 bg-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Badge & Title */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center rotate-3 ${
                isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <Trophy size={32} className="md:w-10 md:h-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-1 tracking-tight">
                  Exam Completed!
                </h1>
                <p className="text-slate-500 text-sm md:text-base font-medium">
                  {isPassed ? "Outstanding performance! You've mastered the material." : "Good effort! Keep practicing to improve your score."}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                </div>
                <p className="text-xl md:text-2xl font-black text-slate-800">{result.score}/{result.total}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                  <Percent size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade</span>
                </div>
                <p className="text-xl md:text-2xl font-black text-slate-800">{result.percentage}%</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</span>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-black text-slate-800">
                    {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onRestart}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            >
              <RotateCcw size={20} />
              Try Again
            </button>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-3">
              Review Answers
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {result.total} Questions
              </span>
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-4 md:space-y-6">
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
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="text-xs md:text-sm font-bold text-slate-800 leading-snug">
                        {idx + 1}. {item.question}
                      </p>
                      {item.correctAnswers.length > 1 && (
                        <span className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] md:text-[10px] font-bold rounded-md uppercase tracking-tighter">
                          Multiple Choice
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                      <div className={`p-2.5 rounded-lg text-[10px] md:text-xs ${
                        item.isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <p className="font-bold uppercase tracking-tighter opacity-60 mb-1.5">Your Answer</p>
                        <div className="space-y-1">
                          {item.userAnswers.length > 0 ? (
                            item.userAnswers.map((ans, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                                <span className="font-medium break-words leading-tight">{ans}</span>
                              </div>
                            ))
                          ) : (
                            <p className="font-medium italic opacity-50">No answer</p>
                          )}
                        </div>
                      </div>
                      
                      {!item.isCorrect && (
                        <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] md:text-xs">
                          <p className="font-bold uppercase tracking-tighter opacity-60 mb-1.5">Correct Answer</p>
                          <div className="space-y-1">
                            {item.correctAnswers.map((ans, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                                <span className="font-medium break-words leading-tight">{ans}</span>
                              </div>
                            ))}
                          </div>
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
  );
}
