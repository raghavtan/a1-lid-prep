// src/pages/A1Study.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, Check, BookText, SpellCheck, ClipboardList, ChevronLeft } from 'lucide-react';
import { a1Categories, a1Cards, articleDrill, sentenceDrill, a1Quiz } from '../data/a1Data.js';
import { useProgress } from '../hooks/useProgress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

const TABS = [
    { id: 'cards', label: 'Flashcards', icon: BookText },
    { id: 'grammar', label: 'Grammar', icon: SpellCheck },
    { id: 'quiz', label: 'Quiz', icon: ClipboardList },
];

export default function A1Study() {
    const [tab, setTab] = useState('cards');
    return (
        <div className="space-y-5">
            <Link to="/a1" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
                <ChevronLeft size={16} /> Course
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">A1 Free Practice</h1>
            <div className="flex gap-2">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setTab(id)}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition
              ${tab === id ? 'bg-indigo-600 text-white' : 'border border-slate-800 text-slate-400'}`}>
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>
            {tab === 'cards' && <Flashcards />}
            {tab === 'grammar' && <GrammarSandbox />}
            {tab === 'quiz' && <SelfQuiz />}
        </div>
    );
}

// ---- Flashcards ----
function Flashcards() {
    const { state, toggleKnownCard, totals } = useProgress();
    const [cat, setCat] = useState('Nouns');
    const [i, setI] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const cards = useMemo(() => a1Cards.filter((c) => c.category === cat), [cat]);
    const card = cards[i];
    const known = state.a1.knownCards.includes(card.id);

    const next = () => { setFlipped(false); setI((p) => (p + 1) % cards.length); };

    return (
        <div className="space-y-4">
            <ProgressBar label="Cards mastered" value={Math.round((state.a1.knownCards.length / totals.cards) * 100)} accent="bg-emerald-500" />
            <div className="flex flex-wrap gap-2">
                {Object.keys(a1Categories).map((c) => (
                    <button key={c} onClick={() => { setCat(c); setI(0); setFlipped(false); }}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${cat === c ? 'bg-indigo-600 text-white' : 'border border-slate-800 text-slate-400'}`}>
                        {c}
                    </button>
                ))}
            </div>

            <button onClick={() => setFlipped((f) => !f)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center min-h-[200px] flex flex-col items-center justify-center hover:border-indigo-500/50 transition">
                <span className="text-3xl font-bold">{flipped ? card.en : card.de}</span>
                <span className="mt-3 text-xs text-slate-500 flex items-center gap-1"><RotateCw size={12} /> tap to flip · {i + 1}/{cards.length}</span>
            </button>

            <div className="flex gap-3">
                <button onClick={() => toggleKnownCard(card.id)}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition
            ${known ? 'bg-emerald-600 text-white' : 'border border-slate-800 text-slate-300'}`}>
                    <Check size={16} /> {known ? 'Known' : 'Mark known'}
                </button>
                <button onClick={next} className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">Next</button>
            </div>
        </div>
    );
}

// ---- Grammar sandbox ----
function GrammarSandbox() {
    const { recordGrammar } = useProgress();
    const [drill, setDrill] = useState('articles');
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button onClick={() => setDrill('articles')} className={`rounded-xl px-3 py-1.5 text-xs font-medium ${drill === 'articles' ? 'bg-indigo-600' : 'border border-slate-800 text-slate-400'}`}>Articles (der/die/das)</button>
                <button onClick={() => setDrill('order')} className={`rounded-xl px-3 py-1.5 text-xs font-medium ${drill === 'order' ? 'bg-indigo-600' : 'border border-slate-800 text-slate-400'}`}>Sentence order</button>
            </div>
            {drill === 'articles' ? <ArticleDrill onAnswer={recordGrammar} /> : <SentenceOrderDrill onAnswer={recordGrammar} />}
        </div>
    );
}

function ArticleDrill({ onAnswer }) {
    const [i, setI] = useState(0);
    const [result, setResult] = useState(null);
    const q = articleDrill[i];
    const pick = (a) => {
        if (result) return;
        const ok = a === q.article;
        setResult(ok ? 'ok' : a);
        onAnswer(ok);
    };
    const next = () => { setResult(null); setI((p) => (p + 1) % articleDrill.length); };

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center space-y-4">
            <p className="text-sm text-slate-400">Choose the correct article</p>
            <p className="text-3xl font-bold">___ {q.word}</p>
            <div className="grid grid-cols-3 gap-2">
                {['der', 'die', 'das'].map((a) => {
                    let cls = 'border-slate-800 text-slate-300';
                    if (result) {
                        if (a === q.article) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
                        else if (a === result) cls = 'border-red-500 bg-red-500/15 text-red-300';
                    }
                    return <button key={a} onClick={() => pick(a)} className={`rounded-xl border py-3 font-semibold ${cls}`}>{a}</button>;
                })}
            </div>
            {result && <button onClick={next} className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold hover:bg-indigo-500">Next</button>}
        </div>
    );
}

function SentenceOrderDrill({ onAnswer }) {
    const [i, setI] = useState(0);
    const [picked, setPicked] = useState(null);
    const q = sentenceDrill[i];
    const choose = (idx) => { if (picked !== null) return; setPicked(idx); onAnswer(idx === q.answer); };
    const next = () => { setPicked(null); setI((p) => (p + 1) % sentenceDrill.length); };

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <p className="text-sm text-slate-400">{q.prompt}</p>
            {q.options.map((opt, idx) => {
                let cls = 'border-slate-800 text-slate-300';
                if (picked !== null) {
                    if (idx === q.answer) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
                    else if (idx === picked) cls = 'border-red-500 bg-red-500/15 text-red-300';
                }
                return <button key={idx} onClick={() => choose(idx)} className={`block w-full text-left rounded-xl border px-3 py-2.5 text-sm ${cls}`}>{opt}</button>;
            })}
            {picked !== null && <button onClick={next} className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold hover:bg-indigo-500">Next</button>}
        </div>
    );
}

// ---- Self-evaluation quiz ----
function SelfQuiz() {
    const { addQuizResult } = useProgress();
    const [i, setI] = useState(0);
    const [answers, setAnswers] = useState({});
    const [done, setDone] = useState(false);

    const score = a1Quiz.reduce((n, q, idx) => n + (answers[idx] === q.answer ? 1 : 0), 0);

    const finish = () => {
        setDone(true);
        addQuizResult({ date: new Date().toISOString(), score, total: a1Quiz.length });
    };
    const restart = () => { setAnswers({}); setI(0); setDone(false); };

    if (done) {
        const pct = Math.round((score / a1Quiz.length) * 100);
        return (
            <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-600 bg-indigo-500/10 p-6 text-center">
                    <div className="text-sm text-indigo-200">A1 Readiness Score</div>
                    <div className="text-5xl font-black mt-1">{pct}%</div>
                    <div className="text-slate-300 mt-1">{score} / {a1Quiz.length} correct</div>
                </div>
                <button onClick={restart} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">Retake quiz</button>
            </div>
        );
    }

    const q = a1Quiz[i];
    return (
        <div className="space-y-4">
            <div className="text-xs text-slate-400">Question {i + 1} / {a1Quiz.length}</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="font-semibold text-lg mb-4">{q.question}</p>
                <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                        <button key={idx} onClick={() => setAnswers((a) => ({ ...a, [i]: idx }))}
                                className={`block w-full text-left rounded-xl border px-3 py-2.5 text-sm transition
                ${answers[i] === idx ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200' : 'border-slate-800 text-slate-300 hover:border-slate-600'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex gap-3">
                <button disabled={i === 0} onClick={() => setI((p) => p - 1)} className="rounded-xl border border-slate-800 px-4 py-3 disabled:opacity-40">Back</button>
                {i < a1Quiz.length - 1
                    ? <button onClick={() => setI((p) => p + 1)} className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">Next</button>
                    : <button onClick={finish} className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold hover:bg-emerald-500">See score</button>}
            </div>
        </div>
    );
}