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

export interface Folder {
  _id: string;
  name: string;
  parentId?: string;
  ownerId: string;
  itemsCount: number;
  size: number;
  createdAt: string;
  updatedAt: string;
}


export interface Image {
  _id: string;
  imageUrl: string;
  name: string;
  size: number;
  type: string;
} 
