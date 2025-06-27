import { useState, useCallback, useMemo, useEffect } from 'react';
import { Task, SortOption, FilterOption } from '../types/Task';
import { taskService } from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to real-time task updates
  useEffect(() => {
    console.log('Setting up task subscription...');
    setLoading(true);
    setError(null);

    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      try {
        // Test connection first
        const connected = await taskService.testConnection();
        if (!connected) {
          setError('Unable to connect to database. Please check your internet connection and try again.');
          setLoading(false);
          return;
        }

        console.log('Connection test passed, setting up subscription...');

        // Set up real-time subscription
        unsubscribe = taskService.subscribeToTasks(
          (updatedTasks) => {
            console.log('Tasks updated via subscription:', updatedTasks);
            setTasks(updatedTasks);
            setLoading(false);
            setError(null);
          },
          (subscriptionError) => {
            console.error('Subscription error:', subscriptionError);
            setError(`Real-time updates failed: ${subscriptionError}`);
            setLoading(false);
          }
        );

      } catch (err) {
        console.error('Failed to setup subscription:', err);
        setError('Failed to connect to database');
        setLoading(false);
      }
    };

    setupSubscription();

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up task subscription');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Creating task:', taskData);
      setError(null);
      const taskId = await taskService.createTask(taskData);
      console.log('Task created successfully with ID:', taskId);
      // Task will be automatically added to the list via the real-time subscription
    } catch (err) {
      console.error('Failed to create task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      console.log('Updating task:', id, updates);
      setError(null);
      await taskService.updateTask(id, updates);
      console.log('Task updated successfully');
      // Task will be automatically updated in the list via the real-time subscription
    } catch (err) {
      console.error('Failed to update task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      console.log('Deleting task:', id);
      setError(null);
      await taskService.deleteTask(id);
      console.log('Task deleted successfully');
      // Task will be automatically removed from the list via the real-time subscription
    } catch (err) {
      console.error('Failed to delete task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const toggleTaskComplete = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  }, [updateTask, tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.type.toLowerCase().includes(query)
      );
    }

    // Apply status/priority filter
    switch (filterBy) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'high':
      case 'medium':
      case 'low':
        filtered = filtered.filter(task => task.priority === filterBy);
        break;
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return sorted;
  }, [tasks, sortBy, filterBy, searchQuery]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const high = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const medium = tasks.filter(t => t.priority === 'medium' && !t.completed).length;
    const low = tasks.filter(t => t.priority === 'low' && !t.completed).length;

    return { total, completed, pending: total - completed, high, medium, low };
  }, [tasks]);

  return {
    tasks: filteredAndSortedTasks,
    taskStats,
    loading,
    error,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    searchQuery,
    setSearchQuery,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  };
}