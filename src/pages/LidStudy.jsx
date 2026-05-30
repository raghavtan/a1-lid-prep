// src/pages/LidStudy.jsx
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info } from 'lucide-react';
import { lidQuestions } from '../data/lidQuestions.js';
import { useProgress } from '../hooks/useProgress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

const FILTERS = [
    { key: 'all',    label: 'All' },
    { key: 'unseen', label: 'Unseen' },
    { key: 'weak',   label: 'Weak' },
    { key: 'berlin', label: 'Berlin' },
];

export default function LidStudy() {
    const { state, markStudied, markWrong, clearWrong, totals } = useProgress();
    const [filter, setFilter] = useState('all');
    const [i, setI] = useState(0);
    const [picked, setPicked] = useState(null); // index the user tapped, or null

    const pool = useMemo(() => {
        switch (filter) {
            case 'unseen': return lidQuestions.filter((q) => !state.lid.studied.includes(q.id));
            case 'weak':   return lidQuestions.filter((q) => state.lid.wrong.includes(q.id));
            case 'berlin': return lidQuestions.filter((q) => q.category === 'berlin');
            default:       return lidQuestions;
        }
    }, [filter, state.lid.studied, state.lid.wrong]);

    const idx = Math.min(i, Math.max(0, pool.length - 1));
    const q = pool[idx];

    const changeFilter = (f) => { setFilter(f); setI(0); setPicked(null); };
    const go = (delta) => {
        setPicked(null);
        setI((p) => (p + delta + pool.length) % pool.length);
    };

    const pick = (optIdx) => {
        if (picked !== null) return; // already answered
        setPicked(optIdx);
        markStudied(q.id);
        if (optIdx === q.answer) {
            clearWrong(q.id);
        } else {
            markWrong(q.id);
        }
    };

    const correct = picked !== null && picked === q.answer;

    if (pool.length === 0) {
        return (
            <div className="space-y-5">
                <h1 className="text-2xl font-bold tracking-tight">LiD Study</h1>
                <FilterTabs filter={filter} onChange={changeFilter} state={state} />
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
                    {filter === 'unseen' && 'All questions studied — try "Weak" or "All".'}
                    {filter === 'weak' && 'No weak questions — great work!'}
                    {filter === 'berlin' && 'No Berlin questions found.'}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">LiD Study</h1>
                <span className="text-xs text-slate-400">{idx + 1} / {pool.length}</span>
            </header>

            <ProgressBar label="Coverage" value={Math.round((state.lid.studied.length / totals.lid) * 100)} accent="bg-sky-500" />

            <FilterTabs filter={filter} onChange={changeFilter} state={state} />

            {/* Question card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wide rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                        {q.category === 'berlin' ? 'Berlin' : 'General'}
                    </span>
                    {state.lid.wrong.includes(q.id) && (
                        <span className="text-[11px] uppercase tracking-wide rounded-full bg-red-900/50 px-2 py-0.5 text-red-400">Weak</span>
                    )}
                </div>

                <p className="font-semibold text-lg leading-snug">{q.question}</p>

                <div className="space-y-2">
                    {q.options.map((opt, idx) => {
                        let cls = 'border-slate-800 text-slate-300 hover:border-slate-600';
                        if (picked !== null) {
                            if (idx === q.answer) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
                            else if (idx === picked) cls = 'border-red-500 bg-red-500/10 text-red-300';
                            else cls = 'border-slate-800 text-slate-500';
                        }
                        return (
                            <button key={idx} onClick={() => pick(idx)}
                                    className={`block w-full text-left rounded-xl border px-3 py-2.5 text-sm transition ${cls}`}>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Result banner */}
                {picked !== null && (
                    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${correct ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                        {correct
                            ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                            : <XCircle size={16} className="mt-0.5 shrink-0" />}
                        <span>{correct ? 'Correct!' : `Wrong — correct: ${q.options[q.answer]}`}</span>
                    </div>
                )}

                {/* Explanation */}
                {picked !== null && q.explanation && (
                    <div className="flex items-start gap-2 rounded-xl bg-slate-800/60 px-3 py-2.5 text-sm text-slate-300">
                        <Info size={15} className="mt-0.5 shrink-0 text-sky-400" />
                        <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
                <button onClick={() => go(-1)} className="rounded-xl border border-slate-800 p-3 hover:bg-slate-800">
                    <ChevronLeft size={18} />
                </button>
                <button onClick={() => go(1)} className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">
                    {picked === null ? 'Skip →' : 'Next →'}
                </button>
                <button onClick={() => go(1)} className="rounded-xl border border-slate-800 p-3 hover:bg-slate-800">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}

function FilterTabs({ filter, onChange, state }) {
    const weakCount = state.lid.wrong.length;
    const unseenCount = lidQuestions.filter((q) => !state.lid.studied.includes(q.id)).length;

    return (
        <div className="flex gap-2 flex-wrap">
            {FILTERS.map(({ key, label }) => {
                let badge = null;
                if (key === 'unseen') badge = unseenCount;
                if (key === 'weak') badge = weakCount;
                return (
                    <button key={key} onClick={() => onChange(key)}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition
                            ${filter === key ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {label}
                        {badge != null && badge > 0 && (
                            <span className="rounded-full bg-white/20 px-1.5">{badge}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
