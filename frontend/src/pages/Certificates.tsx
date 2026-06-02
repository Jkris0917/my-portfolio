import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import api from '../api/axios';
import type { Certificate } from '../types';

function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="card group hover:-translate-y-1 transition-transform duration-300"
        >
            {/* Image */}
            {cert.image && (
                <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-lg">
                    <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {cert.title}
                </h3>
                {cert.credential_url && (
                    <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-accent hover:opacity-80 transition-opacity"
                    >
                        <FaExternalLinkAlt size={13} />
                    </a>
                )}
            </div>

            <p className="font-mono text-xs text-accent mb-1">{cert.issuer}</p>
            <p className="font-mono text-xs text-text-secondary">
                {new Date(cert.date_issued).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                })}
            </p>
        </motion.div >
    );
}

export default function Certificates() {
    const [certs, setCerts] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Certificate[]>('/certificates/')
            .then(res => setCerts(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <p className="section-subtitle">Achievements</p>
                <h1 className="section-title">Certificates</h1>
                <p className="text-text-secondary max-w-xl mt-3">
                    Certifications and courses I've completed.
                </p>
            </motion.div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-44 bg-border rounded-lg mb-4 -mx-6 -mt-6" />
                            <div className="h-5 bg-border rounded mb-2 w-3/4" />
                            <div className="h-3 bg-border rounded w-1/2" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && certs.length === 0 && (
                <div className="card text-center py-12">
                    <p className="font-mono text-text-secondary text-sm">
                        No certificates yet. Add some via the admin panel.
                    </p>
                </div>
            )}

            {/* Grid */}
            {!loading && certs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certs.map((cert, i) => (
                        <CertificateCard key={cert.id} cert={cert} index={i} />
                    ))}
                </div>
            )}
        </main>
    );
}