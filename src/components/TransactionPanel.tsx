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
    { label: 'Salary', category: 'income' as const, amount: 5000 },
    { label: 'Groceries', category: 'expense' as const, amount: 200 },
    { label: 'Transport', category: 'expense' as const, amount: 50 },
    { label: 'Savings', category: 'saving' as const, amount: 500 },
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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 h-full flex flex-col">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'income' | 'expense' | 'saving')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          Add Transaction
        </button>
      </form>

      {/* Quick Add Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickAddCategories.map((item, index) => (
            <button
              key={index}
              onClick={() => handleQuickAdd(item)}
              className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex flex-col items-center space-y-1"
            >
              <span>{getCategoryIcon(item.category)}</span>
              <span>{item.label}</span>
              <span className={getCategoryColor(item.category)}>
                ${item.amount}
              </span>
            </button>
          ))}
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
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
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

      {/* Mini Charts Placeholder */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600 mb-2">This Week</div>
        <div className="flex space-x-1 h-8 items-end">
          {[40, 65, 30, 80, 45, 70, 55].map((height, index) => (
            <div
              key={index}
              className="flex-1 bg-green-300 rounded-t-sm"
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TransactionPanel
