import api from './axios';
import type { Task, Status } from '../types/index';

export const taskApi = {
  getAll: async (status?: Status, assignedToId?: number) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (assignedToId) params.append('assignedToId', assignedToId.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    
    const response = await api.get<Task[]>(url);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },
  create: async (data: Partial<Task>) => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Task>) => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  },
};
