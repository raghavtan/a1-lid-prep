// src/components/Layout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, ClipboardCheck, BarChart3, Settings } from 'lucide-react';

const nav = [
    { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/lid/study', label: 'LiD', icon: BookOpen },
    { to: '/lid/mock', label: 'Mock', icon: ClipboardCheck },
    { to: '/a1', label: 'A1', icon: GraduationCap },
    { to: '/analytics', label: 'Stats', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar (desktop) */}
            <aside className="hidden md:flex md:w-60 md:flex-col border-r border-slate-800 p-4 gap-1">
                <div className="px-3 py-4 text-lg font-bold tracking-tight">
                    🇩🇪 <span className="text-indigo-400">A1·LiD</span> Prep
                </div>
                {nav.map(({ to, label, icon: Icon, end }) => (
                    <NavLink key={to} to={to} end={end}
                             className={({ isActive }) =>
                                 `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
               ${isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
                        <Icon size={18} /> {label}
                    </NavLink>
                ))}
            </aside>

            {/* Main */}
            <main className="flex-1 pb-24 md:pb-8">
                <div className="mx-auto max-w-3xl px-4 pt-5 md:pt-8">
                    <Outlet />
                </div>
            </main>

            {/* Bottom tab bar (mobile) */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 border-t border-slate-800 bg-slate-950/90 backdrop-blur safe-bottom">
                <div className="grid grid-cols-6">
                    {nav.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end}
                                 className={({ isActive }) =>
                                     `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition
                 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                            <Icon size={20} /> {label}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}