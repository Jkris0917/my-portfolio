import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FaTrash, FaPlus, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../../api/axios';
import type { Experience } from '../../types';

const emptyForm = {
    role: '',
    company: '',
    period: '',
    location: '',
    description: '',
    order: 0,
};

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get<Experience[]>('/about/experience/')
            .then(res => setExperiences(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEdit = (exp: Experience) => {
        setEditId(exp.id);
        setForm({
            role: exp.role,
            company: exp.company,
            period: exp.period,
            location: exp.location,
            description: exp.description,
            order: exp.order,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) {
                const res = await api.put<Experience>(`/about/experience/${editId}/`, form);
                setExperiences(prev => prev.map(e => e.id === editId ? res.data : e));
                toast.success('Experience updated!');
            } else {
                const res = await api.post<Experience>('/about/experience/', form);
                setExperiences(prev => [...prev, res.data]);
                toast.success('Experience added!');
            }
            setForm(emptyForm);
            setEditId(null);
            setShowForm(false);
        } catch {
            toast.error('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number, role: string) => {
        if (!confirm(`Delete "${role}"?`)) return;
        try {
            await api.delete(`/about/experience/${id}/`);
            setExperiences(prev => prev.filter(e => e.id !== id));
            toast.success('Experience deleted.');
        } catch {
            toast.error('Failed to delete.');
        }
    };

    const inputClass = "w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent transition-colors";

    return (
        <div className="max-w-2xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="section-subtitle">Manage</p>
                    <h2 className="section-title">Experience</h2>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
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
                        {editId ? 'Edit Experience' : 'New Experience'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Role</label>
                                <input type="text" name="role" value={form.role} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Company</label>
                                <input type="text" name="company" value={form.company} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Period</label>
                                <input type="text" name="period" value={form.period} onChange={handleChange} placeholder="2024 — Present" className={inputClass} />
                            </div>
                            <div>
                                <label className="font-mono text-xs text-text-secondary mb-1 block">Location</label>
                                <input type="text" name="location" value={form.location} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="font-mono text-xs text-text-secondary mb-1 block">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={saving} className="btn-primary py-2 disabled:opacity-50">
                                <FaCheck size={12} />
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} className="btn-outline py-2">
                                <FaTimes size={12} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-border rounded" />)}
                </div>
            ) : experiences.length === 0 ? (
                <div className="card text-center py-8">
                    <p className="font-mono text-text-secondary text-sm">No experience added yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map(exp => (
                        <div key={exp.id} className="card">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-display font-semibold text-text-primary">{exp.role}</h3>
                                    <p className="font-mono text-xs text-accent mt-0.5">{exp.company}</p>
                                    <p className="font-mono text-xs text-text-secondary mt-0.5">{exp.period} · {exp.location}</p>
                                    {exp.description && (
                                        <p className="text-text-secondary text-sm mt-2">{exp.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleEdit(exp)} className="text-text-secondary hover:text-accent transition-colors p-1">
                                        <FaEdit size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(exp.id, exp.role)} className="text-text-secondary hover:text-red-400 transition-colors p-1">
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}