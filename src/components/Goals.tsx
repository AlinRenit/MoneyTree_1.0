import React, { useState } from 'react'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  category: 'emergency' | 'vacation' | 'investment' | 'house' | 'car' | 'other'
  priority: 'high' | 'medium' | 'low'
}

interface GoalsProps {
  balance: number
  savings: number
}

const Goals: React.FC<GoalsProps> = ({ savings }) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: savings * 0.6,
      targetDate: new Date('2025-12-31'),
      category: 'emergency',
      priority: 'high'
    },
    {
      id: '2', 
      name: 'Vacation to Japan',
      targetAmount: 5000,
      currentAmount: savings * 0.2,
      targetDate: new Date('2026-06-01'),
      category: 'vacation',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      targetAmount: 15000,
      currentAmount: savings * 0.2,
      targetDate: new Date('2026-12-31'),
      category: 'investment',
      priority: 'high'
    }
  ])

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: 'other' as Goal['category'],
    priority: 'medium' as Goal['priority']
  })

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        targetDate: new Date(newGoal.targetDate),
        category: newGoal.category,
        priority: newGoal.priority
      }
      setGoals(prev => [...prev, goal])
      setNewGoal({
        name: '',
        targetAmount: '',
        targetDate: '',
        category: 'other',
        priority: 'medium'
      })
    }
  }

  const updateGoalProgress = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ))
  }

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'emergency': return '🛡️'
      case 'vacation': return '✈️'
      case 'investment': return '📈'
      case 'house': return '🏠'
      case 'car': return '🚗'
      default: return '🎯'
    }
  }

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50'
      case 'medium': return 'border-yellow-300 bg-yellow-50'
      case 'low': return 'border-green-300 bg-green-50'
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <h2 className="text-2xl font-bold text-tree-green mb-6">Financial Goals</h2>
        
        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-blue-800">Total Goals</h3>
            <p className="text-2xl font-bold text-blue-600">{goals.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-green-800">Completed</h3>
            <p className="text-2xl font-bold text-green-600">
              {goals.filter(g => g.currentAmount >= g.targetAmount).length}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-orange-800">In Progress</h3>
            <p className="text-2xl font-bold text-orange-600">
              {goals.filter(g => g.currentAmount < g.targetAmount && g.currentAmount > 0).length}
            </p>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const isCompleted = goal.currentAmount >= goal.targetAmount
            const daysLeft = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            
            return (
              <div key={goal.id} className={`border-2 rounded-lg p-4 ${getPriorityColor(goal.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                    <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                    {isCompleted && <span className="text-green-600 text-xl">✅</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{progress.toFixed(1)}% complete</span>
                  <span className={`font-semibold ${goal.priority === 'high' ? 'text-red-600' : goal.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {goal.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
                
                {/* Add Money Button */}
                {!isCompleted && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => updateGoalProgress(goal.id, 100)}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      +$100
                    </button>
                    <button
                      onClick={() => updateGoalProgress(goal.id, 500)}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      +$500
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add New Goal */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Add New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Goal name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Target amount"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value as Goal['category']})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="emergency">🛡️ Emergency</option>
              <option value="vacation">✈️ Vacation</option>
              <option value="investment">📈 Investment</option>
              <option value="house">🏠 House</option>
              <option value="car">🚗 Car</option>
              <option value="other">🎯 Other</option>
            </select>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <select
              value={newGoal.priority}
              onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as Goal['priority']})}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              onClick={addGoal}
              className="px-4 py-2 bg-tree-green text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Add Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Goals
