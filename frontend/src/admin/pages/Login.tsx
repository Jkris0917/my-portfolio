import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className="min-h-screen bg-ink flex items-center justify-center px-6">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="font-mono text-accent font-semibold text-2xl">
                        jk<span className="text-text-primary">.</span>admin
                    </h1>
                    <p className="font-mono text-text-secondary text-xs mt-2">
                        Sign in to manage your portfolio
                    </p>
                </div>

                {/* Card */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="admin"
                                required
                                className="w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>

                        <div>
                            <label className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2 block">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-ink border border-border rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="font-mono text-xs text-red-400">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>

                    </form>
                </div>

                {/* Back to portfolio */}
                <p className="text-center mt-6">

                    <a href="/"
                        className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                    >
                        ← Back to portfolio
                    </a>
                </p>
            </div>
        </div >
    );
}