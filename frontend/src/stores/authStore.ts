import { makeAutoObservable } from 'mobx';
import axios, { AxiosError } from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface ApiError {
  message: string;
}

class AuthStore {
  user: User | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async login(email: string, password: string, rememberMe: boolean) {
    try {
      this.setLoading(true);
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
        rememberMe,
      });
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.setUser(user);
      this.setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      this.setError(axiosError.response?.data?.message || 'Login failed');
    } finally {
      this.setLoading(false);
    }
  }

  async register(email: string, password: string, name: string) {
    try {
      this.setLoading(true);
      const response = await axios.post('http://localhost:3000/auth/register', {
        email,
        password,
        name,
      });
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.setUser(user);
      this.setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      this.setError(axiosError.response?.data?.message || 'Registration failed');
    } finally {
      this.setLoading(false);
    }
  }

  async updateProfile(name: string, email: string) {
    try {
      this.setLoading(true);
      const response = await axios.put(
        'http://localhost:3000/auth/profile',
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      this.setUser(response.data);
      this.setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      this.setError(axiosError.response?.data?.message || 'Profile update failed');
    } finally {
      this.setLoading(false);
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      this.setLoading(true);
      await axios.put(
        'http://localhost:3000/auth/password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      this.setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      this.setError(axiosError.response?.data?.message || 'Password change failed');
    } finally {
      this.setLoading(false);
    }
  }

  async requestPasswordReset(email: string) {
    try {
      this.setLoading(true);
      await axios.post('http://localhost:3000/auth/reset-password', { email });
      this.setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      this.setError(axiosError.response?.data?.message || 'Password reset request failed');
    } finally {
      this.setLoading(false);
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.setUser(null);
  }
}

export const authStore = new AuthStore();