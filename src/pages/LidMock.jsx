// src/pages/LidMock.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { Timer, Play, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { lidQuestions } from '../data/lidQuestions.js';
import { useProgress } from '../hooks/useProgress.jsx';

const EXAM_SIZE = 33;      // official size
const PASS_MARK = 17;      // official threshold
const EXAM_SECONDS = 60 * 60;

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Builds an exam. With the sample bank (<33 Q) it uses all available
// questions and scales the pass mark proportionally to 17/33.
function buildExam() {
    const pool = shuffle(lidQuestions);
    const size = Math.min(EXAM_SIZE, pool.length);
    const pass = size === EXAM_SIZE ? PASS_MARK : Math.ceil((size * PASS_MARK) / EXAM_SIZE);
    return { questions: pool.slice(0, size), size, pass };
}

export default function LidMock() {
    const { addMockResult } = useProgress();
    const [phase, setPhase] = useState('intro'); // intro | running | done
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [idx, setIdx] = useState(0);
    const [secs, setSecs] = useState(EXAM_SECONDS);
    const savedRef = useRef(false);

    const start = () => {
        setExam(buildExam()); setAnswers({}); setIdx(0);
        setSecs(EXAM_SECONDS); savedRef.current = false; setPhase('running');
    };

    // countdown
    useEffect(() => {
        if (phase !== 'running') return;
        if (secs <= 0) { setPhase('done'); return; }
        const t = setTimeout(() => setSecs((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [phase, secs]);

    const score = useMemo(() => {
        if (!exam) return 0;
        return exam.questions.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0);
    }, [exam, answers]);

    // persist result once when finished
    useEffect(() => {
        if (phase === 'done' && exam && !savedRef.current) {
            savedRef.current = true;
            addMockResult({
                date: new Date().toISOString(),
                score, total: exam.size, passMark: exam.pass, passed: score >= exam.pass,
            });
        }
    }, [phase, exam, score, addMockResult]);

    const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

    if (phase === 'intro') {
        return (
            <div className="space-y-5">
                <h1 className="text-2xl font-bold tracking-tight">LiD Mock Test</h1>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3 text-sm text-slate-300">
                    <p>Format mirrors the real exam: <b>{EXAM_SIZE} questions</b>, <b>60 minutes</b>, pass at <b>{PASS_MARK} correct</b>.</p>
                    <p className="text-slate-400">Questions are drawn at random each attempt. (With the sample bank the count and pass mark scale automatically.)</p>
                </div>
                <button onClick={start} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold hover:bg-indigo-500">
                    <Play size={18} /> Start mock test
                </button>
            </div>
        );
    }

    if (phase === 'running') {
        const q = exam.questions[idx];
        const answered = Object.keys(answers).length;
        return (
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Q {idx + 1} / {exam.size}</span>
                    <span className={`flex items-center gap-1.5 font-mono font-semibold ${secs < 300 ? 'text-red-400' : 'text-slate-200'}`}>
            <Timer size={16} /> {mmss}
          </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                    <p className="font-semibold text-lg leading-snug mb-4">{q.question}</p>
                    <div className="space-y-2">
                        {q.options.map((opt, i) => {
                            const picked = answers[q.id] === i;
                            return (
                                <button key={i} onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                                        className={`block w-full text-left rounded-xl border px-3 py-2.5 text-sm transition
                    ${picked ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200' : 'border-slate-800 text-slate-300 hover:border-slate-600'}`}>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}
                            className="rounded-xl border border-slate-800 px-4 py-3 disabled:opacity-40 hover:bg-slate-800">Back</button>
                    {idx < exam.size - 1
                        ? <button onClick={() => setIdx((i) => i + 1)} className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">Next</button>
                        : <button onClick={() => setPhase('done')} className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold hover:bg-emerald-500">Finish ({answered}/{exam.size})</button>}
                </div>
            </div>
        );
    }

    // done
    const passed = score >= exam.pass;
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Result</h1>
            <div className={`rounded-2xl border p-6 text-center ${passed ? 'border-emerald-600 bg-emerald-500/10' : 'border-red-600 bg-red-500/10'}`}>
                {passed ? <CheckCircle2 className="mx-auto text-emerald-400" size={40} /> : <XCircle className="mx-auto text-red-400" size={40} />}
                <div className="mt-2 text-4xl font-black">{score} / {exam.size}</div>
                <div className={`mt-1 font-semibold ${passed ? 'text-emerald-300' : 'text-red-300'}`}>
                    {passed ? 'Passed' : 'Not passed'} · need {exam.pass}
                </div>
            </div>

            {/* Review */}
            <div className="space-y-2">
                {exam.questions.map((q, i) => {
                    const ok = answers[q.id] === q.answer;
                    return (
                        <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-sm">
                            <div className="flex items-start gap-2">
                                {ok ? <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" /> : <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />}
                                <span className="font-medium">{i + 1}. {q.question}</span>
                            </div>
                            {!ok && <div className="ml-6 mt-1 text-emerald-300">✓ {q.options[q.answer]}</div>}
                        </div>
                    );
                })}
            </div>

            <button onClick={start} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold hover:bg-indigo-500">
                <RotateCcw size={18} /> Try again
            </button>
        </div>
    );
}