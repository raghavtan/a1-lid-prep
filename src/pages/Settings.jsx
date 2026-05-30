// src/pages/Settings.jsx
import { useRef, useState } from 'react';
import { Download, Upload, CalendarDays, Trash2 } from 'lucide-react';
import { useProgress } from '../hooks/useProgress.jsx';

export default function Settings() {
    const { state, setExamDate, importData, resetAll } = useProgress();
    const fileRef = useRef(null);
    const [msg, setMsg] = useState('');

    const exportProgress = () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `a1-lid-progress-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const onImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                importData(JSON.parse(reader.result));
                setMsg('✓ Progress imported.');
            } catch {
                setMsg('✗ Invalid file.');
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium"><CalendarDays size={16} /> Exam date</label>
                <input type="date" value={state.examDate} onChange={(e) => setExamDate(e.target.value)}
                       className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100" />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <h2 className="font-semibold">Sync across devices</h2>
                <p className="text-sm text-slate-400">No account needed. Export your progress as JSON, then import it on your phone (or anywhere) to sync.</p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={exportProgress} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={() => fileRef.current?.click()} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 font-semibold hover:bg-slate-800">
                        <Upload size={16} /> Import
                    </button>
                    <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
                </div>
                {msg && <p className="text-sm text-slate-300">{msg}</p>}
            </div>

            <button onClick={() => { if (confirm('Erase all progress?')) { resetAll(); setMsg('Progress reset.'); } }}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <Trash2 size={16} /> Reset all progress
            </button>
        </div>
    );
}