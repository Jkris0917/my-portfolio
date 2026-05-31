import { Link } from 'react-router-dom';

const featuredTech = [
    'Python', 'Django', 'DRF', 'PostgreSQL',
    'Celery', 'Redis', 'Docker', 'React', 'TypeScript',
];

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 pt-40 pb-32">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="font-mono text-xs text-text-secondary">
                            Open to backend roles — local &amp; remote (Japan preferred)
                        </span>
                    </div>

                    {/* Name */}
                    <h1 className="font-display font-bold text-5xl md:text-7xl text-text-primary leading-none mb-6">
                        John Kris
                        <br />
                        <span className="text-accent">Gellado</span>
                    </h1>

                    {/* Title */}
                    <p className="font-mono text-muted text-lg md:text-xl mb-6 leading-relaxed">
                        Python Backend Developer —{' '}
                        <span className="text-text-primary">Django · DRF · PostgreSQL</span>
                    </p>

                    {/* Bio */}
                    <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-2xl">
                        I build production-grade REST APIs with authentication, role-based permissions,
                        background task processing, and automated testing. Based in Cebu, Philippines.
                        Magna Cum Laude, BSIT.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 mb-16">
                        <Link to="/projects" className="btn-primary">
                            View My Work →
                        </Link>
                        <Link to="/contact" className="btn-outline">
                            Get In Touch
                        </Link>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2">
                        {featuredTech.map(tech => (
                            <span
                                key={tech}
                                className="font-mono text-xs px-3 py-1.5 bg-surface border border-border rounded text-text-secondary"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-border bg-surface/50">
                <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: '4+', label: 'Public Projects' },
                        { value: '16+', label: 'Automated Tests' },
                        { value: 'N4', label: 'JLPT Target' },
                        { value: 'Magna', label: 'Cum Laude' },
                    ].map(stat => (
                        <div key={stat.label} className="text-center">
                            <div className="font-display font-bold text-4xl text-accent mb-1">{stat.value}</div>
                            <div className="font-mono text-text-secondary text-xs tracking-wider uppercase">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}