// src/hooks/useProgress.jsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { lidQuestions } from '../data/lidQuestions.js';
import { a1Cards } from '../data/a1Data.js';
import { a1Modules, a1ReviewItems } from '../data/a1Course.js';

const STORAGE_KEY = 'a1-lid-progress-v1';
const TOTAL_LID = lidQuestions.length;
const TOTAL_CARDS = a1Cards.length;
const TOTAL_MODULES = a1Modules.length;
const TOTAL_REVIEW = a1ReviewItems.length;

// Course / spaced-repetition constants (mirror config in exam-prep.allium).
const MODULE_PASS_RATIO = 0.6;
const SRS_INTERVALS = [1, 2, 4, 8, 16]; // days; index = box - 1
const SRS_MASTERED_BOX = 4;

const todayISO = () => new Date().toISOString().slice(0, 10);
function addDaysISO(baseISO, days) {
    const d = new Date(`${baseISO}T00:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

// A module is complete when every lesson is done and the best test ratio passes.
function moduleIsComplete(modState, moduleId) {
    const def = a1Modules.find((m) => m.id === moduleId);
    if (!def) return false;
    const done = modState?.lessonsDone?.length ?? 0;
    const best = modState?.testBest ?? 0;
    return done >= def.lessons.length && best >= MODULE_PASS_RATIO;
}
const countCompletedModules = (modules) =>
    a1Modules.reduce((n, m) => n + (moduleIsComplete(modules?.[m.id], m.id) ? 1 : 0), 0);
const countMastered = (srs) =>
    a1ReviewItems.reduce((n, it) => n + ((srs?.[it.id]?.box ?? 0) >= SRS_MASTERED_BOX ? 1 : 0), 0);
const bestModuleTest = (modules) =>
    Object.values(modules ?? {}).reduce((m, x) => Math.max(m, x?.testBest ?? 0), 0);

// ---- default state -------------------------------------------------------
function defaultState() {
    const exam = new Date();
    exam.setDate(exam.getDate() + 30); // default exam date = 30 days out
    return {
        examDate: exam.toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        lid: {
            studied: [],                 // ids of LiD questions reviewed
            mockHistory: [],             // { date, score, total, passMark, passed }
        },
        a1: {
            knownCards: [],              // ids of flashcards marked "known" (legacy practice)
            grammar: { attempts: 0, correct: 0 },
            quizHistory: [],             // { date, score, total } (legacy practice)
            modules: {},                 // { [moduleId]: { lessonsDone:[id], testBest:0..1, completedAt } }
            srs: {},                     // { [itemId]: { box:1..5, due:'YYYY-MM-DD', seen, correct } }
        },
    };
}

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultState();
        // shallow-merge so new fields survive old saved blobs
        return { ...defaultState(), ...JSON.parse(raw) };
    } catch {
        return defaultState();
    }
}

// ---- readiness math ------------------------------------------------------
function computeReadiness(s) {
    const studiedPct = TOTAL_LID ? s.lid.studied.length / TOTAL_LID : 0;
    const bestMock = s.lid.mockHistory.reduce((m, r) => Math.max(m, r.score / r.total), 0);
    const lidReadiness = Math.round((0.4 * studiedPct + 0.6 * bestMock) * 100);

    // A1 readiness is now course-based: 40% module completion, 30% spaced-
    // repetition mastery, 30% best module-test performance.
    const moduleScore = TOTAL_MODULES ? countCompletedModules(s.a1.modules) / TOTAL_MODULES : 0;
    const srsMastery = TOTAL_REVIEW ? countMastered(s.a1.srs) / TOTAL_REVIEW : 0;
    const bestTest = bestModuleTest(s.a1.modules);
    const a1Readiness = Math.round((0.4 * moduleScore + 0.3 * srsMastery + 0.3 * bestTest) * 100);

    return { lidReadiness, a1Readiness };
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
    const [state, setState] = useState(load);

    // persist on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // ---- actions (memoised) ----
    const setExamDate = useCallback((examDate) => setState((s) => ({ ...s, examDate })), []);

    const markStudied = useCallback((id) =>
        setState((s) =>
            s.lid.studied.includes(id)
                ? s
                : { ...s, lid: { ...s.lid, studied: [...s.lid.studied, id] } }
        ), []);

    const addMockResult = useCallback((result) =>
        setState((s) => ({
            ...s,
            lid: { ...s.lid, mockHistory: [...s.lid.mockHistory, result] },
        })), []);

    const toggleKnownCard = useCallback((id) =>
        setState((s) => {
            const known = s.a1.knownCards.includes(id)
                ? s.a1.knownCards.filter((x) => x !== id)
                : [...s.a1.knownCards, id];
            return { ...s, a1: { ...s.a1, knownCards: known } };
        }), []);

    const recordGrammar = useCallback((isCorrect) =>
        setState((s) => ({
            ...s,
            a1: {
                ...s.a1,
                grammar: {
                    attempts: s.a1.grammar.attempts + 1,
                    correct: s.a1.grammar.correct + (isCorrect ? 1 : 0),
                },
            },
        })), []);

    const addQuizResult = useCallback((result) =>
        setState((s) => ({
            ...s,
            a1: { ...s.a1, quizHistory: [...s.a1.quizHistory, result] },
        })), []);

    // ---- course actions ----
    const completeLesson = useCallback((moduleId, lessonId) =>
        setState((s) => {
            const modules = s.a1.modules ?? {};
            const cur = modules[moduleId] ?? { lessonsDone: [], testBest: 0, completedAt: null };
            if (cur.lessonsDone.includes(lessonId)) return s;
            const lessonsDone = [...cur.lessonsDone, lessonId];
            const next = { ...cur, lessonsDone };
            if (!next.completedAt && moduleIsComplete(next, moduleId)) next.completedAt = new Date().toISOString();
            return { ...s, a1: { ...s.a1, modules: { ...modules, [moduleId]: next } } };
        }), []);

    const recordModuleTest = useCallback((moduleId, { score, total }) =>
        setState((s) => {
            const modules = s.a1.modules ?? {};
            const cur = modules[moduleId] ?? { lessonsDone: [], testBest: 0, completedAt: null };
            const ratio = total ? score / total : 0;
            const testBest = Math.max(cur.testBest ?? 0, ratio);
            const next = { ...cur, testBest };
            if (!next.completedAt && moduleIsComplete(next, moduleId)) next.completedAt = new Date().toISOString();
            return { ...s, a1: { ...s.a1, modules: { ...modules, [moduleId]: next } } };
        }), []);

    // Leitner: correct → promote (max box 5); wrong → back to box 1. Reschedule.
    const reviewItem = useCallback((itemId, correct) =>
        setState((s) => {
            const srs = s.a1.srs ?? {};
            const cur = srs[itemId];
            const box = correct ? Math.min(5, (cur?.box ?? 1) + 1) : 1;
            const next = {
                box,
                due: addDaysISO(todayISO(), SRS_INTERVALS[box - 1]),
                seen: (cur?.seen ?? 0) + 1,
                correct: (cur?.correct ?? 0) + (correct ? 1 : 0),
            };
            return { ...s, a1: { ...s.a1, srs: { ...srs, [itemId]: next } } };
        }), []);

    const importData = useCallback((data) => {
        // merge incoming data over defaults so absent nested keys keep their
        // defaults (e.g. a partial import with `a1` but no `a1.grammar`)
        const base = defaultState();
        setState({
            ...base,
            ...data,
            lid: { ...base.lid, ...(data?.lid ?? {}) },
            a1: {
                ...base.a1,
                ...(data?.a1 ?? {}),
                grammar: { ...base.a1.grammar, ...(data?.a1?.grammar ?? {}) },
            },
        });
    }, []);

    const resetAll = useCallback(() => setState(defaultState()), []);

    // ---- derived values ----
    const readiness = useMemo(() => computeReadiness(state), [state]);

    const daysLeft = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const exam = new Date(state.examDate); exam.setHours(0, 0, 0, 0);
        return Math.max(0, Math.round((exam - today) / 86400000));
    }, [state.examDate]);

    // Review items due now: never-seen items, plus any whose due date has passed.
    const dueReviewItems = useMemo(() => {
        const srs = state.a1.srs ?? {};
        const today = todayISO();
        return a1ReviewItems
            .filter((it) => { const r = srs[it.id]; return !r || r.due <= today; })
            .map((it) => ({ ...it, box: srs[it.id]?.box ?? 0 }));
    }, [state.a1.srs]);

    const moduleProgress = useCallback((moduleId) => {
        const def = a1Modules.find((m) => m.id === moduleId);
        const cur = state.a1.modules?.[moduleId] ?? { lessonsDone: [], testBest: 0, completedAt: null };
        return {
            lessonsDoneIds: cur.lessonsDone ?? [],
            lessonsDone: cur.lessonsDone?.length ?? 0,
            lessonsTotal: def?.lessons.length ?? 0,
            testBest: cur.testBest ?? 0,
            completed: moduleIsComplete(cur, moduleId),
            completedAt: cur.completedAt ?? null,
        };
    }, [state.a1.modules]);

    const courseStats = useMemo(() => ({
        modulesTotal: TOTAL_MODULES,
        modulesCompleted: countCompletedModules(state.a1.modules),
        reviewTotal: TOTAL_REVIEW,
        reviewMastered: countMastered(state.a1.srs),
        dueCount: dueReviewItems.length,
    }), [state.a1.modules, state.a1.srs, dueReviewItems.length]);

    const value = {
        state,
        ...readiness,
        daysLeft,
        totals: { lid: TOTAL_LID, cards: TOTAL_CARDS, modules: TOTAL_MODULES, review: TOTAL_REVIEW },
        setExamDate, markStudied, addMockResult,
        toggleKnownCard, recordGrammar, addQuizResult,
        completeLesson, recordModuleTest, reviewItem,
        dueReviewItems, moduleProgress, courseStats,
        importData, resetAll,
    };

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error('useProgress must be used within <ProgressProvider>');
    return ctx;
}