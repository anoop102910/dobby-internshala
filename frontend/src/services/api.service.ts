    import axios, { InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { AuthResponse, Post, User, Folder, Image } from '@/types/api.types';

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

type ApiFolderResponse = {
  status: string;
  data: {
    folders: Folder[];
    images: Image[];
  };
};

type ApiResponse<T> = {
  status: string;
  data: T;
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
  folders: {
    getFolders: async (parentId?: string): Promise<ApiFolderResponse> => 
      (await api.get(`/folders${parentId ? `/${parentId}` : ''}`)).data,
    createFolder: async (data: { name: string; parentId?: string }): Promise<ApiFolderResponse> => 
      (await api.post('/folders', data)).data,
    updateFolder: async (folderId: string, data: { name: string }): Promise<ApiFolderResponse> => 
      (await api.put(`/folders/${folderId}`, data)).data,
    deleteFolder: async (folderId: string): Promise<ApiFolderResponse> => 
      (await api.delete(`/folders/${folderId}`)).data,
  },
  images: {
    uploadImage: (formData: FormData) =>
      api.post<ApiResponse<Image>>('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    getImages: (folderId: string) =>
      api.get<ApiResponse<Image[]>>(`/images/${folderId}`),
    deleteImage: (imageId: string) =>
      api.delete<ApiResponse<Image>>(`/images/${imageId}`),
    renameImage: (imageId: string, name: string) =>
      api.put<ApiResponse<Image>>(`/images/${imageId}`, { name }),
  },
}; 