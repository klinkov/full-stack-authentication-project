import axios from 'axios';
import authStore from '../store/authStore';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(
    async (config) => {
        if (authStore.keycloak?.token) {
            config.headers.Authorization = `Bearer ${authStore.keycloak.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await authStore.keycloak?.updateToken(5);
            } catch (refreshError) {
                authStore.logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export { http };