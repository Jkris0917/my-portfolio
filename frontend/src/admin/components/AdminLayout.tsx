import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    FaThLarge, FaProjectDiagram, FaEnvelope,
    FaBars, FaTimes, FaSignOutAlt, FaExternalLinkAlt,
    FaUser, FaStar, FaBriefcase, FaCertificate,
    FaImages, FaKey,
} from 'react-icons/fa';

const navLinks = [
    { href: '/admin-panel/dashboard', label: 'Dashboard', icon: FaThLarge },
    { href: '/admin-panel/projects', label: 'Projects', icon: FaProjectDiagram },
    { href: '/admin-panel/messages', label: 'Messages', icon: FaEnvelope },
    { href: '/admin-panel/about', label: 'About', icon: FaUser },
    { href: '/admin-panel/skills', label: 'Skills', icon: FaStar },
    { href: '/admin-panel/experience', label: 'Experience', icon: FaBriefcase },
    { href: '/admin-panel/certificates', label: 'Certificates', icon: FaCertificate },
    { href: '/admin-panel/gallery', label: 'Gallery', icon: FaImages },
    { href: '/admin-panel/change-password', label: 'Change Password', icon: FaKey },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    const currentPage = navLinks.find(l => l.href === location.pathname)?.label || 'Admin Panel';

    return (
        <div className="min-h-screen bg-ink flex">

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-ink/80 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        flex flex-col bg-surface border-r border-border
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

                {/* Logo */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-border">
                    {!collapsed && (
                        <span className="font-mono text-accent font-semibold text-lg">
                            jk<span className="text-text-primary">.</span>admin
                        </span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex text-text-secondary hover:text-accent transition-colors ml-auto"
                    >
                        {collapsed ? <FaBars size={14} /> : <FaTimes size={14} />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden text-text-secondary hover:text-accent transition-colors"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-6 flex flex-col gap-1 px-2">
                    {navLinks.map(link => {
                        const Icon = link.icon;
                        const active = location.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors font-mono text-sm ${active
                                    ? 'bg-accent/10 text-accent border border-accent/20'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-border/50'
                                    }`}
                            >
                                <Icon size={14} className="shrink-0" />
                                {!collapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-2 py-4 border-t border-border space-y-1">

                    <a href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded font-mono text-sm text-text-secondary hover:text-text-primary hover:bg-border/50 transition-colors"
                    >
                        <FaExternalLinkAlt size={12} className="shrink-0" />
                        {!collapsed && <span>View Site</span>}
                    </a>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded font-mono text-sm text-text-secondary hover:text-red-400 hover:bg-red-400/5 transition-colors"
                    >
                        <FaSignOutAlt size={14} className="shrink-0" />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside >

            {/* Main Content */}
            < div className="flex-1 flex flex-col min-w-0" >

                {/* Top Header */}
                < header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between" >
                    <div className="flex items-center gap-4">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden text-text-secondary hover:text-accent transition-colors"
                        >
                            <FaBars size={16} />
                        </button>
                        <h1 className="font-display font-semibold text-text-primary text-lg">
                            {currentPage}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="font-mono text-xs text-text-secondary hidden sm:block">admin</span>
                    </div>
                </header >

                {/* Page Content */}
                < main className="flex-1 p-4 md:p-8 overflow-auto" >
                    {children}
                </main >
            </div >
        </div >
    );
}