import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Token Persistence Strategy (Next.js SSR-Safe):
 * - Backend cấp phát stateless JWT qua AuthResponse.token (Spring Boot 8080).
 * - Sử dụng key 'slybyte_token' trong localStorage kết hợp đồng bộ trực tiếp vào Zustand store.
 * - Kiểm tra typeof window !== 'undefined' để tránh lỗi khi render trên Server.
 */
export const TOKEN_STORAGE_KEY = 'slybyte_token';
export const USER_STORAGE_KEY = 'slybyte_user';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Đính kèm Bearer token nếu có trên client
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi an toàn, tránh redirect loop
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string } | string>) => {
    const status = error.response?.status;
    const originalRequestUrl = error.config?.url || '';

    const isAuthEndpoint =
      originalRequestUrl.includes('/auth/login') || originalRequestUrl.includes('/auth/register');

    if (status === 401 && !isAuthEndpoint && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);
