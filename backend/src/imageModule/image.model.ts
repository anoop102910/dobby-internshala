import { Document } from 'mongoose';

export interface IImage extends Document {
  imageUrl: string;
  size: number;
  type: string;
  name: string;
  folderId: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IImageInput {
  imageUrl: string;
  size: number;
  type: string;
  name: string;
  folderId: string | null;
  ownerId: string;
} 