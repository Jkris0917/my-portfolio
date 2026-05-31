import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach access token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
    response => response,
    async error => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refresh = localStorage.getItem('refresh_token');
            if (!refresh) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/admin-panel/login';
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/auth/refresh/`,
                    { refresh }
                );

                const newAccess = res.data.access;
                localStorage.setItem('access_token', newAccess);
                original.headers.Authorization = `Bearer ${newAccess}`;
                return api(original);
            } catch {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/admin-panel/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;