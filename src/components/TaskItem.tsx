import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Edit3, 
  Trash2, 
  Calendar,
  AlertTriangle,
  AlertCircle,
  Minus,
  Tag
} from 'lucide-react';
import { Task, TaskPriority } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityConfig = {
    high: {
      color: 'border-red-200 bg-red-50',
      badge: 'bg-red-100 text-red-800',
      icon: AlertTriangle,
      label: 'High',
    },
    medium: {
      color: 'border-yellow-200 bg-yellow-50',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: AlertCircle,
      label: 'Medium',
    },
    low: {
      color: 'border-gray-200 bg-gray-50',
      badge: 'bg-gray-100 text-gray-800',
      icon: Minus,
      label: 'Low',
    },
  };

  const config = priorityConfig[task.priority];
  const PriorityIcon = config.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-75 border-gray-200' : config.color
    }`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 flex-shrink-0 transition-all duration-200 hover:scale-110"
          >
            {task.completed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className={`text-lg font-semibold ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.badge}`}>
                <PriorityIcon className="w-3 h-3" />
                {config.label}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Tag className="w-3 h-3" />
                {task.type}
              </span>
            </div>
            
            <p className={`text-sm mb-3 ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>

            <div className="flex items-center text-xs text-gray-500 gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Created {formatDate(task.createdAt)}</span>
              </div>
              {task.updatedAt.getTime() !== task.createdAt.getTime() && (
                <div className="flex items-center gap-1">
                  <span>Updated {formatDate(task.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Edit task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Task
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}