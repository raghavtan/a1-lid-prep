// src/pages/Analytics.jsx
import { useProgress } from '../hooks/useProgress.jsx';

export default function Analytics() {
    const { state, courseStats } = useProgress();
    const mock = state.lid.mockHistory.map((r) => ({ ...r, pct: Math.round((r.score / r.total) * 100), kind: 'LiD' }));
    const quiz = state.a1.quizHistory.map((r) => ({ ...r, pct: Math.round((r.score / r.total) * 100), kind: 'A1' }));
    const all = [...mock, ...quiz].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>

            <div className="grid grid-cols-3 gap-3 text-center">
                <Mini label="Modules done" value={`${courseStats.modulesCompleted}/${courseStats.modulesTotal}`} />
                <Mini label="Words mastered" value={`${courseStats.reviewMastered}/${courseStats.reviewTotal}`} />
                <Mini label="Due to review" value={courseStats.dueCount} />
            </div>

            <Section title="LiD mock scores" data={mock} accent="#0ea5e9" />
            <Section title="A1 quiz scores" data={quiz} accent="#10b981" />

            <div>
                <h2 className="font-semibold mb-2">History</h2>
                {all.length === 0
                    ? <p className="text-sm text-slate-500">No attempts yet — take a mock test or quiz to start tracking.</p>
                    : <div className="space-y-2">
                        {all.slice().reverse().map((r, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${r.kind === 'LiD' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{r.kind}</span>
                      {new Date(r.date).toLocaleDateString()}
                  </span>
                                <span className="font-semibold">{r.score}/{r.total} · {r.pct}%</span>
                            </div>
                        ))}
                    </div>}
            </div>
        </div>
    );
}

function Mini({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="text-lg font-bold">{value}</div>
            <div className="text-[11px] text-slate-400">{label}</div>
        </div>
    );
}

// Dependency-free bar chart (pure SVG) so nothing extra is needed on GH Pages.
function Section({ title, data, accent }) {
    const max = 100, w = 300, h = 120, pad = 8;
    const barW = data.length ? (w - pad * 2) / data.length - 6 : 0;
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="font-semibold mb-3">{title}</h2>
            {data.length === 0
                ? <p className="text-sm text-slate-500">No data yet.</p>
                : <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
                    {[25, 50, 75, 100].map((g) => (
                        <line key={g} x1={pad} x2={w - pad} y1={h - (g / max) * (h - 20)} y2={h - (g / max) * (h - 20)} stroke="#1e293b" strokeWidth="1" />
                    ))}
                    {data.map((d, i) => {
                        const bh = (d.pct / max) * (h - 20);
                        const x = pad + i * (barW + 6);
                        return (
                            <g key={i}>
                                <rect x={x} y={h - bh} width={barW} height={bh} rx="3" fill={accent} />
                                <text x={x + barW / 2} y={h - bh - 4} fontSize="9" fill="#cbd5e1" textAnchor="middle">{d.pct}</text>
                            </g>
                        );
                    })}
                </svg>}
        </div>
    );
}