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