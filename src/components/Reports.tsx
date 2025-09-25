import React, { useState } from 'react'

interface ReportsProps {
  balance: number
  income: number
  expenses: number
  savings: number
  transactions: Array<{
    id: string
    amount: number
    category: 'income' | 'expense' | 'saving'
    description: string
    date: Date
  }>
}

const Reports: React.FC<ReportsProps> = ({ balance, income, expenses, savings, transactions }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const totalWealth = balance + savings
  const netIncome = income - expenses
  const savingsRate = income > 0 ? ((savings / income) * 100) : 0

  // Calculate monthly trends
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0, savings: 0 }
    }
    
    if (transaction.category === 'income') {
      acc[month].income += transaction.amount
    } else if (transaction.category === 'expense') {
      acc[month].expenses += Math.abs(transaction.amount)
    } else if (transaction.category === 'saving') {
      acc[month].savings += transaction.amount
    }
    
    return acc
  }, {} as Record<string, { income: number; expenses: number; savings: number }>)

  const recentMonths = Object.entries(monthlyData).slice(-6)

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>
              <p className="text-gray-600">Analyze your financial patterns and trends</p>
            </div>
          </div>
          
          {/* Period Selector */}
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Total Wealth</h3>
              <p className="text-2xl font-bold">₹{totalWealth.toLocaleString()}</p>
            </div>
            <span className="text-3xl opacity-80">💰</span>
          </div>
          <div className="mt-2 text-sm opacity-90">
            {totalWealth > 0 ? '+' : ''}₹{(totalWealth - 100000).toLocaleString()} from goal
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Net Income</h3>
              <p className="text-2xl font-bold">₹{netIncome.toLocaleString()}</p>
            </div>
            <span className="text-3xl opacity-80">📈</span>
          </div>
          <div className="mt-2 text-sm opacity-90">
            {netIncome > 0 ? 'Positive' : 'Negative'} cash flow
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Savings Rate</h3>
              <p className="text-2xl font-bold">{savingsRate.toFixed(1)}%</p>
            </div>
            <span className="text-3xl opacity-80">🎯</span>
          </div>
          <div className="mt-2 text-sm opacity-90">
            {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs improvement'}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Transactions</h3>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
            <span className="text-3xl opacity-80">📋</span>
          </div>
          <div className="mt-2 text-sm opacity-90">
            This {selectedPeriod}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📈</span>
            Monthly Trends
          </h3>
          
          <div className="space-y-4">
            {recentMonths.map(([month, data], index) => {
              const maxValue = Math.max(data.income, data.expenses, data.savings)
              
              return (
                <div key={month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{month}</span>
                    <span className="text-sm text-gray-500">
                      Net: ₹{(data.income - data.expenses).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {/* Income Bar */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600 w-16">Income</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: maxValue > 0 ? `${(data.income / maxValue) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-16">₹{data.income.toLocaleString()}</span>
                    </div>
                    
                    {/* Expenses Bar */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-red-600 w-16">Expenses</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: maxValue > 0 ? `${(data.expenses / maxValue) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-16">₹{data.expenses.toLocaleString()}</span>
                    </div>
                    
                    {/* Savings Bar */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600 w-16">Savings</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: maxValue > 0 ? `${(data.savings / maxValue) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-16">₹{data.savings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🏷️</span>
            Category Breakdown
          </h3>
          
          <div className="space-y-4">
            {/* Income Categories */}
            <div>
              <h4 className="font-medium text-green-700 mb-2">Income Sources</h4>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Total Income</span>
                  <span className="font-semibold text-green-800">₹{income.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Expense Categories */}
            <div>
              <h4 className="font-medium text-red-700 mb-2">Expense Categories</h4>
              <div className="space-y-2">
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Total Expenses</span>
                    <span className="font-semibold text-red-800">₹{expenses.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Categories */}
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Savings & Investments</h4>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Total Savings</span>
                  <span className="font-semibold text-blue-800">₹{savings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏥</span>
          Financial Health Score
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Emergency Fund */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {Math.min(100, Math.round((savings / (expenses * 6)) * 100))}%
              </span>
            </div>
            <h4 className="font-medium text-gray-800">Emergency Fund</h4>
            <p className="text-sm text-gray-600">Target: 6 months expenses</p>
          </div>

          {/* Debt to Income */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {balance < 0 ? Math.round((Math.abs(balance) / income) * 100) : 0}%
              </span>
            </div>
            <h4 className="font-medium text-gray-800">Debt Ratio</h4>
            <p className="text-sm text-gray-600">Target: &lt;30% of income</p>
          </div>

          {/* Investment Rate */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {Math.round(savingsRate)}%
              </span>
            </div>
            <h4 className="font-medium text-gray-800">Savings Rate</h4>
            <p className="text-sm text-gray-600">Target: 20% of income</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
