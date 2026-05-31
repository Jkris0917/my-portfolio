import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Project } from '../../types';

interface ProjectFormData {
    title: string;
    description: string;
    tech_stack: string;
    live_url: string;
    github_url: string;
    is_featured: boolean;
    order: number;
}

const emptyForm: ProjectFormData = {
    title: '',
    description: '',
    tech_stack: '',
    live_url: '',
    github_url: '',
    is_featured: false,
    order: 0,
};

export default function ProjectForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState<ProjectFormData>(emptyForm);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (!isEdit) return;
        api.get<Project>(`/projects/${id}/`)
            .then(res => {
                const p = res.data;
                setForm({
                    title: p.title,
                    description: p.description,
                    tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '',
                    live_url: p.live_url || '',
                    github_url: p.github_url || '',
                    is_featured: p.is_featured,
                    order: p.order,
                });
                if (p.image_url) setImagePreview(p.image_url);
            })
            .finally(() => setFetching(false));
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setForm(prev => ({ ...prev, [target.name]: value }));
        setErrors(prev => ({ ...prev, [target.name]: [] }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Use FormData to support file upload
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('live_url', form.live_url);
        formData.append('github_url', form.github_url);
        formData.append('is_featured', String(form.is_featured));
        formData.append('order', String(form.order));

        // Convert comma separated tech stack to JSON array
        const techArray = form.tech_stack
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
        formData.append('tech_stack', JSON.stringify(techArray));

        if (image) {
            formData.append('image', image);
        }

        try {
            if (isEdit) {
                await api.put(`/projects/${id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post('/projects/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/admin-panel/projects');
        } catch (err: any) {
            if (err.response?.data) {
                setErrors(err.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (name: string) =>
        `w-full bg-ink border rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors ${errors[name] ? 'border-red-500/60' : 'border-border'
        }`;

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
        <div className="space-y-6 max-w-2xl">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    to="/admin-panel/projects"
                    className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                >
                    ← Back
                </Link>
                <div>
                    <p className="section-subtitle">{isEdit ? 'Edit' : 'New'}</p>
                    <h2 className="section-title">
                        {isEdit ? 'Edit Project' : 'Add Project'}
                    </h2>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Title */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Project title"
                        required
                        className={inputClass('title')}
                    />
                    {errors.title && (
                        <p className="font-mono text-xs text-red-400 mt-1">{errors.title[0]}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the project..."
                        rows={4}
                        className={`${inputClass('description')} resize-none`}
                    />
                    {errors.description && (
                        <p className="font-mono text-xs text-red-400 mt-1">{errors.description[0]}</p>
                    )}
                </div>

                {/* Tech Stack */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        Tech Stack
                        <span className="normal-case ml-2 text-text-secondary/60">
                            (comma separated)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="tech_stack"
                        value={form.tech_stack}
                        onChange={handleChange}
                        placeholder="Django, DRF, PostgreSQL, Docker"
                        className={inputClass('tech_stack')}
                    />
                </div>

                {/* Live URL */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        Live URL
                    </label>
                    <input
                        type="url"
                        name="live_url"
                        value={form.live_url}
                        onChange={handleChange}
                        placeholder="https://..."
                        className={inputClass('live_url')}
                    />
                </div>

                {/* GitHub URL */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        GitHub URL
                    </label>
                    <input
                        type="url"
                        name="github_url"
                        value={form.github_url}
                        onChange={handleChange}
                        placeholder="https://github.com/..."
                        className={inputClass('github_url')}
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                        Project Image
                    </label>

                    {/* Preview */}
                    {imagePreview && (
                        <div className="mb-3">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded border border-border"
                            />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-secondary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:font-mono file:text-xs file:bg-accent file:text-ink hover:file:opacity-90 cursor-pointer"
                    />
                </div>

                {/* Order + Featured */}
                <div className="flex gap-6 items-center">
                    <div className="w-32">
                        <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                            Order
                        </label>
                        <input
                            type="number"
                            name="order"
                            value={form.order}
                            onChange={handleChange}
                            min={0}
                            className={inputClass('order')}
                        />
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                        <input
                            type="checkbox"
                            name="is_featured"
                            id="is_featured"
                            checked={form.is_featured}
                            onChange={handleChange}
                            className="w-4 h-4 accent-accent"
                        />
                        <label
                            htmlFor="is_featured"
                            className="font-mono text-sm text-text-secondary cursor-pointer"
                        >
                            Featured project
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : isEdit ? 'Save Changes →' : 'Add Project →'}
                    </button>
                    <Link to="/admin-panel/projects" className="btn-outline">
                        Cancel
                    </Link>
                </div>

            </form>
        </div>
    );
}