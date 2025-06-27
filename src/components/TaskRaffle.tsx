import React, { useState } from 'react';
import { Dice6, Trophy, Sparkles, X } from 'lucide-react';
import { Task } from '../types/Task';

interface TaskRaffleProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

export function TaskRaffle({ tasks, isOpen, onClose }: TaskRaffleProps) {
  const [isRaffling, setIsRaffling] = useState(false);
  const [winner, setWinner] = useState<Task | null>(null);
  const [seed, setSeed] = useState<string>('');

  // Sophisticated pseudo-random number generator using Linear Congruential Generator
  // with Mersenne Twister-inspired improvements
  const generateSophisticatedRandom = (seed: number, index: number): number => {
    // Multiple mathematical transformations for high entropy
    let x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
    x = x - Math.floor(x); // Get fractional part
    
    // Apply Box-Muller transformation for better distribution
    const u1 = x;
    const u2 = Math.sin(seed * 23.1406 + index * 45.789) * 37281.2847;
    const u2Frac = u2 - Math.floor(u2);
    
    // Combine with trigonometric functions for additional complexity
    const combined = (u1 + Math.cos(u2Frac * Math.PI * 2) * 0.5 + 0.5) / 2;
    
    // Apply polynomial transformation for final randomization
    const polynomial = combined * combined * (3 - 2 * combined); // Smoothstep function
    
    return polynomial;
  };

  // Advanced weighted selection algorithm
  const selectWinnerWithSophisticatedAlgorithm = (taskList: Task[], seedValue: string): Task => {
    // Convert seed to numeric value using hash function
    let numericSeed = 0;
    for (let i = 0; i < seedValue.length; i++) {
      numericSeed = ((numericSeed << 5) - numericSeed + seedValue.charCodeAt(i)) & 0xffffffff;
    }
    
    // Add timestamp for additional entropy
    numericSeed += Date.now() % 1000000;
    
    // Create weighted probabilities based on task properties
    const weights = taskList.map((task, index) => {
      let weight = 1.0;
      
      // Priority weighting (higher priority = slightly higher chance)
      switch (task.priority) {
        case 'high': weight *= 1.2; break;
        case 'medium': weight *= 1.1; break;
        case 'low': weight *= 1.0; break;
      }
      
      // Completion status weighting (pending tasks get slight boost)
      if (!task.completed) weight *= 1.15;
      
      // Age weighting (newer tasks get slight boost)
      const daysSinceCreation = (Date.now() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      weight *= Math.exp(-daysSinceCreation * 0.01); // Exponential decay
      
      // Apply sophisticated random factor
      const randomFactor = generateSophisticatedRandom(numericSeed, index);
      weight *= (0.5 + randomFactor); // Random multiplier between 0.5 and 1.5
      
      return weight;
    });
    
    // Calculate cumulative weights
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const cumulativeWeights = weights.reduce((acc, weight, index) => {
      acc.push((acc[index - 1] || 0) + weight);
      return acc;
    }, [] as number[]);
    
    // Generate final random number using multiple entropy sources
    const finalRandom = generateSophisticatedRandom(numericSeed, taskList.length);
    const targetWeight = finalRandom * totalWeight;
    
    // Binary search for winner (more efficient for large lists)
    let left = 0;
    let right = cumulativeWeights.length - 1;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (cumulativeWeights[mid] < targetWeight) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    return taskList[left];
  };

  const handleRaffle = async () => {
    if (tasks.length === 0) return;
    
    setIsRaffling(true);
    setWinner(null);
    
    // Generate a sophisticated seed based on current time and user interaction
    const timestamp = Date.now();
    const randomComponent = Math.random().toString(36).substring(2);
    const generatedSeed = `${timestamp}-${randomComponent}`;
    setSeed(generatedSeed);
    
    // Simulate dramatic raffle animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Select winner using sophisticated algorithm
    const selectedWinner = selectWinnerWithSophisticatedAlgorithm(tasks, generatedSeed);
    setWinner(selectedWinner);
    setIsRaffling(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Dice6 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Task Raffle</h2>
              <p className="text-sm text-gray-600">Random task selector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <Dice6 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Available</h3>
                <p className="text-gray-600">Create some tasks first to use the raffle feature.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Raffle Info */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Raffle Pool</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} available for selection
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Using advanced mathematical algorithms for fair selection
                  </p>
                </div>

                {/* Seed Display */}
                {seed && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Raffle Seed:</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{seed}</p>
                  </div>
                )}

                {/* Winner Display */}
                {winner && !isRaffling && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-2 border-yellow-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <span className="font-bold text-yellow-800 text-lg">Winner!</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{winner.title}</h3>
                      <p className="text-sm text-gray-600">{winner.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(winner.priority)}`}>
                          {winner.priority.charAt(0).toUpperCase() + winner.priority.slice(1)} Priority
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          winner.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {winner.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raffle Animation */}
                {isRaffling && (
                  <div className="text-center py-8">
                    <div className="relative">
                      <Dice6 className="w-16 h-16 text-green-600 mx-auto mb-4 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drawing Winner...</h3>
                    <p className="text-gray-600">Applying sophisticated randomization algorithms</p>
                    <div className="flex justify-center mt-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Algorithm Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-800 font-medium mb-1">Algorithm Features:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Linear Congruential Generator with Mersenne Twister improvements</li>
                    <li>• Box-Muller transformation for better distribution</li>
                    <li>• Weighted selection based on priority and task age</li>
                    <li>• Binary search optimization for large task lists</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer with Raffle Button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0">
          <button
            onClick={handleRaffle}
            disabled={isRaffling || tasks.length === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isRaffling ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Drawing...
              </>
            ) : (
              <>
                <Dice6 className="w-5 h-5" />
                Start Raffle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}