import { Document } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  size: number;
  parentId?: string; // Reference to parent folder (null for root folders)
  ownerId: string; // Reference to user
  itemsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFolderInput {
  name: string;
  parentId?: string;
  ownerId: string;
} 