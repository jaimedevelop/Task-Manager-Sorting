import React from 'react';
import { CheckCircle, Clock, AlertTriangle, AlertCircle, Minus } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function TaskStats({ stats }: TaskStatsProps) {
  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'High Priority',
      value: stats.high,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50',
    },
    {
      label: 'Medium Priority',
      value: stats.medium,
      icon: AlertCircle,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Low Priority',
      value: stats.low,
      icon: Minus,
      color: 'text-gray-600 bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{item.value}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}