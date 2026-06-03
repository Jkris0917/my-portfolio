import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FaTrash, FaPlus } from 'react-icons/fa';
import api from '../../api/axios';
import type { Skill } from '../../types';
import Swal from 'sweetalert2';

const categoryOptions = [
    { value: 'languages', label: 'Languages & Frameworks' },
    { value: 'databases', label: 'Databases' },
    { value: 'auth', label: 'Auth & Security' },
    { value: 'queues', label: 'Task Queues' },
    { value: 'testing', label: 'Testing' },
    { value: 'devops', label: 'DevOps & Tools' },
    { value: 'ai', label: 'AI / ML' },
];

export default function SkillsManager() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState({ name: '', category: 'languages', order: 0 });
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        api.get<Skill[]>('/about/skills/')
            .then(res => setSkills(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await api.post<Skill>('/about/skills/', newSkill);
            setSkills(prev => [...prev, res.data]);
            setNewSkill({ name: '', category: 'languages', order: 0 });
            toast.success(`${res.data.name} added!`);
        } catch {
            toast.error('Failed to add skill.');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        const result = await Swal.fire({
            title: `Delete "${name}"?`,
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
            await api.delete(`/about/skills/${id}/`);
            setSkills(prev => prev.filter(s => s.id !== id));
            toast.success('Skill deleted.');
        } catch {
            toast.error('Failed to delete skill.');
        } finally {
            setDeleting(null);
        }
    };

    const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    const inputClass = "bg-ink border border-border rounded px-3 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent transition-colors";

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <p className="section-subtitle">Manage</p>
                <h2 className="section-title">Skills</h2>
            </div>

            {/* Add Skill Form */}
            <div className="card">
                <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-4">Add New Skill</h3>
                <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-32">
                        <label className="font-mono text-xs text-text-secondary mb-1 block">Name</label>
                        <input
                            type="text"
                            value={newSkill.name}
                            onChange={e => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Django"
                            required
                            className={`${inputClass} w-full`}
                        />
                    </div>
                    <div className="flex-1 min-w-40">
                        <label className="font-mono text-xs text-text-secondary mb-1 block">Category</label>
                        <select
                            value={newSkill.category}
                            onChange={e => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                            className={`${inputClass} w-full`}
                        >
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-20">
                        <label className="font-mono text-xs text-text-secondary mb-1 block">Order</label>
                        <input
                            type="number"
                            value={newSkill.order}
                            onChange={e => setNewSkill(prev => ({ ...prev, order: Number(e.target.value) }))}
                            min={0}
                            className={`${inputClass} w-full`}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={adding}
                        className="btn-primary py-2 disabled:opacity-50"
                    >
                        <FaPlus size={12} />
                        {adding ? 'Adding...' : 'Add'}
                    </button>
                </form>
            </div>

            {/* Skills List */}
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-border rounded" />)}
                </div>
            ) : (
                <div className="space-y-6">
                    {categoryOptions.map(cat => {
                        const items = grouped[cat.value] || [];
                        if (items.length === 0) return null;
                        return (
                            <div key={cat.value}>
                                <h3 className="font-mono text-xs text-accent tracking-wider uppercase mb-3">
                                    {cat.label}
                                </h3>
                                <div className="space-y-2">
                                    {items.map(skill => (
                                        <div key={skill.id} className="card py-3 flex items-center justify-between">
                                            <span className="font-mono text-sm text-text-primary">{skill.name}</span>
                                            <button
                                                onClick={() => handleDelete(skill.id, skill.name)}
                                                disabled={deleting === skill.id}
                                                className="text-text-secondary hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
