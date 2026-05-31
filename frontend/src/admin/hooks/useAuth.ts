import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import type{ AuthTokens } from '../../types';

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post<AuthTokens>('/auth/login/', { username, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            navigate('/admin-panel/dashboard');
        } catch (err: any) {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/admin-panel/login');
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem('access_token');
    };

    return { login, logout, isAuthenticated, loading, error };
}