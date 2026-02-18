// lib/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import type { ApiResponse, AuthTokens } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const tokens = this.getTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = this.getTokens();
            if (tokens?.refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken: tokens.refreshToken,
              });

              const newTokens: AuthTokens = response.data.data;
              this.setTokens(newTokens);

              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('auth-storage');
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return parsed.state?.tokens || null;
    } catch {
      return null;
    }
  }

  private setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.state.tokens = tokens;
        localStorage.setItem('auth-storage', JSON.stringify(parsed));
      } catch {}
    }
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth-storage');
  }

  async get<T>(url: string, config = {}): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config = {}): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config = {}): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config = {}): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config = {}): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const api = new ApiClient();
