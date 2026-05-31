const skills = {
    'Languages & Frameworks': ['Python', 'Django', 'DRF', 'Flask', 'FastAPI', 'React', 'TypeScript'],
    'Databases': ['PostgreSQL', 'SQLAlchemy', 'SQLite', 'ChromaDB'],
    'Auth & Security': ['JWT', 'Token Auth', 'RBAC', 'OAuth2'],
    'Task Queues': ['Celery', 'Redis'],
    'Testing': ['pytest', 'pytest-django', 'unittest'],
    'DevOps & Tools': ['Docker', 'Docker Compose', 'GitHub Actions', 'Railway', 'Git'],
    'AI / ML': ['LangChain', 'Sentence Transformers', 'RAG', 'Groq'],
};

export default function About() {
    return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Bio */}
                    <section>
                        <p className="section-subtitle">About Me</p>
                        <h1 className="section-title">Background</h1>
                        <div className="space-y-4 text-text-secondary leading-relaxed mt-6">
                            <p>
                                I'm John Kris Gellado — a Python Backend Developer based in Cebu, Philippines,
                                with a <span className="text-text-primary font-medium">Magna Cum Laude</span> degree
                                in Information Technology.
                            </p>
                            <p>
                                I specialize in building production-grade REST APIs using Django and Django REST
                                Framework, with a strong focus on authentication systems, role-based access control,
                                background task processing with Celery + Redis, and automated testing with pytest.
                            </p>
                            <p>
                                Beyond the backend, I've been expanding into full-stack territory — building
                                AI-powered applications with LangChain, React frontends, and exploring AWS
                                infrastructure. I'm currently studying for JLPT N4 and actively seeking
                                opportunities to work in Japan.
                            </p>
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <p className="section-subtitle">Skills</p>
                        <h2 className="font-display font-bold text-2xl text-text-primary mb-8">Tech Stack</h2>
                        <div className="space-y-6">
                            {Object.entries(skills).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="font-mono text-xs text-accent tracking-wider uppercase mb-3">
                                        {category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {items.map(skill => (
                                            <span
                                                key={skill}
                                                className="font-mono text-sm px-3 py-1.5 bg-surface border border-border rounded text-text-secondary hover:border-accent/40 hover:text-text-primary transition-colors cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Currently Learning */}
                    <section>
                        <p className="section-subtitle">Growth</p>
                        <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
                            Currently Learning
                        </h2>
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
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-8">

                    {/* Quick Info */}
                    <div className="card">
                        <h3 className="font-mono text-xs text-accent tracking-wider uppercase mb-4">
                            Quick Info
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Location', value: 'Cebu, Philippines' },
                                { label: 'Target', value: 'Japan (Tokyo)' },
                                { label: 'Education', value: 'BSIT — Magna Cum Laude' },
                                { label: 'Japanese', value: 'Studying for JLPT N4' },
                                { label: 'Status', value: 'Open to opportunities' },
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
                        <h3 className="font-mono text-xs text-accent tracking-wider uppercase mb-4">
                            Links
                        </h3>
                        <div className="space-y-2">
                            {[
                                { label: 'GitHub', url: 'https://github.com/Jkris0917' },
                                { label: 'LinkedIn', url: 'https://linkedin.com/in/john-kris-gellado-792a8235b' },
                                { label: 'Portfolio', url: 'https://johnkris-portfolio.vercel.app/' },
                                { label: 'Task Manager API', url: 'https://task-manager-api-production-d89b.up.railway.app/api/docs/' },
                            ].map(link => (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-between items-center font-mono text-xs text-text-secondary hover:text-accent transition-colors py-1"
                                >
                                    <span>{link.label}</span>
                                    <span>↗</span>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main >
    );
}