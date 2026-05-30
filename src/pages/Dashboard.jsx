// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';
import { CalendarClock, BookOpen, ClipboardCheck, GraduationCap, Flame } from 'lucide-react';
import { useProgress } from '../hooks/useProgress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function Dashboard() {
    const { daysLeft, lidReadiness, a1Readiness, state, totals, courseStats } = useProgress();
    const bestMock = state.lid.mockHistory.reduce((m, r) => Math.max(m, r.score), 0);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">30-Day Dashboard</h1>
                <p className="text-slate-400 text-sm">Your countdown to A1 + Leben in Deutschland.</p>
            </header>

            {/* Countdown */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-lg">
                <div className="flex items-center gap-2 text-indigo-100 text-sm">
                    <CalendarClock size={16} /> Exam in
                </div>
                <div className="mt-1 flex items-end gap-2">
                    <span className="text-6xl font-black leading-none">{daysLeft}</span>
                    <span className="text-xl font-semibold text-indigo-100 mb-1">days</span>
                </div>
                <p className="text-indigo-200 text-xs mt-2">Exam date: {state.examDate} · change it in Settings.</p>
            </div>

            {/* Readiness */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><Flame size={18} className="text-orange-400" /> Readiness</h2>
                <ProgressBar label="A1 German" value={a1Readiness} accent="bg-emerald-500" />
                <ProgressBar label="Leben in Deutschland" value={lidReadiness} accent="bg-sky-500" />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
                <Stat label="LiD studied" value={`${state.lid.studied.length}/${totals.lid}`} />
                <Stat label="A1 modules" value={`${courseStats.modulesCompleted}/${courseStats.modulesTotal}`} />
                <Stat label="Best mock" value={`${bestMock}/33`} />
            </div>

            {/* Shortcuts */}
            <div className="grid grid-cols-2 gap-3">
                <Tile to="/lid/study" icon={BookOpen} title="Study LiD" sub="Review questions" />
                <Tile to="/lid/mock" icon={ClipboardCheck} title="Mock Test" sub="33 questions · timed" />
                <Tile to="/a1" icon={GraduationCap} title="A1 Course" sub="Modules · review · tests" />
                <Tile to="/analytics" icon={Flame} title="Analytics" sub="Track progress" />
            </div>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="text-lg font-bold">{value}</div>
            <div className="text-[11px] text-slate-400">{label}</div>
        </div>
    );
}

function Tile({ to, icon: Icon, title, sub }) {
    return (
        <Link to={to} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-indigo-500/50 transition">
            <Icon className="text-indigo-400 mb-2" size={22} />
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-slate-400">{sub}</div>
        </Link>
    );
}