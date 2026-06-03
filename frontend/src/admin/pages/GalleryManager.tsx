import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FaTrash, FaPlus } from 'react-icons/fa';
import api from '../../api/axios';
import type { GalleryImage } from '../../types';
import Swal from 'sweetalert2';

const categoryOptions = ['personal', 'work', 'event', 'other'];

const emptyForm = {
    title: '',
    category: 'personal',
    order: 0,
};

export default function GalleryManager() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get<GalleryImage[]>('/gallery/')
            .then(res => setImages(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!image) { toast.error('Please select an image.'); return; }
        setSaving(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
        formData.append('image', image);

        try {
            const res = await api.post<GalleryImage>('/gallery/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImages(prev => [...prev, res.data]);
            setForm(emptyForm);
            setImage(null);
            setImagePreview(null);
            setShowForm(false);
            toast.success('Image added!');
        } catch {
            toast.error('Failed to add image.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        const result = await Swal.fire({
            title: `Delete "${title}"?`,
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            background: '#161B22',
            color: '#E6EDF3',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#21262D',
            iconColor: '#f59e0b',
        });

        if (!result.isConfirmed) return;
        setDeleting(id);
        try {
            await api.delete(`/gallery/${id}/`);
            setImages(prev => prev.filter(m => m.id !== id));
            toast.success('Image deleted.');
        } catch {
            toast.error('Failed to delete image.');
        } finally {
            setDeleting(null);
        }
    };

    const filtered = filter === 'all' ? images : images.filter(i => i.category === filter);

    const inputClass = "w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent transition-colors";

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="section-subtitle">Manage</p>
                    <h2 className="section-title">Gallery</h2>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setForm(emptyForm); setImagePreview(null); }}
                    className="btn-primary py-2"
                >
                    <FaPlus size={12} />
                    Add Image
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card max-w-md">
                    <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-4">New Image</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-mono text-xs text-text-secondary mb-1 block">Title</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Category</label>
                                <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                                    {categoryOptions.map(cat => (
                                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Order</label>
                                <input type="number" name="order" value={form.order} onChange={handleChange} min={0} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="font-mono text-xs text-text-secondary mb-1 block">Image</label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview"
                                    className="w-full h-40 object-cover rounded-lg border border-border mb-2" />
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} required
                                className="w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-secondary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:font-mono file:text-xs file:bg-accent file:text-ink cursor-pointer" />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={saving} className="btn-primary py-2 disabled:opacity-50">
                                {saving ? 'Uploading...' : 'Add Image →'}
                            </button>
                            <button type="button"
                                onClick={() => { setShowForm(false); setImagePreview(null); }}
                                className="btn-outline py-2">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter */}
            <div className="flex flex-wrap gap-3">
                {['all', ...categoryOptions].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`font-mono text-xs px-4 py-2 rounded border transition-colors capitalize ${filter === cat
                            ? 'bg-accent text-ink border-accent'
                            : 'border-border text-text-secondary hover:border-accent/40'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-border rounded" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="card text-center py-8">
                    <p className="font-mono text-text-secondary text-sm">No images yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map(img => (
                        <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                            <img src={img.image_url} alt={img.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-3">
                                <p className="font-mono text-xs text-text-primary text-center">{img.title}</p>
                                <button
                                    onClick={() => handleDelete(img.id, img.title)}
                                    disabled={deleting === img.id}
                                    className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

