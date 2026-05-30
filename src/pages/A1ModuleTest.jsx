// src/pages/A1ModuleTest.jsx
import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronLeft, Volume2, RotateCw } from 'lucide-react';
import { findModule } from '../data/a1Course.js';
import { useProgress } from '../hooks/useProgress.jsx';
import { speak } from '../lib/speech.js';

const arrEq = (a, b) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);

function isCorrect(item, ans) {
    return item.type === 'order' ? arrEq(ans, item.answer) : ans === item.answer;
}
function isAnswered(item, ans) {
    return item.type === 'order' ? Array.isArray(ans) && ans.length === item.tiles.length : ans != null;
}

export default function A1ModuleTest() {
    const { moduleId } = useParams();
    const module = findModule(moduleId);
    const { recordModuleTest } = useProgress();
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    if (!module) return <Navigate to="/a1" replace />;

    const test = module.test;
    const setAnswer = (i, v) => setAnswers((a) => ({ ...a, [i]: v }));
    const allAnswered = test.every((item, i) => isAnswered(item, answers[i]));
    const score = test.reduce((n, item, i) => n + (isCorrect(item, answers[i]) ? 1 : 0), 0);
    const pct = Math.round((score / test.length) * 100);

    const submit = () => {
        setSubmitted(true);
        recordModuleTest(moduleId, { score, total: test.length });
    };
    const retake = () => { setAnswers({}); setSubmitted(false); };

    return (
        <div className="space-y-5">
            <Link to={`/a1/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
                <ChevronLeft size={16} /> {module.title}
            </Link>

            <header>
                <h1 className="text-xl font-bold tracking-tight">Module test</h1>
                <p className="text-slate-400 text-sm">{module.titleEn} · {test.length} questions</p>
            </header>

            {submitted && (
                <div className={`rounded-2xl border p-6 text-center ${pct >= 60 ? 'border-emerald-600 bg-emerald-500/10' : 'border-amber-600 bg-amber-500/10'}`}>
                    <div className="text-sm text-slate-300">{pct >= 60 ? 'Passed 🎉' : 'Keep going'}</div>
                    <div className="text-5xl font-black mt-1">{pct}%</div>
                    <div className="text-slate-300 mt-1">{score} / {test.length} correct</div>
                </div>
            )}

            <div className="space-y-4">
                {test.map((item, i) => (
                    <TestItem key={i} item={item} index={i} value={answers[i]}
                              onChange={(v) => setAnswer(i, v)} submitted={submitted} />
                ))}
            </div>

            {submitted ? (
                <div className="flex gap-3">
                    <button onClick={retake} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-800 py-3 font-semibold text-slate-300 hover:border-slate-600">
                        <RotateCw size={16} /> Retake
                    </button>
                    <Link to={`/a1/module/${moduleId}`} className="flex-1 rounded-xl bg-indigo-600 py-3 text-center font-semibold hover:bg-indigo-500">Back to module</Link>
                </div>
            ) : (
                <button onClick={submit} disabled={!allAnswered}
                        className="w-full rounded-xl bg-emerald-600 py-3 font-semibold hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed">
                    {allAnswered ? 'Submit test' : 'Answer all questions to submit'}
                </button>
            )}
        </div>
    );
}

function TestItem({ item, index, value, onChange, submitted }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
            <div className="text-xs text-slate-500">Question {index + 1}</div>

            {item.type === 'mcq' && <p className="font-medium">{item.q}</p>}

            {item.type === 'cloze' && (
                <p className="font-medium">
                    {item.text} {item.en && <span className="text-xs font-normal text-slate-400">{item.en}</span>}
                </p>
            )}

            {item.type === 'listen' && (
                <div className="space-y-2">
                    <button onClick={() => speak(item.say)} disabled={submitted}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
                        <Volume2 size={16} /> Play audio
                    </button>
                    <p className="font-medium">{item.q}</p>
                    {submitted && <p className="text-xs italic text-slate-500">heard: „{item.say}"</p>}
                </div>
            )}

            {item.type === 'order'
                ? <OrderInput item={item} value={value} onChange={onChange} submitted={submitted} />
                : <Options item={item} value={value} onChange={onChange} submitted={submitted} />}
        </div>
    );
}

function Options({ item, value, onChange, submitted }) {
    return (
        <div className="space-y-2">
            {item.options.map((opt, idx) => {
                let cls = 'border-slate-800 text-slate-300 hover:border-slate-600';
                if (submitted) {
                    if (idx === item.answer) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
                    else if (idx === value) cls = 'border-red-500 bg-red-500/15 text-red-300';
                    else cls = 'border-slate-800 text-slate-500';
                } else if (idx === value) {
                    cls = 'border-indigo-500 bg-indigo-500/15 text-indigo-200';
                }
                return (
                    <button key={idx} disabled={submitted} onClick={() => onChange(idx)}
                            className={`block w-full text-left rounded-xl border px-3 py-2.5 text-sm transition ${cls}`}>
                        {opt}
                    </button>
                );
            })}
        </div>
    );
}

function OrderInput({ item, value, onChange, submitted }) {
    const chosen = value ?? [];
    const remaining = item.tiles.map((_, i) => i).filter((i) => !chosen.includes(i));
    const correct = arrEq(chosen, item.answer);

    const pick = (i) => { if (!submitted) onChange([...chosen, i]); };
    const reset = () => { if (!submitted) onChange([]); };

    return (
        <div className="space-y-3">
            <p className="text-xs text-slate-400">Tap the words in the correct order. {item.en && <span className="italic">({item.en})</span>}</p>
            <div className={`min-h-[44px] rounded-xl border px-3 py-2 flex flex-wrap gap-2 items-center
                ${submitted ? (correct ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10') : 'border-slate-700 bg-slate-950/40'}`}>
                {chosen.length === 0 && <span className="text-sm text-slate-600">…</span>}
                {chosen.map((tileIdx, pos) => (
                    <span key={pos} className="rounded-lg bg-slate-800 px-2.5 py-1 text-sm">{item.tiles[tileIdx]}</span>
                ))}
            </div>
            {!submitted && (
                <div className="flex flex-wrap gap-2">
                    {remaining.map((i) => (
                        <button key={i} onClick={() => pick(i)}
                                className="rounded-lg border border-slate-700 px-2.5 py-1 text-sm text-slate-200 hover:border-indigo-500/60">
                            {item.tiles[i]}
                        </button>
                    ))}
                    {chosen.length > 0 && (
                        <button onClick={reset} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-slate-300">reset</button>
                    )}
                </div>
            )}
            {submitted && !correct && (
                <p className="text-xs text-slate-400">Correct: {item.answer.map((i) => item.tiles[i]).join(' ')}</p>
            )}
        </div>
    );
}
