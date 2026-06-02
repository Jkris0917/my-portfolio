import { useState } from 'react';
import { toast } from 'sonner';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';

export default function ChangePassword() {
    const [form, setForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [show, setShow] = useState({
        old: false,
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.new_password !== form.confirm_password) {
            toast.error('New passwords do not match.');
            return;
        }

        if (form.new_password.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password/', {
                old_password: form.old_password,
                new_password: form.new_password,
            });
            toast.success('Password changed successfully!');
            setForm({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'Failed to change password.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-ink border border-border rounded-lg pl-10 pr-12 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent transition-colors";

    const fields = [
        { name: 'old_password', label: 'Current Password', showKey: 'old' as const },
        { name: 'new_password', label: 'New Password', showKey: 'new' as const },
        { name: 'confirm_password', label: 'Confirm New Password', showKey: 'confirm' as const },
    ];

    return (
        <div className="max-w-md space-y-8">
            <div>
                <p className="section-subtitle">Security</p>
                <h2 className="section-title">Change Password</h2>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                {field.label}
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={13} />
                                <input
                                    type={show[field.showKey] ? 'text' : 'password'}
                                    name={field.name}
                                    value={form[field.name as keyof typeof form]}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(prev => ({ ...prev, [field.showKey]: !prev[field.showKey] }))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
                                >
                                    {show[field.showKey] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Changing...' : 'Change Password →'}
                    </button>
                </form>
            </div>
        </div>
    );
}