import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import api from '../../api/axios';
import type { Certificate } from '../../types';
import Swal from 'sweetalert2';

const emptyForm = {
    title: '',
    issuer: '',
    date_issued: '',
    credential_url: '',
    order: 0,
};

export default function CertificatesManager() {
    const [certs, setCerts] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        api.get<Certificate[]>('/certificates/')
            .then(res => setCerts(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleEdit = (cert: Certificate) => {
        setEditId(cert.id);
        setForm({
            title: cert.title,
            issuer: cert.issuer,
            date_issued: cert.date_issued,
            credential_url: cert.credential_url || '',
            order: cert.order,
        });
        if (cert.image) setImagePreview(cert.image);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
        if (image) formData.append('image', image);

        try {
            if (editId) {
                const res = await api.put<Certificate>(`/certificates/${editId}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setCerts(prev => prev.map(c => c.id === editId ? res.data : c));
                toast.success('Certificate updated!');
            } else {
                const res = await api.post<Certificate>('/certificates/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setCerts(prev => [...prev, res.data]);
                toast.success('Certificate added!');
            }
            setForm(emptyForm);
            setImage(null);
            setImagePreview(null);
            setEditId(null);
            setShowForm(false);
        } catch {
            toast.error('Failed to save.');
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
            await api.delete(`/certificates/${id}/`);
            setCerts(prev => prev.filter(c => c.id !== id));
            toast.success('Certificate deleted.');
        } catch {
            toast.error('Failed to delete certificate.');
        } finally {
            setDeleting(null);
        }
    };

    const inputClass = "w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent transition-colors";

    return (
        <div className="max-w-2xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="section-subtitle">Manage</p>
                    <h2 className="section-title">Certificates</h2>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); setImagePreview(null); }}
                    className="btn-primary py-2"
                >
                    <FaPlus size={12} />
                    Add
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card">
                    <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-4">
                        {editId ? 'Edit Certificate' : 'New Certificate'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-mono text-xs text-text-secondary mb-1 block">Title</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Issuer</label>
                                <input type="text" name="issuer" value={form.issuer} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Date Issued</label>
                                <input type="date" name="date_issued" value={form.date_issued} onChange={handleChange} required className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="font-mono text-xs text-text-secondary mb-1 block">Credential URL</label>
                            <input type="url" name="credential_url" value={form.credential_url} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="font-mono text-xs text-text-secondary mb-1 block">Image</label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview"
                                    className="w-full h-40 object-cover rounded-lg border border-border mb-2" />
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange}
                                className="w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-secondary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:font-mono file:text-xs file:bg-accent file:text-ink cursor-pointer" />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={saving} className="btn-primary py-2 disabled:opacity-50">
                                {saving ? 'Saving...' : editId ? 'Save Changes →' : 'Add Certificate →'}
                            </button>
                            <button type="button"
                                onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); setImagePreview(null); }}
                                className="btn-outline py-2">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-border rounded" />)}
                </div>
            ) : certs.length === 0 ? (
                <div className="card text-center py-8">
                    <p className="font-mono text-text-secondary text-sm">No certificates yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certs.map(cert => (
                        <div key={cert.id} className="card group">
                            {cert.image && (
                                <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
                                    <img src={cert.image} alt={cert.title}
                                        className="w-full h-36 object-cover" />
                                </div>
                            )}
                            <h3 className="font-display font-semibold text-text-primary text-sm mb-1">{cert.title}</h3>
                            <p className="font-mono text-xs text-accent">{cert.issuer}</p>
                            <p className="font-mono text-xs text-text-secondary mt-0.5">
                                {new Date(cert.date_issued).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </p>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                                <button onClick={() => handleEdit(cert)}
                                    className="text-text-secondary hover:text-accent transition-colors p-1">
                                    <FaEdit size={13} />
                                </button>
                                <button onClick={() => handleDelete(cert.id, cert.title)}
                                    disabled={deleting === cert.id}
                                    className="text-text-secondary hover:text-red-400 transition-colors p-1">
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

