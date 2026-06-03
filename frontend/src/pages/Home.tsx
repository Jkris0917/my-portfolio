import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    SiPython, SiPostgresql, SiDocker,
    SiRedis, SiReact, SiTypescript, SiGithub,
    SiDjango, SiCelery,
} from 'react-icons/si';
import api from '../api/axios';
import type { About } from '../types';

const techIcons = [
    { icon: SiPython, label: 'Python', color: '#3776AB' },
    { icon: SiPostgresql, label: 'PostgreSQL', color: '#336791' },
    { icon: SiDocker, label: 'Docker', color: '#2496ED' },
    { icon: SiRedis, label: 'Redis', color: '#DC382D' },
    { icon: SiReact, label: 'React', color: '#61DAFB' },
    { icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
    { icon: SiGithub, label: 'GitHub', color: '#E6EDF3' },
    { icon: SiDjango, label: 'Django', color: '#092E20' },
    { icon: SiCelery, label: 'Celery', color: '#3776AB' },
];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
    }),
};

function TypeWriter({ texts }: { texts: string[] }) {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = texts[index];
        let timeout: ReturnType<typeof setTimeout>;

        if (!deleting && displayed.length < current.length) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
        } else if (!deleting && displayed.length === current.length) {
            timeout = setTimeout(() => setDeleting(true), 2000);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setIndex((index + 1) % texts.length);
        }

        return () => clearTimeout(timeout);
    }, [displayed, deleting, index, texts]);

    return (
        <span className="text-accent">
            {displayed}
            <span className="animate-pulse">|</span>
        </span>
    );
}

export default function Home() {
    const [about, setAbout] = useState<About | null>(null);

    useEffect(() => {
        api.get<About>('/about/').then(res => setAbout(res.data)).catch(() => { });
    }, []);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 pt-36 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — Text */}
                    <div>
                        {/* Badge */}
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="font-mono text-xs text-text-secondary">
                                Open to backend roles — local &amp; remote (Japan preferred)
                            </span>
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="font-display font-bold text-5xl md:text-6xl text-text-primary leading-none mb-4"
                        >
                            {about?.full_name.split(' ').slice(0, 2).join(' ') || 'John Kris'}
                            <br />
                            <span className="text-accent">
                                {about?.full_name.split(' ').slice(2).join(' ') || 'Gellado'}
                            </span>
                        </motion.h1>

                        {/* Typewriter */}
                        <motion.div
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="font-mono text-lg md:text-xl text-muted mb-6 h-8"
                        >
                            <TypeWriter texts={[
                                'Python Backend Developer',
                                'Django + DRF Engineer',
                                'PostgreSQL Specialist',
                                'Open to Japan Opportunities',
                            ]} />
                        </motion.div>

                        {/* Bio */}
                        <motion.p
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="text-text-secondary text-lg leading-relaxed mb-10 max-w-xl"
                        >
                            {about?.bio?.slice(0, 200) || 'I build production-grade REST APIs with authentication, role-based permissions, background task processing, and automated testing.'}
                            {about?.bio && about.bio.length > 200 ? '...' : ''}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="flex flex-wrap gap-4 mb-12"
                        >
                            <Link to="/projects" className="btn-primary">
                                View My Work →
                            </Link>
                            <Link to="/contact" className="btn-outline">
                                Get In Touch
                            </Link>
                            {about?.cv_url && (

                                <a href={about.cv_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline"
                                >
                                    Download CV ↓
                                </a>
                            )}
                        </motion.div>

                        {/* Tech Icons */}
                        <motion.div
                            custom={5}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="flex flex-wrap gap-4"
                        >
                            {techIcons.map(({ icon: Icon, label, color }) => (
                                <div
                                    key={label}
                                    className="group flex flex-col items-center gap-1 cursor-default"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center bg-surface border border-border rounded-lg group-hover:border-accent/40 transition-all duration-200 group-hover:-translate-y-1">
                                        <Icon size={20} color={color} />
                                    </div>
                                    <span className="font-mono text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — Photo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="hidden lg:flex justify-center items-center"
                    >
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-3xl scale-110" />

                            {/* Photo */}
                            <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-2 border-border">
                                {about?.photo_url ? (
                                    <img
                                        src={about.photo_url}
                                        alt={about.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface flex items-center justify-center">
                                        <span className="font-display text-6xl font-bold text-accent">JK</span>
                                    </div>
                                )}
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -right-4 bg-surface border border-border rounded-xl px-4 py-2">
                                <div className="font-mono text-xs text-text-secondary">Based in</div>
                                <div className="font-display font-semibold text-text-primary text-sm">
                                    {about?.location || 'Cebu, PH'}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-border bg-surface/50">
                <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: '1+', label: 'Year Experience' },
                        { value: '4+', label: 'Projects Shipped' },
                        { value: 'N4', label: 'JLPT Target' },
                        { value: 'Magna', label: 'Cum Laude' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className="font-display font-bold text-4xl text-accent mb-1">{stat.value}</div>
                            <div className="font-mono text-text-secondary text-xs tracking-wider uppercase">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* GitHub Activity */}
            <section className="max-w-6xl mx-auto px-6 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="section-subtitle">Activity</p>
                    <h2 className="section-title mb-8">GitHub Contributions</h2>

                    <a href="https://github.com/Jkris0917"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                        <img
                            src="https://ghchart.rshah.org/00C7BE/Jkris0917"
                            alt="GitHub contribution chart"
                            className="mx-auto rounded-lg border border-border opacity-80 hover:opacity-100 transition-opacity"
                        />
                    </a>
                </motion.div>
            </section >
        </main >
    );
}