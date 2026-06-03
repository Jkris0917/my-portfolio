import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import {
    SiPython, SiDjango, SiPostgresql, SiDocker,
    SiRedis, SiReact, SiTypescript, SiFlask,
    SiFastapi, SiCelery, SiGithub,
} from 'react-icons/si';
import api from '../api/axios';
import type { About, Skill, Experience } from '../types';

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
};

const categoryLabels: Record<string, string> = {
    languages: 'Languages & Frameworks',
    databases: 'Databases',
    auth: 'Auth & Security',
    queues: 'Task Queues',
    testing: 'Testing',
    devops: 'DevOps & Tools',
    ai: 'AI / ML',
};

export default function About() {
    const [about, setAbout] = useState<About | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [experience, setExperience] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get<About>('/about/'),
            api.get<Skill[]>('/about/skills/'),
            api.get<Experience[]>('/about/experience/'),
        ]).then(([aboutRes, skillsRes, expRes]) => {
            setAbout(aboutRes.data);
            setSkills(skillsRes.data);
            setExperience(expRes.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-border rounded w-1/4" />
                    <div className="h-4 bg-border rounded w-3/4" />
                    <div className="h-4 bg-border rounded w-2/3" />
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Bio */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="section-subtitle">About Me</p>
                        <h1 className="section-title">Background</h1>
                        <div className="space-y-4 text-text-secondary leading-relaxed mt-6">
                            {about?.bio ? (
                                about.bio.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))
                            ) : (
                                <p>Python Backend Developer based in Cebu, Philippines.</p>
                            )}
                        </div>
                    </motion.section>

                    {/* Skills */}
                    {Object.keys(groupedSkills).length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="section-subtitle">Skills</p>
                            <h2 className="font-display font-bold text-2xl text-text-primary mb-8">Tech Stack</h2>
                            <div className="space-y-6">
                                {Object.entries(groupedSkills).map(([category, items]) => (
                                    <div key={category}>
                                        <h3 className="font-mono text-xs text-accent tracking-wider uppercase mb-3">
                                            {categoryLabels[category] || category}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {items.map(skill => {
                                                const iconData = techIconMap[skill.name];
                                                return (
                                                    <span
                                                        key={skill.id}
                                                        className="inline-flex items-center gap-1.5 font-mono text-sm px-3 py-1.5 bg-surface border border-border rounded text-text-secondary hover:border-accent/40 hover:text-text-primary transition-colors cursor-default"
                                                    >
                                                        {iconData && <iconData.icon size={13} color={iconData.color} />}
                                                        {skill.name}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="section-subtitle">Career</p>
                            <h2 className="font-display font-bold text-2xl text-text-primary mb-8">Experience</h2>
                            <div className="space-y-6">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={exp.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="card border-l-2 border-l-accent"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h3 className="font-display font-semibold text-text-primary">{exp.role}</h3>
                                                <p className="font-mono text-xs text-accent mt-0.5">{exp.company}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-mono text-xs text-text-secondary">{exp.period}</p>
                                                <p className="font-mono text-xs text-text-secondary">{exp.location}</p>
                                            </div>
                                        </div>
                                        {exp.description && (
                                            <p className="text-text-secondary text-sm leading-relaxed mt-3">{exp.description}</p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Currently Learning */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Growth</p>
                        <h2 className="font-display font-bold text-2xl text-text-primary mb-6">Currently Learning</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: '☁️', title: 'AWS', desc: 'EC2, S3, RDS for cloud deployment' },
                                { icon: '🏗️', title: 'System Design', desc: 'Scalability patterns and architecture' },
                                { icon: '🐘', title: 'Advanced PostgreSQL', desc: 'Indexing and query optimization' },
                            ].map(item => (
                                <div key={item.title} className="card">
                                    <div className="text-2xl mb-3">{item.icon}</div>
                                    <h4 className="font-display font-semibold text-text-primary mb-1">{item.title}</h4>
                                    <p className="font-mono text-xs text-text-secondary">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Photo */}
                    {about?.photo_url && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-2xl scale-110" />
                            <img
                                src={about.photo_url}
                                alt={about.full_name}
                                className="relative w-full aspect-square object-cover rounded-2xl border-2 border-border"
                            />
                        </motion.div>
                    )}

                    {/* Quick Info */}
                    <div className="card">
                        <h3 className="font-mono text-xs text-accent tracking-wider uppercase mb-4">Quick Info</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Location', value: about?.location || 'Cebu, Philippines' },
                                { label: 'Target', value: about?.target || 'Japan (Tokyo)' },
                                { label: 'Education', value: about?.education || 'BSIT — Magna Cum Laude' },
                                { label: 'Japanese', value: about?.japanese_level || 'Studying for JLPT N4' },
                                { label: 'Status', value: about?.status || 'Open to opportunities' },
                            ].map(item => (
                                <div key={item.label} className="flex justify-between gap-4">
                                    <span className="font-mono text-xs text-text-secondary">{item.label}</span>
                                    <span className="font-mono text-xs text-text-primary text-right">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="card">
                        <h3 className="font-mono text-xs text-accent tracking-wider uppercase mb-4">Links</h3>
                        <div className="space-y-2">
                            {about?.github_url && (
                                <a href={about.github_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors py-1">
                                    <FaGithub size={13} /> GitHub
                                </a>
                            )}
                            {about?.linkedin_url && (
                                <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors py-1">
                                    <FaLinkedin size={13} /> LinkedIn
                                </a>
                            )}
                            {about?.email && (
                                <a href={`mailto:${about.email}`}
                                    className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors py-1">
                                    <FaEnvelope size={13} /> {about.email}
                                </a>
                            )}
                            {about?.cv_url && (
                                <a href={about.cv_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 font-mono text-xs text-accent hover:underline transition-colors py-1">
                                    <FaDownload size={13} /> Download CV
                                </a>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}