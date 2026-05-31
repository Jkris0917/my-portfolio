import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
    { href: '/admin-panel/dashboard', label: 'Dashboard', icon: '▦' },
    { href: '/admin-panel/projects', label: 'Projects', icon: '◈' },
    { href: '/admin-panel/messages', label: 'Messages', icon: '◉' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-ink flex">

            {/* Sidebar */}
            <aside className={`flex flex-col bg-surface border-r border-border transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>

                {/* Logo */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-border">
                    {!collapsed && (
                        <span className="font-mono text-accent font-semibold text-lg">
                            jk<span className="text-text-primary">.</span>admin
                        </span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-text-secondary hover:text-accent transition-colors ml-auto"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-6 flex flex-col gap-1 px-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors font-mono text-sm ${location.pathname === link.href
                                ? 'bg-accent/10 text-accent border border-accent/20'
                                : 'text-text-secondary hover:text-text-primary hover:bg-border/50'
                                }`}
                        >
                            <span className="text-base shrink-0">{link.icon}</span>
                            {!collapsed && <span>{link.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Bottom — Logout */}
                <div className="px-2 py-4 border-t border-border">
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-mono text-sm text-text-secondary hover:text-red-400 hover:bg-red-400/5 transition-colors`}
                    >
                        <span className="shrink-0">⏻</span>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Header */}
                <header className="bg-surface border-b border-border px-8 py-4 flex items-center justify-between">
                    <h1 className="font-display font-semibold text-text-primary text-lg">
                        {navLinks.find(l => l.href === location.pathname)?.label || 'Admin Panel'}
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="font-mono text-xs text-text-secondary">admin</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}