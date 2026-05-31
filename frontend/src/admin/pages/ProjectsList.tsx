import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type{ Project } from '../../types';

export default function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        api.get<Project[]>('/projects/')
            .then(res => setProjects(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        setDeleting(id);
        try {
            await api.delete(`/projects/${id}/`, { headers });
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch {
            alert('Failed to delete project.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="section-subtitle">Manage</p>
                    <h2 className="section-title">Projects</h2>
                </div>
                <Link to="/admin-panel/projects/add" className="btn-primary">
                    + Add Project
                </Link>
            </div>

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-4 bg-border rounded w-1/3 mb-2" />
                            <div className="h-3 bg-border rounded w-2/3" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && projects.length === 0 && (
                <div className="card text-center py-12">
                    <p className="font-mono text-text-secondary text-sm mb-4">
                        No projects yet.
                    </p>
                    <Link to="/admin-panel/projects/add" className="btn-primary">
                        + Add Your First Project
                    </Link>
                </div>
            )}

            {/* Projects Table */}
            {!loading && projects.length > 0 && (
                <div className="card p-0 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left font-mono text-xs text-text-secondary uppercase tracking-wider px-6 py-4">
                                    Title
                                </th>
                                <th className="text-left font-mono text-xs text-text-secondary uppercase tracking-wider px-6 py-4 hidden md:table-cell">
                                    Tech Stack
                                </th>
                                <th className="text-left font-mono text-xs text-text-secondary uppercase tracking-wider px-6 py-4 hidden lg:table-cell">
                                    Featured
                                </th>
                                <th className="text-left font-mono text-xs text-text-secondary uppercase tracking-wider px-6 py-4 hidden lg:table-cell">
                                    Order
                                </th>
                                <th className="px-6 py-4" />
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={project.id}
                                    className={`border-b border-border last:border-0 hover:bg-border/20 transition-colors ${index % 2 === 0 ? '' : 'bg-ink/30'
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-display font-semibold text-text-primary text-sm">
                                            {project.title}
                                        </div>
                                        <div className="font-mono text-xs text-text-secondary mt-0.5 line-clamp-1">
                                            {project.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {project.tech_stack.slice(0, 3).map(tech => (
                                                <span
                                                    key={tech}
                                                    className="font-mono text-xs px-2 py-0.5 bg-ink border border-border rounded text-text-secondary"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.tech_stack.length > 3 && (
                                                <span className="font-mono text-xs text-text-secondary">
                                                    +{project.tech_stack.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className={`font-mono text-xs px-2 py-1 rounded border ${project.is_featured
                                            ? 'bg-accent/10 text-accent border-accent/20'
                                            : 'bg-ink text-text-secondary border-border'
                                            }`}>
                                            {project.is_featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className="font-mono text-sm text-text-secondary">
                                            {project.order}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 justify-end">
                                            <Link
                                                to={`/admin-panel/projects/${project.id}`}
                                                className="font-mono text-xs text-accent hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                disabled={deleting === project.id}
                                                className="font-mono text-xs text-red-400 hover:underline disabled:opacity-50"
                                            >
                                                {deleting === project.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}