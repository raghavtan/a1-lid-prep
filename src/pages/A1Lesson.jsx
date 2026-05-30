// src/pages/A1Lesson.jsx
import { useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { ChevronLeft, Check, Lightbulb, ArrowRight, Play } from 'lucide-react';
import { findModule, findLesson } from '../data/a1Course.js';
import { useProgress } from '../hooks/useProgress.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import { speak } from '../lib/speech.js';

export default function A1Lesson() {
    const { moduleId, lessonId } = useParams();
    const navigate = useNavigate();
    const module = findModule(moduleId);
    const lesson = findLesson(moduleId, lessonId);
    const { completeLesson, moduleProgress } = useProgress();

    if (!module || !lesson) return <Navigate to="/a1" replace />;

    const idx = module.lessons.findIndex((l) => l.id === lessonId);
    const nextLesson = module.lessons[idx + 1];
    const done = moduleProgress(moduleId).lessonsDoneIds.includes(lessonId);

    const finish = () => {
        completeLesson(moduleId, lessonId);
        navigate(nextLesson ? `/a1/lesson/${moduleId}/${nextLesson.id}` : `/a1/module/${moduleId}`);
    };

    return (
        <div className="space-y-5">
            <Link to={`/a1/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
                <ChevronLeft size={16} /> {module.title}
            </Link>

            <header>
                <div className="text-xs text-slate-500">Lesson {idx + 1} of {module.lessons.length}</div>
                <h1 className="text-xl font-bold tracking-tight">{lesson.title}</h1>
            </header>

            <div className="space-y-4">
                {lesson.blocks.map((b, i) => <Block key={i} block={b} />)}
            </div>

            <div className="flex gap-3 pt-2">
                {nextLesson && (
                    <Link to={`/a1/lesson/${moduleId}/${nextLesson.id}`}
                          className="rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300 hover:border-slate-600">
                        Skip
                    </Link>
                )}
                <button onClick={finish}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition
                          ${done ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                    {done ? <><Check size={16} /> Done</> : 'Mark done'}
                    {nextLesson && <ArrowRight size={16} />}
                </button>
            </div>
        </div>
    );
}

function Block({ block }) {
    switch (block.kind) {
        case 'prose':
            return <p className="text-sm leading-relaxed text-slate-300">{block.text}</p>;

        case 'vocab':
            return (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 divide-y divide-slate-800/70">
                    {block.items.map((it, i) => (
                        <div key={i} className="px-4 py-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold">{it.de}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-sm text-slate-400">{it.en}</span>
                                    <SpeakButton text={it.de} />
                                </div>
                            </div>
                            {it.ex && <p className="mt-1 text-xs italic text-slate-500">{it.ex}</p>}
                        </div>
                    ))}
                </div>
            );

        case 'table':
            return (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                    {block.caption && <div className="px-4 py-2 text-xs font-medium text-slate-400 border-b border-slate-800">{block.caption}</div>}
                    <table className="w-full text-sm">
                        {block.headers && (
                            <thead>
                                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                                    {block.headers.map((h, i) => <th key={i} className="px-4 py-2 font-medium">{h}</th>)}
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-slate-800/70">
                            {block.rows.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j} className={`px-4 py-2 ${j === 0 ? 'text-slate-400' : 'font-medium'}`}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case 'examples':
            return (
                <div className="space-y-2">
                    {block.items.map((it, i) => (
                        <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">{it.de}</span>
                                <SpeakButton text={it.de} />
                            </div>
                            <p className="text-xs text-slate-400">{it.en}</p>
                        </div>
                    ))}
                </div>
            );

        case 'dialog':
            return (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">{block.title ?? 'Dialogue'}</span>
                        <button onClick={() => speak(block.lines.map((l) => l.de).join('. '))}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/15">
                            <Play size={13} /> Play all
                        </button>
                    </div>
                    {block.lines.map((l, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between gap-2">
                                <span><span className="text-indigo-400 font-medium">{l.who}:</span> {l.de}</span>
                                <SpeakButton text={l.de} />
                            </div>
                            <p className="pl-1 text-xs text-slate-500">{l.en}</p>
                        </div>
                    ))}
                </div>
            );

        case 'tip':
            return (
                <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <Lightbulb size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-100/90">{block.text}</p>
                </div>
            );

        case 'model':
            return <ModelBlock block={block} />;

        default:
            return null;
    }
}

function ModelBlock({ block }) {
    const [show, setShow] = useState(false);
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
            <p className="text-sm text-slate-300">{block.prompt}</p>
            {show ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-300">Model answer</span>
                        <SpeakButton text={block.answer} label="Listen" />
                    </div>
                    <p className="mt-1 text-sm">{block.answer}</p>
                </div>
            ) : (
                <button onClick={() => setShow(true)}
                        className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-indigo-500/50">
                    Show model answer
                </button>
            )}
        </div>
    );
}
