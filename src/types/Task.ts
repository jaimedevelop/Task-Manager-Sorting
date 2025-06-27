export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskPriority = Task['priority'];

export type SortOption = 'date' | 'priority' | 'status' | 'title' | 'type';
export type FilterOption = 'all' | 'completed' | 'pending' | 'high' | 'medium' | 'low';