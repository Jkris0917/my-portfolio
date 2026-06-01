import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    SiPython, SiDjango, SiPostgresql, SiDocker,
    SiRedis, SiReact, SiTypescript, SiGithub,
    SiFlask, SiFastapi, SiCelery, SiRabbitmq,
} from 'react-icons/si';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import api from '../api/axios';
import type { Project } from '../types';

const techIconMap: Record<string, { icon: React.ElementType; color: string }> = {
    'Python': { icon: SiPython, color: '#3776AB' },
    'Django': { icon: SiDjango, color: '#44B78B' },
    'DRF': { icon: SiDjango, color: '#44B78B' },
    'PostgreSQL': { icon: SiPostgresql, color: '#336791' },
    'Docker': { icon: SiDocker, color: '#2496ED' },
    'Redis': { icon: SiRedis, color: '#DC382D' },
    'React': { icon: SiReact, color: '#61DAFB' },
    'TypeScript': { icon: SiTypescript, color: '#3178C6' },
    'GitHub Actions': { icon: SiGithub, color: '#E6EDF3' },
    'Flask': { icon: SiFlask, color: '#E6EDF3' },
    'FastAPI': { icon: SiFastapi, color: '#009688' },
    'Celery': { icon: SiCelery, color: '#A9CC54' },
    'RabbitMQ': { icon: SiRabbitmq, color: '#FF6600' },
};

function TechBadge({ tech }: { tech: string }) {
    const iconData = techIconMap[tech];
    return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 bg-ink border border-border rounded text-text-secondary hover:border-accent/40 hover:text-text-primary transition-colors">
            {iconData && <iconData.icon size={11} color={iconData.color} />}
            {tech}
        </span>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="card group flex flex-col hover:-translate-y-1 transition-transform duration-300"
        >
            {/* Image */}
            {project.image_url && (
                <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-lg">
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-display font-semibold text-lg text-text-primary group-hover:text-accent transition-colors">
                    {project.title}
                </h3>
                {project.is_featured && (
                    <span className="shrink-0 font-mono text-xs px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded">
                        Featured
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">
                {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech_stack.map(tech => (
                    <TechBadge key={tech} tech={tech} />
                ))}
            </div>

            {/* Links */}
            <div className="flex gap-4 pt-4 border-t border-border">
                {project.github_url && (

                    <a href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                    >
                        <FaGithub size={13} />
                        GitHub
                    </a>
                )}
                {project.live_url && (

                    <a href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                    >
                        <FaExternalLinkAlt size={11} />
                        Live Demo
                    </a>
                )
                }
            </div >
        </motion.div >
    );
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'featured'>('all');

    useEffect(() => {
        api.get<Project[]>('/projects/')
            .then(res => setProjects(res.data))
            .catch(() => setError('Failed to load projects. Make sure the backend is running.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'featured'
        ? projects.filter(p => p.is_featured)
        : projects;

    return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <p className="section-subtitle">Portfolio</p>
                <h1 className="section-title">My Projects</h1>
                <p className="text-text-secondary max-w-xl mt-3">
                    Production-grade systems built with Django, DRF, PostgreSQL, and modern tooling.
                </p>
            </motion.div>

            {/* Filter */}
            <div className="flex gap-3 mb-10">
                {(['all', 'featured'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`font-mono text-xs px-4 py-2 rounded border transition-colors ${filter === f
                            ? 'bg-accent text-ink border-accent'
                            : 'border-border text-text-secondary hover:border-accent/40 hover:text-text-primary'
                            }`}
                    >
                        {f === 'all' ? 'All Projects' : 'Featured'}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-48 bg-border rounded-lg mb-4 -mx-6 -mt-6" />
                            <div className="h-5 bg-border rounded mb-3 w-2/3" />
                            <div className="h-3 bg-border rounded mb-2" />
                            <div className="h-3 bg-border rounded w-4/5" />
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
            {!loading && !error && filtered.length === 0 && (
                <p className="text-text-secondary font-mono text-sm">
                    No projects found.
                </p>
            )}

            {/* Grid */}
            {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            )}
        </main>
    );
}