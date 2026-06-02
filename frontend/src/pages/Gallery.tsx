import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import type { GalleryImage } from '../types';

const categories = ['all', 'personal', 'work', 'event', 'other'];

function LightBox({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="relative max-w-4xl w-full"
                >
                    <img
                        src={image.image}
                        alt={image.title}
                        className="w-full max-h-[80vh] object-contain rounded-xl border border-border"
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-display font-semibold text-text-primary">{image.title}</h3>
                            <p className="font-mono text-xs text-text-secondary capitalize">{image.category}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="font-mono text-xs text-text-secondary hover:text-accent transition-colors border border-border px-3 py-1.5 rounded"
                        >
                            Close ✕
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selected, setSelected] = useState<GalleryImage | null>(null);

    useEffect(() => {
        api.get<GalleryImage[]>('/gallery/')
            .then(res => setImages(res.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all'
        ? images
        : images.filter(img => img.category === filter);

    return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <p className="section-subtitle">Photos</p>
                <h1 className="section-title">Gallery</h1>
                <p className="text-text-secondary max-w-xl mt-3">
                    A glimpse into my life and work.
                </p>
            </motion.div>

            {/* Filter */}
            <div className="flex flex-wrap gap-3 mb-10">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`font-mono text-xs px-4 py-2 rounded border transition-colors capitalize ${filter === cat
                            ? 'bg-accent text-ink border-accent'
                            : 'border-border text-text-secondary hover:border-accent/40 hover:text-text-primary'
                            }`}
                    >
                        {cat === 'all' ? 'All' : cat}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square bg-surface border border-border rounded-lg animate-pulse" />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
                <div className="card text-center py-12">
                    <p className="font-mono text-text-secondary text-sm">
                        No images found. Add some via the admin panel.
                    </p>
                </div>
            )}

            {/* Grid */}
            {!loading && filtered.length > 0 && (
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {filtered.map((img, i) => (
                        <motion.div
                            key={img.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelected(img)}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-border cursor-pointer hover:border-accent/40 transition-colors"
                        >
                            <img
                                src={img.image}
                                alt={img.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                <p className="font-mono text-xs text-text-primary">{img.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Lightbox */}
            {selected && <LightBox image={selected} onClose={() => setSelected(null)} />}
        </main>
    );
}