// src/hooks/useProgress.jsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { lidQuestions } from '../data/lidQuestions.js';
import { a1Cards } from '../data/a1Data.js';
import { a1Modules, a1ReviewItems } from '../data/a1Course.js';
import { db } from '../firebase.js';
import { useAuth } from './useAuth.jsx';

const TOTAL_LID = lidQuestions.length;
const TOTAL_CARDS = a1Cards.length;
const TOTAL_MODULES = a1Modules.length;
const TOTAL_REVIEW = a1ReviewItems.length;

const MODULE_PASS_RATIO = 0.6;
const SRS_INTERVALS = [1, 2, 4, 8, 16]; // days; index = box - 1
const SRS_MASTERED_BOX = 4;
const SAVE_DEBOUNCE_MS = 1500;

const todayISO = () => new Date().toISOString().slice(0, 10);
function addDaysISO(baseISO, days) {
    const d = new Date(`${baseISO}T00:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

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

function defaultState() {
    const exam = new Date();
    exam.setDate(exam.getDate() + 30);
    return {
        examDate: exam.toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        lid: {
            studied: [],
            wrong: [],
            mockHistory: [],
        },
        a1: {
            knownCards: [],
            grammar: { attempts: 0, correct: 0 },
            quizHistory: [],
            modules: {},
            srs: {},
        },
    };
}

// Merge Firestore data over defaults so new fields survive old saved blobs.
function mergeWithDefaults(data) {
    const base = defaultState();
    // Strip Firestore-only fields before storing in React state.
    const { updatedAt: _u, ...rest } = data ?? {};
    return {
        ...base,
        ...rest,
        lid: { ...base.lid, ...(rest?.lid ?? {}), wrong: rest?.lid?.wrong ?? [] },
        a1: {
            ...base.a1,
            ...(rest?.a1 ?? {}),
            grammar: { ...base.a1.grammar, ...(rest?.a1?.grammar ?? {}) },
        },
    };
}

function computeReadiness(s) {
    const studiedPct = TOTAL_LID ? s.lid.studied.length / TOTAL_LID : 0;
    const bestMock = s.lid.mockHistory.reduce((m, r) => Math.max(m, r.score / r.total), 0);
    const lidReadiness = Math.round((0.4 * studiedPct + 0.6 * bestMock) * 100);

    const moduleScore = TOTAL_MODULES ? countCompletedModules(s.a1.modules) / TOTAL_MODULES : 0;
    const srsMastery = TOTAL_REVIEW ? countMastered(s.a1.srs) / TOTAL_REVIEW : 0;
    const bestTest = bestModuleTest(s.a1.modules);
    const a1Readiness = Math.round((0.4 * moduleScore + 0.3 * srsMastery + 0.3 * bestTest) * 100);

    return { lidReadiness, a1Readiness };
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
    const { user } = useAuth();
    const [state, setState] = useState(defaultState);
    const [firestoreLoading, setFirestoreLoading] = useState(true);
    const saveTimer = useRef(null);
    // Track whether the current state was loaded from Firestore (don't save before load).
    const loadedRef = useRef(false);

    // ---- load from Firestore when user changes ----
    useEffect(() => {
        if (user === undefined) return; // auth still initialising
        if (!user) {
            // Signed out — reset to defaults, nothing to persist.
            setState(defaultState());
            loadedRef.current = false;
            setFirestoreLoading(false);
            return;
        }
        loadedRef.current = false;
        setFirestoreLoading(true);
        const ref = doc(db, 'users', user.uid);
        getDoc(ref)
            .then((snap) => {
                setState(mergeWithDefaults(snap.exists() ? snap.data() : null));
            })
            .catch(() => {
                // Firestore unreachable — keep defaults so app stays usable.
            })
            .finally(() => {
                loadedRef.current = true;
                setFirestoreLoading(false);
            });
    }, [user]);

    // ---- debounced save to Firestore on every state change ----
    useEffect(() => {
        if (!user || !loadedRef.current) return;
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            setDoc(doc(db, 'users', user.uid), {
                ...state,
                updatedAt: serverTimestamp(),
            }).catch(() => {}); // silent — no retry needed for exam-prep data
        }, SAVE_DEBOUNCE_MS);
        return () => clearTimeout(saveTimer.current);
    }, [state, user]);

    // ---- actions ----
    const setExamDate = useCallback((examDate) => setState((s) => ({ ...s, examDate })), []);

    const markStudied = useCallback((id) =>
        setState((s) =>
            s.lid.studied.includes(id)
                ? s
                : { ...s, lid: { ...s.lid, studied: [...s.lid.studied, id] } }
        ), []);

    const markWrong = useCallback((id) =>
        setState((s) =>
            s.lid.wrong.includes(id)
                ? s
                : { ...s, lid: { ...s.lid, wrong: [...s.lid.wrong, id] } }
        ), []);

    const clearWrong = useCallback((id) =>
        setState((s) => ({
            ...s, lid: { ...s.lid, wrong: s.lid.wrong.filter((x) => x !== id) },
        })), []);

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
        setState(mergeWithDefaults(data));
    }, []);

    const resetAll = useCallback(() => setState(defaultState()), []);

    // ---- derived values ----
    const readiness = useMemo(() => computeReadiness(state), [state]);

    const daysLeft = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const exam = new Date(state.examDate); exam.setHours(0, 0, 0, 0);
        return Math.max(0, Math.round((exam - today) / 86400000));
    }, [state.examDate]);

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
        loading: firestoreLoading,
        ...readiness,
        daysLeft,
        totals: { lid: TOTAL_LID, cards: TOTAL_CARDS, modules: TOTAL_MODULES, review: TOTAL_REVIEW },
        setExamDate, markStudied, markWrong, clearWrong, addMockResult,
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
