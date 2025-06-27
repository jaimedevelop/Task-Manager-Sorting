import React, { useState } from 'react';
import { Plus, ListTodo, Dice6 } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { TaskRaffle } from './components/TaskRaffle';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Task } from './types/Task';

function App() {
  const {
    tasks,
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
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRaffleOpen, setIsRaffleOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    type: string;
    completed: boolean;
  }) => {
    try {
      setFormLoading(true);
      await createTask(taskData);
      setIsFormOpen(false);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (taskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    type: string;
    completed: boolean;
  }) => {
    if (editingTask) {
      try {
        setFormLoading(true);
        await updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } catch (error) {
        // Error is handled by the hook
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-blue-600 rounded-xl">
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Organize your work and stay productive</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsRaffleOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Dice6 className="w-5 h-5" />
              Raffle
            </button>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Stats */}
        <TaskStats stats={taskStats} />

        {/* Filters */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
        />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleTaskComplete}
          onEdit={handleEditTask}
          onDelete={deleteTask}
        />

        {/* Task Form */}
        <TaskForm
          isOpen={isFormOpen || editingTask !== null}
          onClose={handleCloseForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description,
            priority: editingTask.priority,
            type: editingTask.type,
            completed: editingTask.completed,
          } : undefined}
          mode={editingTask ? 'edit' : 'create'}
          loading={formLoading}
        />

        {/* Task Raffle */}
        <TaskRaffle
          tasks={tasks}
          isOpen={isRaffleOpen}
          onClose={() => setIsRaffleOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;