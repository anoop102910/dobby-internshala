import { Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostInput {
  title: string;
  content: string;
} 