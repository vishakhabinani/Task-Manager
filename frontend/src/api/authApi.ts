import api from './axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/index';

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
