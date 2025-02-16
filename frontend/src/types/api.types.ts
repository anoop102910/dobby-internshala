export interface User {
  _id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 