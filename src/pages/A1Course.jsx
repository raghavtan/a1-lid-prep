// src/pages/A1Course.jsx
import { Link } from 'react-router-dom';
import { GraduationCap, Repeat, CheckCircle2, ArrowRight, Dumbbell } from 'lucide-react';
import { a1Modules } from '../data/a1Course.js';
import { useProgress } from '../hooks/useProgress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function A1Course() {
    const { a1Readiness, courseStats, moduleProgress } = useProgress();

    // Resume: first module that isn't complete.
    const resume = a1Modules.find((m) => !moduleProgress(m.id).completed);

    return (
        <div className="space-y-6">
            <header className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <GraduationCap size={24} className="text-indigo-400" /> A1 German Course
                    </h1>
                    <p className="text-slate-400 text-sm">From zero to exam-ready — lessons, tests & spaced review.</p>
                </div>
                <Link to="/a1/practice" className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:border-indigo-500/50">
                    <Dumbbell size={14} /> Free practice
                </Link>
            </header>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <ProgressBar label="A1 Readiness" value={a1Readiness} accent="bg-emerald-500" />
                <div className="text-xs text-slate-400">
                    {courseStats.modulesCompleted}/{courseStats.modulesTotal} modules complete ·{' '}
                    {courseStats.reviewMastered}/{courseStats.reviewTotal} words mastered
                </div>
            </div>

            {/* Daily review CTA */}
            <Link to="/a1/review"
                  className={`flex items-center justify-between rounded-2xl p-5 transition
                    ${courseStats.dueCount > 0
                      ? 'bg-gradient-to-br from-amber-500/90 to-orange-600/90 hover:from-amber-500 hover:to-orange-600'
                      : 'border border-slate-800 bg-slate-900/50 hover:border-indigo-500/50'}`}>
                <div className="flex items-center gap-3">
                    <Repeat size={22} className={courseStats.dueCount > 0 ? 'text-white' : 'text-indigo-400'} />
                    <div>
                        <div className={`font-semibold ${courseStats.dueCount > 0 ? 'text-white' : ''}`}>Daily Review</div>
                        <div className={`text-xs ${courseStats.dueCount > 0 ? 'text-amber-50' : 'text-slate-400'}`}>
                            {courseStats.dueCount > 0
                                ? `${courseStats.dueCount} word${courseStats.dueCount === 1 ? '' : 's'} due now`
                                : 'Nothing due — come back tomorrow'}
                        </div>
                    </div>
                </div>
                <ArrowRight size={18} className={courseStats.dueCount > 0 ? 'text-white' : 'text-slate-500'} />
            </Link>

            {resume && (
                <Link to={`/a1/module/${resume.id}`}
                      className="block rounded-xl border border-indigo-600/60 bg-indigo-500/10 px-4 py-3 text-sm hover:bg-indigo-500/15">
                    <span className="text-indigo-300 font-medium">Continue →</span>{' '}
                    <span className="text-slate-300">Module {resume.order}: {resume.title}</span>
                </Link>
            )}

            {/* Module list */}
            <div className="space-y-3">
                {a1Modules.map((m) => {
                    const p = moduleProgress(m.id);
                    const pct = p.lessonsTotal ? Math.round((p.lessonsDone / p.lessonsTotal) * 100) : 0;
                    return (
                        <Link key={m.id} to={`/a1/module/${m.id}`}
                              className="block rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-indigo-500/50 transition">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-slate-500">M{m.order}</span>
                                        <h3 className="font-semibold truncate">{m.title}</h3>
                                        {p.completed && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">{m.titleEn}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-xs text-slate-400">{p.lessonsDone}/{p.lessonsTotal} lessons</div>
                                    {p.testBest > 0 && (
                                        <div className="text-[11px] text-slate-500">test {Math.round(p.testBest * 100)}%</div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3"><ProgressBar value={pct} accent={p.completed ? 'bg-emerald-500' : 'bg-indigo-500'} /></div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
