# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (HMR)
npm run build     # production build → dist/
npm run lint      # ESLint
npm run preview   # serve the dist/ build locally
npm run deploy    # build + push to gh-pages branch (GitHub Pages)
```

No test suite exists.

## Architecture

Single-page React 19 app built with Vite. The app helps users prepare for two German exams: the **A1 language test** and the **Leben in Deutschland (LiD)** civics test.

**Routing** — `HashRouter` (not `BrowserRouter`) is intentional so GitHub Pages works without server-side rewrite rules. Routes are defined in `src/App.jsx`: `/`, `/lid/study`, `/lid/mock`, `/a1`, `/analytics`, `/settings`.

**Global state** — all progress lives in a single React Context (`ProgressProvider` in `src/hooks/useProgress.jsx`). State is persisted to `localStorage` under key `a1-lid-progress-v1`. Access state via the `useProgress()` hook. The context exposes derived values (`lidReadiness`, `a1Readiness`, `daysLeft`) computed by `computeReadiness()` and provides actions (`markStudied`, `addMockResult`, `toggleKnownCard`, `recordGrammar`, `addQuizResult`, `importData`, `resetAll`).

**Readiness scores**
- LiD readiness = 40% coverage of studied questions + 60% best mock score
- A1 readiness = 40% card mastery + 30% grammar accuracy + 30% best quiz score

**Static data** — all question/card content lives in `src/data/`:
- `lidQuestions.js` — LiD question bank (`id`, `category: general|berlin`, `options[]`, `answer` index). The mock exam auto-scales pass mark if the bank has fewer than 33 questions.
- `a1Data.js` — exports `a1Categories`, `a1Cards` (flat list with deterministic IDs `<Category>-<index>`), `articleDrill`, `sentenceDrill`, and `a1Quiz`.

**Styling** — Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js`; configured through the plugin directly). Dark theme (`slate-900` backgrounds, `indigo`/`emerald`/`sky` accents).

**Charts** — the Analytics page renders bar charts as raw SVG with no charting library, to keep the GitHub Pages bundle minimal.

**Deployment** — `vite.config.js` sets `base: '/a1-lid-prep/'` for deployment to `https://raghavtan.github.io/a1-lid-prep/`.

## Behavioral specification

`exam-prep.allium` is an [Allium](https://allium.sh) spec that describes the app's domain model and rules independent of the React implementation. It is the authoritative source for business logic (readiness formulas, mock exam scaling, import/export semantics, etc.). Consult it before changing any core behaviour, and keep it in sync when behaviour changes.
