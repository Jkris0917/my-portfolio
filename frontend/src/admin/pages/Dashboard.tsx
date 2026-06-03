import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaProjectDiagram, FaStar, FaEnvelope,
    FaEnvelopeOpen, FaPlus, FaEye, FaCertificate,
    FaImages,
} from 'react-icons/fa';
import api from '../../api/axios';
import type { Project, ContactMessage, Certificate, GalleryImage } from '../../types';

interface Stats {
    totalProjects: number;
    featuredProjects: number;
    totalMessages: number;
    unreadMessages: number;
    totalCertificates: number;
    totalGallery: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProjects: 0,
        featuredProjects: 0,
        totalMessages: 0,
        unreadMessages: 0,
        totalCertificates: 0,
        totalGallery: 0,
    });
    const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get<Project[]>('/projects/'),
            api.get<ContactMessage[]>('/messages/'),
            api.get<Certificate[]>('/certificates/'),
            api.get<GalleryImage[]>('/gallery/'),
        ]).then(([projectsRes, messagesRes, certsRes, galleryRes]) => {
            const projects = projectsRes.data;
            const messages = messagesRes.data;
            const certs = certsRes.data;
            const gallery = galleryRes.data;

            setStats({
                totalProjects: projects.length,
                featuredProjects: projects.filter(p => p.is_featured).length,
                totalMessages: messages.length,
                unreadMessages: messages.filter(m => !m.is_read).length,
                totalCertificates: certs.length,
                totalGallery: gallery.length,
            });

            setRecentMessages(messages.slice(0, 4));
            setRecentProjects(projects.slice(0, 3));
        }).finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: 'Total Projects', value: stats.totalProjects, icon: FaProjectDiagram, color: '#00C7BE', href: '/admin-panel/projects' },
        { label: 'Featured', value: stats.featuredProjects, icon: FaStar, color: '#f59e0b', href: '/admin-panel/projects' },
        { label: 'Total Messages', value: stats.totalMessages, icon: FaEnvelope, color: '#6366f1', href: '/admin-panel/messages' },
        { label: 'Unread', value: stats.unreadMessages, icon: FaEnvelopeOpen, color: '#ef4444', href: '/admin-panel/messages' },
        { label: 'Certificates', value: stats.totalCertificates, icon: FaCertificate, color: '#10b981', href: '/admin-panel/certificates' },
        { label: 'Gallery', value: stats.totalGallery, icon: FaImages, color: '#8b5cf6', href: '/admin-panel/gallery' },
    ];

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <p className="section-subtitle">Overview</p>
                <h2 className="section-title">Dashboard</h2>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link to={stat.href} className="card flex flex-col gap-3 hover:border-accent/40 transition-all group">
                                <div className="flex items-center justify-between">
                                    <Icon size={16} style={{ color: stat.color }} />
                                    <span className="font-display font-bold text-2xl text-text-primary group-hover:text-accent transition-colors">
                                        {loading ? '—' : stat.value}
                                    </span>
                                </div>
                                <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                                    {stat.label}
                                </p>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Messages */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-text-primary">Recent Messages</h3>
                        <Link to="/admin-panel/messages" className="font-mono text-xs text-accent hover:underline">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-border rounded animate-pulse" />
                            ))}
                        </div>
                    ) : recentMessages.length === 0 ? (
                        <div className="text-center py-8">
                            <FaEnvelope size={24} className="text-border mx-auto mb-2" />
                            <p className="font-mono text-text-secondary text-sm">No messages yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentMessages.map(msg => (
                                <Link
                                    key={msg.id}
                                    to="/admin-panel/messages"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-border/30 transition-colors"
                                >
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${msg.is_read ? 'bg-border' : 'bg-accent'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-mono text-sm truncate ${msg.is_read ? 'text-text-secondary' : 'text-text-primary font-semibold'}`}>
                                            {msg.name}
                                        </p>
                                        <p className="font-mono text-xs text-text-secondary truncate">
                                            {msg.message || '(no message)'}
                                        </p>
                                    </div>
                                    <span className="font-mono text-xs text-text-secondary shrink-0">
                                        {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Projects */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-text-primary">Recent Projects</h3>
                        <Link to="/admin-panel/projects" className="font-mono text-xs text-accent hover:underline">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-border rounded animate-pulse" />
                            ))}
                        </div>
                    ) : recentProjects.length === 0 ? (
                        <div className="text-center py-8">
                            <FaProjectDiagram size={24} className="text-border mx-auto mb-2" />
                            <p className="font-mono text-text-secondary text-sm">No projects yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentProjects.map(project => (
                                <Link
                                    key={project.id}
                                    to={`/admin-panel/projects/${project.id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-border/30 transition-colors"
                                >
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title}
                                            className="w-10 h-10 object-cover rounded-lg border border-border shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 bg-border rounded-lg flex items-center justify-center shrink-0">
                                            <FaProjectDiagram size={14} className="text-text-secondary" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-sm text-text-primary truncate">{project.title}</p>
                                        <div className="flex gap-1 mt-0.5">
                                            {project.tech_stack.slice(0, 3).map(tech => (
                                                <span key={tech} className="font-mono text-xs text-text-secondary">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {project.is_featured && (
                                        <FaStar size={12} className="text-amber-400 shrink-0" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="font-display font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin-panel/projects/add" className="btn-primary">
                        <FaPlus size={12} />
                        Add Project
                    </Link>
                    <Link to="/admin-panel/certificates" className="btn-outline">
                        <FaCertificate size={12} />
                        Add Certificate
                    </Link>
                    <Link to="/admin-panel/gallery" className="btn-outline">
                        <FaImages size={12} />
                        Add to Gallery
                    </Link>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline">
                        <FaEye size={12} />
                        View Portfolio ↗
                    </a>
                </div>
            </div>

        </div>
    );
}