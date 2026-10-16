import { create } from 'zustand';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';
import { authService } from '../services/authService';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../services/api';
import axios from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  initAuth: () => void;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initAuth: () => {
    if (typeof window === 'undefined') return;

    try {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const savedUserStr = localStorage.getItem(USER_STORAGE_KEY);

      if (savedToken && savedUserStr) {
        const savedUser = JSON.parse(savedUserStr) as User;
        set({
          token: savedToken,
          user: savedUser,
          isAuthenticated: true,
        });
      }
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    // Lắng nghe sự kiện 401 từ Axios interceptor
    window.addEventListener('auth:unauthorized', () => {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    });
  },

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const user: User = {
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }

      set({
        token: response.token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (err: unknown) {
      let errorMessage = 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          errorMessage = 'Email hoặc mật khẩu không chính xác.';
        } else if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (typeof err.response.data.message === 'string') {
            errorMessage = err.response.data.message;
          }
        }
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      const user: User = {
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        phone: userData.phone,
        address: userData.address,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }

      set({
        token: response.token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (err: unknown) {
      let errorMessage = 'Đăng ký không thành công. Vui lòng thử lại.';
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (typeof err.response.data.message === 'string') {
            errorMessage = err.response.data.message;
          }
        }
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
