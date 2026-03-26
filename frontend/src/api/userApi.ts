import api from './axios';
import type { UserDto } from '../types/index';

export const userApi = {
  getAll: async () => {
    const response = await api.get<UserDto[]>('/users');
    return response.data;
  },
  deactivate: async (id: number) => {
    await api.patch(`/users/${id}/deactivate`);
  },
  activate: async (id: number) => {
    await api.patch(`/users/${id}/activate`);
  },
};
