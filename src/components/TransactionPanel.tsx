import React, { useState } from 'react'

interface Transaction {
  id: string
  amount: number
  category: 'income' | 'expense' | 'saving'
  description: string
  date: Date
}

interface TransactionPanelProps {
  transactions: Transaction[]
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void
}

const TransactionPanel: React.FC<TransactionPanelProps> = ({ transactions, onAddTransaction }) => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<'income' | 'expense' | 'saving'>('expense')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) return

    const transactionAmount = category === 'expense' ? -Math.abs(parseFloat(amount)) : parseFloat(amount)
    
    onAddTransaction({
      amount: transactionAmount,
      category,
      description: description.trim()
    })

    setAmount('')
    setDescription('')
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'income': return '💰'
      case 'expense': return '🛒'
      case 'saving': return '🌱'
      default: return '💸'
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'income': return 'text-green-600'
      case 'expense': return 'text-red-600'
      case 'saving': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const quickAddCategories = [
    { label: 'Salary', category: 'income' as const, amount: 50000 },
    { label: 'Groceries', category: 'expense' as const, amount: 2000 },
    { label: 'Transport', category: 'expense' as const, amount: 500 },
    { label: 'Savings', category: 'saving' as const, amount: 5000 },
  ]

  const handleQuickAdd = (quickCategory: typeof quickAddCategories[0]) => {
    const transactionAmount = quickCategory.category === 'expense' ? -quickCategory.amount : quickCategory.amount
    onAddTransaction({
      amount: transactionAmount,
      category: quickCategory.category,
      description: quickCategory.label
    })
  }

  return (
    <div className="bg-blue/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Transactions</h2>
        <div className="text-sm text-gray-600">Track your financial activities</div>
      </div>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'income' | 'expense' | 'saving')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="income">💰 Income</option>
            <option value="expense">🛒 Expense</option>
            <option value="saving">🌱 Saving</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this for?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Add Transaction
        </button>
      </form>

      {/* Quick Add Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickAddCategories.map((item, index) => (
            <button
              key={index}
              onClick={() => handleQuickAdd(item)}
              className={`p-3 text-sm rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 shadow-sm hover:shadow-md transform hover:scale-105 ${
                item.category === 'income' 
                  ? 'bg-green-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700'
                  : item.category === 'expense'
                  ? 'bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700'
                  : 'bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700'
              }`}
            >
              <span className="text-2xl">{getCategoryIcon(item.category)}</span>
              <span className="font-medium">{item.label}</span>
              <span className="text-xs font-bold">
                ₹{item.amount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        <div className="bg-green-50 p-2 rounded-lg text-center">
          <div className="text-xl">💰</div>
          <div className="text-xs font-medium text-blue-700">Total Income</div>
          <div className="text-sm font-bold text-blue-800">₹{transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
        </div>
        <div className="bg-red-50 p-2 rounded-lg text-center">
          <div className="text-xl">🛒</div>
          <div className="text-xs font-medium text-red-700">Expenses</div>
          <div className="text-sm font-bold text-red-800">₹{Math.abs(transactions.filter(t => t.category === 'expense').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}</div>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg text-center">
          <div className="text-xl">🌱</div>
          <div className="text-xs font-medium text-blue-700">Savings</div>
          <div className="text-sm font-bold text-blue-800">₹{transactions.filter(t => t.category === 'saving').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
        <div className="space-y-2 overflow-y-auto max-h-64">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.date.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className={`font-bold text-sm ${getCategoryColor(transaction.category)}`}>
                {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🌱</div>
              <div className="text-sm">Start adding transactions to grow your tree!</div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Spending Chart */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">Weekly Activity</div>
          <div className="text-xs text-gray-500">Last 7 days</div>
        </div>
        <div className="space-y-3">
          {/* Chart */}
          <div className="flex space-x-1 h-12 items-end bg-gray-50 rounded-lg p-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const heights = [60, 85, 40, 95, 55, 75, 65];
              const colors = ['bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-green-400'];
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full ${colors[index]} rounded-t-sm transition-all duration-300 hover:opacity-75 cursor-pointer`}
                    style={{ height: `${heights[index]}%` }}
                    title={`${day}: ₹${(heights[index] * 10)}`}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1">{day.slice(0, 1)}</div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-600">Income</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-600">Expenses</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-600">Savings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionPanel
