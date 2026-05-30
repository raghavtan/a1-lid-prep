// src/components/ProgressBar.jsx
export default function ProgressBar({ value, label, accent = 'bg-indigo-500' }) {
    const v = Math.max(0, Math.min(100, value));
    return (
        <div>
            {label && (
                <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-semibold text-slate-100">{v}%</span>
                </div>
            )}
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${accent}`} style={{ width: `${v}%` }} />
            </div>
        </div>
    );
}