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
    <div className="h-full">
      {/* Landscape Layout - Side by side sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Left: Transaction Form & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Transaction Form - Compact */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2 text-xl">➕</span>
              Add Transaction
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="₹ Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'income' | 'expense' | 'saving')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="income">💰 Income</option>
                    <option value="expense">🛒 Expense</option>
                    <option value="saving">🌱 Saving</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this for?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add Transaction
              </button>
            </form>
          </div>

          {/* Quick Add Buttons - Horizontal Layout */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2 text-xl">⚡</span>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickAddCategories.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAdd(item)}
                  className={`p-4 text-sm rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 shadow-sm hover:shadow-lg transform hover:scale-105 ${
                    item.category === 'income' 
                      ? 'bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700'
                      : item.category === 'expense'
                      ? 'bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700'
                      : 'bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700'
                  }`}
                >
                  <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs font-bold">₹{item.amount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Quick Stats */}
        <div className="lg:col-span-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2 text-xl">📈</span>
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💰</span>
                    <div>
                      <div className="text-sm font-medium text-green-700">Total Income</div>
                      <div className="text-lg font-bold text-green-800">₹{transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-rose-100 p-4 rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🛒</span>
                    <div>
                      <div className="text-sm font-medium text-red-700">Total Expenses</div>
                      <div className="text-lg font-bold text-red-800">₹{Math.abs(transactions.filter(t => t.category === 'expense').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <div className="text-sm font-medium text-blue-700">Total Savings</div>
                      <div className="text-lg font-bold text-blue-800">₹{transactions.filter(t => t.category === 'saving').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Transactions List */}
        <div className="lg:col-span-5">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <span className="mr-2 text-xl">📋</span>
                Transaction History
              </span>
              <span className="text-sm font-normal text-gray-600">Latest {Math.min(transactions.length, 8)} entries</span>
            </h3>
            <div className="flex-1 overflow-hidden">
              <div className="space-y-3 overflow-y-auto max-h-96">
                {transactions.slice(0, 8).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:bg-white/80"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.category === 'income' ? 'bg-green-100' : 
                        transaction.category === 'expense' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <span>{transaction.date.toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize">{transaction.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${getCategoryColor(transaction.category)}`}>
                      {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {transactions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">🌱</div>
                    <div className="text-lg font-medium mb-2">No transactions yet</div>
                    <div className="text-sm">Start adding transactions to track your financial journey!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* Weekly Activity Chart - Full Width */}
      <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="mr-2 text-xl">📊</span>
            Weekly Activity Overview
          </h3>
          <div className="text-sm text-gray-600">Last 7 days</div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart */}
          <div className="lg:col-span-3">
            <div className="flex space-x-3 h-20 items-end bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                const heights = [60, 85, 40, 95, 55, 75, 65];
                const colors = ['bg-emerald-400', 'bg-blue-400', 'bg-rose-400', 'bg-emerald-400', 'bg-amber-400', 'bg-purple-400', 'bg-emerald-400'];
                return (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                    <div
                      className={`w-full ${colors[index]} rounded-t-lg transition-all duration-500 hover:opacity-75 cursor-pointer hover:scale-110`}
                      style={{ height: `${heights[index]}%` }}
                      title={`${day}: ₹${(heights[index] * 100).toLocaleString()}`}
                    ></div>
                    <div className="text-xs font-medium text-gray-600">{day.slice(0, 3)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend & Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-700">Income</span>
                </div>
                <span className="text-sm font-bold text-emerald-800">₹54K</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-rose-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                  <span className="text-sm font-medium text-rose-700">Expenses</span>
                </div>
                <span className="text-sm font-bold text-rose-800">₹31K</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">Net Gain</span>
                </div>
                <span className="text-sm font-bold text-blue-800">₹23K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionPanel
