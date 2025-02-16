    import axios, { InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { AuthResponse, Post, User } from '@/types/api.types';

type ApiAuthResponse = {
  status: string;
  data: AuthResponse;
};

type ApiPostResponse = {
  status: string;
  data: Post[];
};

type ApiUserResponse = {
  status: string;
  data: User;
};

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  auth: {
    login: async (data: { email: string; password: string }): Promise<ApiAuthResponse> => 
      (await api.post('/auth/login', data)).data,
    register: async (data: { username: string; email: string; password: string }): Promise<ApiAuthResponse> => 
      (await api.post('/auth/register', data)).data,
    getProfile: async (): Promise<ApiUserResponse> => 
      (await api.get('/auth/me')).data,
  },
  posts: {
    getAll: async (): Promise<ApiPostResponse> => 
      (await api.get('/posts')).data,
    create: async (data: { title: string; content: string }): Promise<ApiPostResponse> => 
      (await api.post('/posts', data)).data,
  },
}; 