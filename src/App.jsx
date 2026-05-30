// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LidStudy from './pages/LidStudy.jsx';
import LidMock from './pages/LidMock.jsx';
import A1Course from './pages/A1Course.jsx';
import A1Module from './pages/A1Module.jsx';
import A1Lesson from './pages/A1Lesson.jsx';
import A1ModuleTest from './pages/A1ModuleTest.jsx';
import A1Review from './pages/A1Review.jsx';
import A1Study from './pages/A1Study.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="text-slate-400 text-sm animate-pulse">Loading…</div>
        </div>
    );
}

export default function App() {
    const { user } = useAuth();

    if (user === undefined) return <LoadingScreen />;
    if (user === null) return <Login />;

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="lid/study" element={<LidStudy />} />
                <Route path="lid/mock" element={<LidMock />} />
                <Route path="a1" element={<A1Course />} />
                <Route path="a1/module/:moduleId" element={<A1Module />} />
                <Route path="a1/module/:moduleId/test" element={<A1ModuleTest />} />
                <Route path="a1/lesson/:moduleId/:lessonId" element={<A1Lesson />} />
                <Route path="a1/review" element={<A1Review />} />
                <Route path="a1/practice" element={<A1Study />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
