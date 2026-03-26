export type Role = 'ADMIN' | 'USER';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  active?: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  assignedTo: UserDto | null;
  createdBy: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}
