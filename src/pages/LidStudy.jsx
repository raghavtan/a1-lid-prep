// src/pages/LidStudy.jsx
import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { lidQuestions } from '../data/lidQuestions.js';
import { useProgress } from '../hooks/useProgress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function LidStudy() {
    const { state, markStudied, totals } = useProgress();
    const [i, setI] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const q = lidQuestions[i];

    const go = (delta) => {
        setRevealed(false);
        setI((p) => (p + delta + lidQuestions.length) % lidQuestions.length);
    };
    const reveal = () => { setRevealed(true); markStudied(q.id); };

    return (
        <div className="space-y-5">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">LiD Study</h1>
                <span className="text-xs text-slate-400">{i + 1} / {lidQuestions.length}</span>
            </header>

            <ProgressBar label="Coverage" value={Math.round((state.lid.studied.length / totals.lid) * 100)} accent="bg-sky-500" />

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 min-h-[260px]">
                <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wide rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
            {q.category === 'berlin' ? 'Berlin' : 'General'}
          </span>
                    {state.lid.studied.includes(q.id) && <Check size={16} className="text-emerald-400" />}
                </div>
                <p className="font-semibold text-lg leading-snug">{q.question}</p>
                <ul className="mt-4 space-y-2">
                    {q.options.map((opt, idx) => {
                        const correct = revealed && idx === q.answer;
                        return (
                            <li key={idx}
                                className={`rounded-xl border px-3 py-2.5 text-sm transition
                  ${correct ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                                    : 'border-slate-800 text-slate-300'}`}>
                                {opt}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={() => go(-1)} className="rounded-xl border border-slate-800 p-3 hover:bg-slate-800"><ChevronLeft size={18} /></button>
                {!revealed
                    ? <button onClick={reveal} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500"><Eye size={18} /> Show answer</button>
                    : <button onClick={() => go(1)} className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold hover:bg-emerald-500">Next question</button>}
                <button onClick={() => go(1)} className="rounded-xl border border-slate-800 p-3 hover:bg-slate-800"><ChevronRight size={18} /></button>
            </div>
        </div>
    );
}