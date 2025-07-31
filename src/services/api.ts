import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    isVerified: boolean;
  };
  message?: string;
}

interface VerificationRequest {
  type: 'email' | 'phone';
  value: string;
}

interface VerifyCodeRequest {
  code: string;
  type: 'email' | 'phone';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post<{ message: string }>(`/auth/verify/${token}`);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  sendVerificationCode: async (data: VerificationRequest) => {
    const response = await api.post('/auth/send-verification', data);
    return response.data;
  },

  verifyCode: async (data: VerifyCodeRequest): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/auth/verify-code', data);
    return response.data;
  }
};

export default api; 