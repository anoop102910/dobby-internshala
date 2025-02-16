export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'size' | 'createdAt';

export interface Sortable {
  name: string;
  size: number;
  createdAt: string;
} 