import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { SiDjango, SiReact, SiPostgresql } from 'react-icons/si';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className="min-h-screen bg-ink flex">

            {/* Left Panel — Branding */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex flex-col justify-between w-1/2 bg-surface border-r border-border p-12 relative overflow-hidden"
            >
                {/* Background grid pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle, #00C7BE 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Top — Logo */}
                <div className="relative">
                    <h1 className="font-mono text-accent font-bold text-3xl">
                        jk<span className="text-text-primary">.</span>admin
                    </h1>
                    <p className="font-mono text-text-secondary text-sm mt-2">
                        Portfolio Management System
                    </p>
                </div>

                {/* Middle — Info */}
                <div className="relative space-y-8">
                    <div>
                        <h2 className="font-display font-bold text-4xl text-text-primary leading-tight mb-4">
                            Manage your
                            <br />
                            <span className="text-accent">portfolio</span>
                            <br />
                            with ease.
                        </h2>
                        <p className="text-text-secondary leading-relaxed">
                            Add projects, manage messages, upload certificates and gallery images — all from one place.
                        </p>
                    </div>

                    {/* Tech stack used */}
                    <div className="space-y-3">
                        <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                            Built with
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: SiDjango, label: 'Django', color: '#44B78B' },
                                { icon: SiReact, label: 'React', color: '#61DAFB' },
                                { icon: SiPostgresql, label: 'PostgreSQL', color: '#336791' },
                            ].map(({ icon: Icon, label, color }) => (
                                <div key={label} className="flex items-center gap-2 bg-ink border border-border rounded-lg px-3 py-2">
                                    <Icon size={14} color={color} />
                                    <span className="font-mono text-xs text-text-secondary">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom — Author */}
                <div className="relative">
                    <p className="font-mono text-xs text-text-secondary">
                        © {new Date().getFullYear()} John Kris Gellado
                    </p>
                    <p className="font-mono text-xs text-text-secondary/50 mt-1">
                        Python Backend Developer · Cebu, Philippines
                    </p>
                </div>
            </motion.div>

            {/* Right Panel — Form */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col items-center justify-center p-8"
            >
                {/* Mobile logo */}
                <div className="lg:hidden mb-8 text-center">
                    <h1 className="font-mono text-accent font-bold text-2xl">
                        jk<span className="text-text-primary">.</span>admin
                    </h1>
                    <p className="font-mono text-text-secondary text-xs mt-1">
                        Portfolio Management System
                    </p>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="font-display font-bold text-2xl text-text-primary mb-1">
                            Welcome back
                        </h2>
                        <p className="font-mono text-text-secondary text-sm">
                            Sign in to your admin panel
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                Username
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={13} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="admin"
                                    required
                                    className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={13} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-surface border border-border rounded-lg pl-10 pr-12 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                            >
                                <span className="text-red-400 text-xs font-mono">{error}</span>
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary justify-center py-3.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In →'
                            )}
                        </button>

                    </form>

                    {/* Back link */}
                    <p className="text-center mt-8">

                        <a
                            href="/"
                            className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                        >
                            ← Back to portfolio
                        </a>
                    </p>
                </div>
            </motion.div >
        </div >
    );
}