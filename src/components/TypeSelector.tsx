import React, { useState, useEffect } from 'react';
import { Plus, Tag, X } from 'lucide-react';
import { taskService } from '../services/taskService';

interface TypeSelectorProps {
  value: string;
  onChange: (type: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TypeSelector({ value, onChange, disabled = false, className = '' }: TypeSelectorProps) {
  const [types, setTypes] = useState<string[]>(['General']);
  const [isCreating, setIsCreating] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to task types
    const unsubscribe = taskService.subscribeToTaskTypes(
      (updatedTypes) => {
        setTypes(updatedTypes);
      },
      (error) => {
        console.error('Task types subscription error:', error);
        setError('Failed to load task types');
      }
    );

    return unsubscribe;
  }, []);

  const handleCreateType = async () => {
    if (!newTypeName.trim()) return;

    const trimmedName = newTypeName.trim();
    
    // Check if type already exists
    if (types.some(type => type.toLowerCase() === trimmedName.toLowerCase())) {
      setError('This type already exists');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await taskService.createTaskType(trimmedName);
      onChange(trimmedName);
      setNewTypeName('');
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create task type:', err);
      setError('Failed to create task type');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateType();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewTypeName('');
      setError(null);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewTypeName('');
    setError(null);
  };

  if (isCreating) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => {
              setNewTypeName(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyPress}
            placeholder="Enter new type name..."
            disabled={loading}
            className={`w-full pl-9 pr-20 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            autoFocus
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={handleCreateType}
              disabled={loading || !newTypeName.trim()}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200 disabled:opacity-50"
              title="Create type"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleCancelCreate}
              disabled={loading}
              className="p-1 text-gray-400 hover:bg-gray-50 rounded transition-colors duration-200 disabled:opacity-50"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Type
      </label>
      <div className="relative">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === '__create_new__') {
              setIsCreating(true);
            } else {
              onChange(e.target.value);
            }
          }}
          disabled={disabled}
          className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
          <option value="__create_new__" className="text-blue-600 font-medium">
            + Create New Type
          </option>
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}