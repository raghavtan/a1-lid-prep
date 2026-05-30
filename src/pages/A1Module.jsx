// src/pages/A1Module.jsx
import { Link, useParams, Navigate } from 'react-router-dom';
import {
    ChevronLeft, CheckCircle2, Circle, ClipboardCheck,
    BookText, SpellCheck, BookOpen, Headphones, MessagesSquare, PenLine, Mic,
} from 'lucide-react';
import { findModule } from '../data/a1Course.js';
import { useProgress } from '../hooks/useProgress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

const KIND = {
    vocab: { icon: BookText, label: 'Vocabulary' },
    grammar: { icon: SpellCheck, label: 'Grammar' },
    reading: { icon: BookOpen, label: 'Reading' },
    listening: { icon: Headphones, label: 'Listening' },
    dialog: { icon: MessagesSquare, label: 'Dialogue' },
    writing: { icon: PenLine, label: 'Writing' },
    speaking: { icon: Mic, label: 'Speaking' },
};

export default function A1Module() {
    const { moduleId } = useParams();
    const module = findModule(moduleId);
    const { moduleProgress } = useProgress();

    if (!module) return <Navigate to="/a1" replace />;

    const p = moduleProgress(moduleId);
    const pct = p.lessonsTotal ? Math.round((p.lessonsDone / p.lessonsTotal) * 100) : 0;

    return (
        <div className="space-y-5">
            <Link to="/a1" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
                <ChevronLeft size={16} /> Course
            </Link>

            <header>
                <div className="text-xs font-mono text-slate-500">Module {module.order}</div>
                <h1 className="text-2xl font-bold tracking-tight">{module.title}</h1>
                <p className="text-slate-400 text-sm">{module.titleEn}</p>
                <p className="mt-2 text-sm text-slate-300">{module.canDo}</p>
            </header>

            <ProgressBar label="Lessons done" value={pct} accent={p.completed ? 'bg-emerald-500' : 'bg-indigo-500'} />

            <div className="space-y-2">
                {module.lessons.map((l, i) => {
                    const done = p.lessonsDoneIds.includes(l.id);
                    const meta = KIND[l.kind] ?? KIND.vocab;
                    const Icon = meta.icon;
                    return (
                        <Link key={l.id} to={`/a1/lesson/${moduleId}/${l.id}`}
                              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 hover:border-indigo-500/50 transition">
                            {done
                                ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                                : <Circle size={20} className="text-slate-600 shrink-0" />}
                            <div className="min-w-0 flex-1">
                                <div className="font-medium truncate">{i + 1}. {l.title}</div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                    <Icon size={12} /> {meta.label}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Module test */}
            <Link to={`/a1/module/${moduleId}/test`}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-indigo-500/50 transition">
                <div className="flex items-center gap-3">
                    <ClipboardCheck size={22} className="text-indigo-400" />
                    <div>
                        <div className="font-semibold">Module test</div>
                        <div className="text-xs text-slate-400">
                            {module.test.length} questions · pass at 60%
                            {p.testBest > 0 && ` · best ${Math.round(p.testBest * 100)}%`}
                        </div>
                    </div>
                </div>
                {p.testBest >= 0.6 && <CheckCircle2 size={18} className="text-emerald-400" />}
            </Link>
        </div>
    );
}
