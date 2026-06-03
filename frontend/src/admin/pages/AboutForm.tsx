import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';
import type { About } from '../../types';

export default function AboutForm() {
    const [form, setForm] = useState({
        full_name: '',
        tagline: '',
        bio: '',
        location: '',
        target: '',
        education: '',
        japanese_level: '',
        status: '',
        email: '',
        github_url: '',
        linkedin_url: '',
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [cv, setCv] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [cvName, setCvName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [aboutId, setAboutId] = useState<number | null>(null);

    useEffect(() => {
        api.get<About>('/about/')
            .then(res => {
                const d = res.data;
                setAboutId(d.id);
                setForm({
                    full_name: d.full_name,
                    tagline: d.tagline,
                    bio: d.bio,
                    location: d.location,
                    target: d.target,
                    education: d.education,
                    japanese_level: d.japanese_level,
                    status: d.status,
                    email: d.email,
                    github_url: d.github_url,
                    linkedin_url: d.linkedin_url,
                });
                if (d.photo_url) setPhotoPreview(d.photo_url);
            })
            .catch(() => { })
            .finally(() => setFetching(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCv(file);
        setCvName(file.name);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        if (photo) formData.append('photo', photo);
        if (cv) formData.append('cv', cv);
        formData.append('is_active', 'true');

        try {
            if (aboutId) {
                await api.put(`/about/${aboutId}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post('/about/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            toast.success('About updated successfully!');
        } catch {
            toast.error('Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors";

    if (fetching) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-border rounded w-1/4" />
                <div className="h-12 bg-border rounded" />
                <div className="h-32 bg-border rounded" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <p className="section-subtitle">Manage</p>
                <h2 className="section-title">About</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Photo */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        Profile Photo
                    </label>
                    {photoPreview && (
                        <img src={photoPreview} alt="Preview"
                            className="w-24 h-24 object-cover rounded-xl border border-border mb-3" />
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoChange}
                        className="w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-secondary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:font-mono file:text-xs file:bg-accent file:text-ink cursor-pointer" />
                </div>

                {/* CV */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        CV / Resume (PDF)
                    </label>
                    {cvName && <p className="font-mono text-xs text-accent mb-2">Selected: {cvName}</p>}
                    <input type="file" accept=".pdf" onChange={handleCvChange}
                        className="w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-secondary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:font-mono file:text-xs file:bg-accent file:text-ink cursor-pointer" />
                </div>

                {/* Full Name */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">Full Name</label>
                    <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className={inputClass} />
                </div>

                {/* Tagline */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">Tagline</label>
                    <input type="text" name="tagline" value={form.tagline} onChange={handleChange} className={inputClass} />
                </div>

                {/* Bio */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">Bio</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
                        className={`${inputClass} resize-none`} />
                </div>

                {/* Grid fields */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { name: 'location', label: 'Location' },
                        { name: 'target', label: 'Target' },
                        { name: 'education', label: 'Education' },
                        { name: 'japanese_level', label: 'Japanese Level' },
                        { name: 'status', label: 'Status' },
                        { name: 'email', label: 'Email' },
                    ].map(field => (
                        <div key={field.name}>
                            <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                {field.label}
                            </label>
                            <input type="text" name={field.name}
                                value={form[field.name as keyof typeof form]}
                                onChange={handleChange}
                                className={inputClass} />
                        </div>
                    ))}
                </div>

                {/* URLs */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">GitHub URL</label>
                    <input type="url" name="github_url" value={form.github_url} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">LinkedIn URL</label>
                    <input type="url" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} className={inputClass} />
                </div>

                <button type="submit" disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Saving...' : 'Save Changes →'}
                </button>

            </form>
        </div>
    );
}