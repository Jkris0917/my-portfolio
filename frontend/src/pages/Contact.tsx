import { useState } from 'react';
import api from '../api/axios';
import type { ContactFormData, ApiError } from '../types';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
    const [form, setForm] = useState<ContactFormData>({ name: '', email: '', message: '' });
    const [formState, setFormState] = useState<FormState>('idle');
    const [errors, setErrors] = useState<ApiError>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: [] }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState('loading');
        setErrors({});

        try {
            await api.post('/contact/', form);
            setFormState('success');
            setForm({ name: '', email: '', message: '' });
        } catch (err: any) {
            if (err.response?.data) {
                setErrors(err.response.data as ApiError);
            }
            setFormState('error');
        }
    };

    const fieldClass = (name: keyof ContactFormData) =>
        `w-full bg-surface border rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors ${errors[name] ? 'border-red-500/60' : 'border-border'
        }`;

    return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Left — Info */}
                <div>
                    <p className="section-subtitle">Get In Touch</p>
                    <h1 className="section-title">Let's Work Together</h1>
                    <p className="text-text-secondary leading-relaxed mt-4 mb-10">
                        Whether you have a backend project that needs a solid foundation, an API
                        that needs to be built from scratch, or you're hiring for a backend developer
                        role — I'd love to hear from you.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: '📧', label: 'Email', value: 'gelladojohnkris@gmail.com', href: 'mailto:gelladojohnkris@gmail.com' },
                            { icon: '🐙', label: 'GitHub', value: 'github.com/Jkris0917', href: 'https://github.com/Jkris0917' },
                            { icon: '💼', label: 'LinkedIn', value: 'john-kris-gellado', href: 'https://linkedin.com/in/john-kris-gellado-792a8235b' },
                        ].map(item => (
                            <a
                                key={item.label}
                                href={item.href}
                                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <div className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                                        {item.label}
                                    </div>
                                    <div className="font-mono text-sm text-text-primary group-hover:text-accent transition-colors">
                                        {item.value}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right — Form */}
                <div>
                    {formState === 'success' ? (
                        <div className="card border-accent/40 text-center py-12">
                            <div className="text-4xl mb-4">✓</div>
                            <h3 className="font-display font-bold text-xl text-accent mb-2">Message Sent!</h3>
                            <p className="text-text-secondary text-sm">I'll get back to you soon.</p>
                            <button
                                onClick={() => setFormState('idle')}
                                className="btn-outline mt-6 text-xs"
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    required
                                    className={fieldClass('name')}
                                />
                                {errors.name && (
                                    <p className="font-mono text-xs text-red-400 mt-1">{errors.name[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    className={fieldClass('email')}
                                />
                                {errors.email && (
                                    <p className="font-mono text-xs text-red-400 mt-1">{errors.email[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Tell me about your project..."
                                    required
                                    rows={6}
                                    className={`${fieldClass('message')} resize-none`}
                                />
                                {errors.message && (
                                    <p className="font-mono text-xs text-red-400 mt-1">{errors.message[0]}</p>
                                )}
                            </div>

                            {formState === 'error' && !Object.keys(errors).length && (
                                <p className="font-mono text-xs text-red-400">
                                    Something went wrong. Please try again.
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={formState === 'loading'}
                                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formState === 'loading' ? 'Sending...' : 'Send Message →'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main >
    );
}