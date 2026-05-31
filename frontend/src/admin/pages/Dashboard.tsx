import { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Project, ContactMessage } from '../../types';
import { Link } from 'react-router-dom';

interface Stats {
    totalProjects: number;
    featuredProjects: number;
    totalMessages: number;
    unreadMessages: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProjects: 0,
        featuredProjects: 0,
        totalMessages: 0,
        unreadMessages: 0,
    });
    const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            api.get<Project[]>('/projects/'),
            api.get<ContactMessage[]>('/messages/', { headers }),
        ])
            .then(([projectsRes, messagesRes]) => {
                const projects = projectsRes.data;
                const messages = messagesRes.data;

                setStats({
                    totalProjects: projects.length,
                    featuredProjects: projects.filter(p => p.is_featured).length,
                    totalMessages: messages.length,
                    unreadMessages: messages.filter(m => !m.is_read).length,
                });

                setRecentMessages(messages.slice(0, 5));
            })
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: 'Total Projects', value: stats.totalProjects, href: '/admin-panel/projects' },
        { label: 'Featured', value: stats.featuredProjects, href: '/admin-panel/projects' },
        { label: 'Total Messages', value: stats.totalMessages, href: '/admin-panel/messages' },
        { label: 'Unread', value: stats.unreadMessages, href: '/admin-panel/messages' },
    ];

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <p className="section-subtitle">Overview</p>
                <h2 className="section-title">Dashboard</h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(stat => (
                    <Link
                        key={stat.label}
                        to={stat.href}
                        className="card hover:border-accent/40 transition-colors"
                    >
                        <div className="font-display font-bold text-4xl text-accent mb-1">
                            {loading ? '—' : stat.value}
                        </div>
                        <div className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                            {stat.label}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Messages */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-text-primary text-lg">
                        Recent Messages
                    </h3>
                    <Link
                        to="/admin-panel/messages"
                        className="font-mono text-xs text-accent hover:underline"
                    >
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-3 bg-border rounded w-1/4 mb-2" />
                                <div className="h-3 bg-border rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : recentMessages.length === 0 ? (
                    <div className="card text-center py-8">
                        <p className="font-mono text-text-secondary text-sm">No messages yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentMessages.map(msg => (
                            <div key={msg.id} className="card flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-sm text-text-primary font-medium">
                                            {msg.name}
                                        </span>
                                        <span className="font-mono text-xs text-text-secondary">
                                            {msg.email}
                                        </span>
                                        {!msg.is_read && (
                                            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                                        )}
                                    </div>
                                    <p className="font-mono text-xs text-text-secondary truncate">
                                        {msg.message}
                                    </p>
                                </div>
                                <span className="font-mono text-xs text-text-secondary shrink-0">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">
                    Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin-panel/projects/add" className="btn-primary">
                        + Add Project
                    </Link>
                    <Link to="/admin-panel/messages" className="btn-outline">
                        View Messages
                    </Link>

                    <a href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                    >
                        View Portfolio ↗
                    </a>
                </div>
            </div>

        </div >
    );
}