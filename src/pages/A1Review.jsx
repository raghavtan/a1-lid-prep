// src/pages/A1Review.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, RotateCw, Check, X, PartyPopper } from 'lucide-react';
import { useProgress } from '../hooks/useProgress.jsx';
import SpeakButton from '../components/SpeakButton.jsx';

export default function A1Review() {
    const { dueReviewItems, reviewItem } = useProgress();
    // Snapshot the queue once so grading (which reschedules items) doesn't
    // reshuffle the session under us.
    const [queue] = useState(() => dueReviewItems);
    const [i, setI] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [tally, setTally] = useState({ good: 0, again: 0 });

    const Header = (
        <Link to="/a1" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
            <ChevronLeft size={16} /> Course
        </Link>
    );

    if (queue.length === 0) {
        return (
            <div className="space-y-5">
                {Header}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center space-y-2">
                    <PartyPopper size={32} className="mx-auto text-emerald-400" />
                    <p className="font-semibold">Nothing to review right now</p>
                    <p className="text-sm text-slate-400">Finish more lessons or come back tomorrow — items return when they’re due.</p>
                </div>
            </div>
        );
    }

    if (i >= queue.length) {
        return (
            <div className="space-y-5">
                {Header}
                <div className="rounded-2xl border border-emerald-600 bg-emerald-500/10 p-8 text-center space-y-2">
                    <PartyPopper size={32} className="mx-auto text-emerald-400" />
                    <p className="text-2xl font-bold">Review done!</p>
                    <p className="text-sm text-slate-300">{tally.good} known · {tally.again} to repeat · {queue.length} total</p>
                </div>
                <Link to="/a1" className="block w-full rounded-xl bg-indigo-600 py-3 text-center font-semibold hover:bg-indigo-500">Back to course</Link>
            </div>
        );
    }

    const card = queue[i];
    const grade = (good) => {
        reviewItem(card.id, good);
        setTally((t) => ({ good: t.good + (good ? 1 : 0), again: t.again + (good ? 0 : 1) }));
        setFlipped(false);
        setI((p) => p + 1);
    };

    return (
        <div className="space-y-5">
            {Header}
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Daily Review</h1>
                <span className="text-sm text-slate-400">{i + 1} / {queue.length}</span>
            </header>

            <button onClick={() => setFlipped((f) => !f)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center min-h-[200px] flex flex-col items-center justify-center hover:border-indigo-500/50 transition">
                <span className="text-3xl font-bold">{card.de}</span>
                {flipped && (
                    <>
                        <span className="mt-4 text-xl text-emerald-300">{card.en}</span>
                        {card.ex && <span className="mt-2 text-sm italic text-slate-500">{card.ex}</span>}
                    </>
                )}
                {!flipped && <span className="mt-3 flex items-center gap-1 text-xs text-slate-500"><RotateCw size={12} /> tap to reveal</span>}
            </button>

            <div className="flex justify-center">
                <SpeakButton text={card.de} label="Listen" />
            </div>

            {flipped ? (
                <div className="flex gap-3">
                    <button onClick={() => grade(false)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 py-3 font-semibold text-red-300 hover:bg-red-500/20">
                        <X size={16} /> Again
                    </button>
                    <button onClick={() => grade(true)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold hover:bg-emerald-500">
                        <Check size={16} /> Got it
                    </button>
                </div>
            ) : (
                <button onClick={() => setFlipped(true)}
                        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">Show answer</button>
            )}
        </div>
    );
}
