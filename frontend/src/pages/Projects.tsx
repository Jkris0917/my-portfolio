import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Project } from '../types';

function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="card group flex flex-col">
            {/* Image */}
            {project.image_url && (
                <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-lg">
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-display font-semibold text-xl text-text-primary group-hover:text-accent transition-colors">
                    {project.title}
                </h3>
                {project.is_featured && (
                    <span className="shrink-0 font-mono text-xs px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded">
                        Featured
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-1">
                {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tech_stack.map((tech: string) => (
                    <span
                        key={tech}
                        className="font-mono text-xs px-2 py-1 bg-ink border border-border rounded text-text-secondary"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Links */}
            <div className="flex gap-3 pt-4 border-t border-border">
                {project.github_url && (

                    <a href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                    >
                        ⌥ GitHub
                    </a>
                )}
                {project.live_url && (

                    <a href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent hover:underline"
                    >
                        ↗ Live Demo
                    </a>
                )
                }
            </div >
        </div >
    );
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<Project[]>('/projects/')
            .then(res => setProjects(res.data))
            .catch(() => setError('Failed to load projects. Make sure the backend is running.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
            {/* Header */}
            <div className="mb-16">
                <p className="section-subtitle">Portfolio</p>
                <h1 className="section-title">My Projects</h1>
                <p className="text-text-secondary max-w-xl mt-3">
                    Production-grade systems built with Django, DRF, PostgreSQL, and modern tooling.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-5 bg-border rounded mb-4 w-2/3" />
                            <div className="h-3 bg-border rounded mb-2" />
                            <div className="h-3 bg-border rounded mb-2 w-4/5" />
                            <div className="h-3 bg-border rounded w-3/5" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-6 text-center">
                    <p className="font-mono text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && projects.length === 0 && (
                <p className="text-text-secondary font-mono text-sm">
                    No projects found. Add some via the Django admin.
                </p>
            )}

            {/* Projects Grid */}
            {!loading && !error && projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </main>
    );
}