import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, BookOpen, Play, Info, LayoutGrid, Timer } from 'lucide-react';
import { QuizMode } from '../types';

interface SetupProps {
  onStart: (time: number, mode: QuizMode, count: number) => void;
}

export default function Setup({ onStart }: SetupProps) {
  const [time, setTime] = useState(60);
  const [count, setCount] = useState(50);
  const [mode, setMode] = useState<QuizMode>('total');

  // Rate: 90 mins per 100 questions -> 0.9 mins per question
  const questionCount = mode === 'total' ? Math.floor(time / 0.9) : count;
  
  const displayTime = mode === 'total' ? time : Math.ceil((questionCount * 54) / 60);

  return (
    <div className="min-h-full w-full flex items-center justify-center px-4 py-4 md:py-6">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 md:p-10 text-center">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">
          CDMP Master
        </h1>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {/* Mode Selection */}
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setMode('total')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'total' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid size={16} />
              Total Time
            </button>
            <button
              onClick={() => setMode('per-question')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'per-question' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Timer size={16} />
              Per Question (54s)
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs md:text-sm">
                {mode === 'total' ? (
                  <>
                    <Clock size={16} className="text-indigo-500" />
                    Exam Duration
                  </>
                ) : (
                  <>
                    <BookOpen size={16} className="text-indigo-500" />
                    Number of Questions
                  </>
                )}
              </div>
              <span className="text-lg md:text-xl font-black text-indigo-600 font-mono">
                {mode === 'total' ? time : count} 
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase ml-1">
                  {mode === 'total' ? 'min' : 'questions'}
                </span>
              </span>
            </div>

            <input
              type="range"
              min={mode === 'total' ? "10" : "5"}
              max={mode === 'total' ? "90" : "100"}
              step="1"
              value={mode === 'total' ? time : count}
              onChange={(e) => mode === 'total' ? setTime(parseInt(e.target.value)) : setCount(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            
            <div className="flex justify-between mt-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {mode === 'total' ? (
                <>
                  <span>10m</span>
                  <span>50m</span>
                  <span>90m</span>
                </>
              ) : (
                <>
                  <span>5 Qs</span>
                  <span>50 Qs</span>
                  <span>100 Qs</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="bg-indigo-50/50 rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-indigo-100 text-left">
              <p className="text-[8px] md:text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Total Questions</p>
              <p className="text-lg md:text-xl font-black text-indigo-900">{questionCount}</p>
            </div>
            <div className="bg-emerald-50/50 rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-emerald-100 text-left">
              <p className="text-[8px] md:text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Total Time</p>
              <p className="text-lg md:text-xl font-black text-emerald-900">{displayTime} <span className="text-xs">min</span></p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onStart(displayTime, mode, questionCount)}
          className="w-full py-3.5 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
        >
          Start Examination
          <Play size={18} fill="currentColor" />
        </button>

        <div className="mt-4 md:mt-6 flex items-center justify-center gap-2 text-slate-400 text-[10px] md:text-xs font-medium px-2">
          <Info size={12} />
          <span>Questions are selected randomly from our database</span>
        </div>
      </div>
    </div>
  );
}
