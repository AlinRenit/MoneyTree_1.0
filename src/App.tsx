import { useState } from 'react'
import Navigation from './components/Navigation'
import TreeVisualizationNew from './components/TreeVisualizationNew'
import TransactionPanel from './components/TransactionPanel'
import FinancialStoryPanel from './components/FinancialStoryPanel'
import AIAnalysisPanel from './components/AIAnalysisPanel'
import StatisticsPanel from './components/StatisticsPanel'
import Goals from './components/Goals'
import Predictions from './components/Predictions'
import UPISettings from './components/UPISettings'
import NotificationSystem from './components/NotificationSystem'
import type { NotificationData } from './components/NotificationSystem'
import Footer from './components/Footer'
import './App.css'

export interface Transaction {
  id: string
  amount: number
  category: 'income' | 'expense' | 'saving'
  description: string
  date: Date
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 50000, category: 'income', description: 'Salary', date: new Date('2025-09-20') },
    { id: '2', amount: -12000, category: 'expense', description: 'Rent', date: new Date('2025-09-21') },
    { id: '3', amount: 5000, category: 'saving', description: 'Emergency Fund', date: new Date('2025-09-22') },
    { id: '4', amount: 30000, category: 'income', description: 'Bonus', date: new Date('2025-09-23') },
    { id: '5', amount: 15000, category: 'saving', description: 'Investment', date: new Date('2025-09-24') },
  ])
  
  const [activeSection, setActiveSection] = useState<'dashboard' | 'goals' | 'predictions'>('dashboard')
  const [showUPISettings, setShowUPISettings] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString()
    }
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      // Validate transaction data
      if (!transaction.amount || isNaN(Number(transaction.amount))) {
        addNotification({
          type: 'error',
          title: 'Invalid Transaction',
          message: 'Transaction amount must be a valid number',
          duration: 4000
        });
        return;
      }

      if (!transaction.description?.trim()) {
        addNotification({
          type: 'warning',
          title: 'Missing Description',
          message: 'Adding transaction with generic description',
          duration: 3000
        });
      }

      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        date: new Date()
      }
      
      setTransactions(prev => [newTransaction, ...prev])

      // Success notification for manual transactions
      if (!transaction.description?.includes('UPI') && 
          !transaction.description?.includes('Salary') && 
          !transaction.description?.includes('Investment')) {
        addNotification({
          type: 'success',
          title: 'Transaction Added',
          message: `${transaction.category === 'expense' ? 'Expense' : 
                    transaction.category === 'income' ? 'Income' : 
                    'Savings'} of ₹${Math.abs(transaction.amount)} recorded successfully`,
          duration: 3000
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: 'Unable to add transaction. Please try again.',
        duration: 4000
      });
    }
  }

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter(t => t.category === 'expense').reduce((sum, t) => sum + t.amount, 0))
  const totalSavings = transactions.filter(t => t.category === 'saving').reduce((sum, t) => sum + t.amount, 0)

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
            {/* Modern Header with Live Stats */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      🌳
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Money Tree Pro
                    </h1>
                    <p className="text-sm text-gray-500">Advanced Financial Intelligence</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {/* Live Balance Ticker */}
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg">
                    <div className="text-xs opacity-90">Total Portfolio</div>
                    <div className="text-lg font-bold">₹{totalBalance.toLocaleString()}</div>
                  </div>
                  
                  {/* Performance Indicator */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg">
                    <div className="text-xs opacity-90">Monthly Growth</div>
                    <div className="text-lg font-bold flex items-center">
                      <span className="text-green-300">↗</span>
                      {((totalSavings / Math.max(totalIncome, 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  {/* Live Time */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Live Session</div>
                    <div className="text-sm font-medium text-gray-700">
                      {new Date().toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Dashboard Grid */}
            <div className="p-6 space-y-8">
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Balance Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Total Balance</p>
                      <p className="text-3xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">₹{totalBalance.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-emerald-500 text-sm font-medium animate-pulse">+12.5%</span>
                        <span className="text-gray-400 text-xs ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <span className="text-white text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 animate-pulse" style={{width: '78%'}}></div>
                  </div>
                </div>

                {/* Monthly Income Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Monthly Income</p>
                      <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">₹{totalIncome.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-blue-500 text-sm font-medium animate-pulse">+8.2%</span>
                        <span className="text-gray-400 text-xs ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <span className="text-white text-2xl">📊</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 h-3 rounded-full transition-all duration-1000" style={{width: '65%'}}></div>
                  </div>
                </div>

                {/* Expenses Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Monthly Expenses</p>
                      <p className="text-3xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">₹{totalExpenses.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-red-500 text-sm font-medium">-3.1%</span>
                        <span className="text-gray-400 text-xs ml-1">optimized</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <span className="text-white text-2xl">💸</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-400 via-pink-500 to-red-600 h-3 rounded-full transition-all duration-1000" style={{width: '42%'}}></div>
                  </div>
                </div>

                {/* Savings Rate Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Savings Rate</p>
                      <p className="text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{((totalSavings / Math.max(totalIncome, 1)) * 100).toFixed(1)}%</p>
                      <div className="flex items-center mt-2">
                        <span className="text-purple-500 text-sm font-medium">Target: 30%</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <span className="text-white text-2xl">🎯</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000" style={{width: `${Math.min(100, (totalSavings / Math.max(totalIncome, 1)) * 100 * 3.33)}%`}}></div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Tree Visualization */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Enhanced Quick Actions */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <span className="mr-3 text-3xl">⚡</span>
                        Smart Financial Actions
                      </h3>
                      <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-sm font-medium shadow-lg">
                        One-Click Transactions
                      </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <button 
                        onClick={() => {
                          addTransaction({ amount: 50000, category: 'income', description: 'Monthly Salary' });
                          addNotification({ type: 'success', title: 'Salary Added!', message: '₹50,000 credited to your account', duration: 3000 });
                        }}
                        className="group bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-rotate-2 transition-all duration-500"
                      >
                        <div className="text-4xl mb-3 group-hover:animate-bounce">💰</div>
                        <div className="text-lg font-bold">Add Salary</div>
                        <div className="text-sm opacity-90 mt-1">₹50,000</div>
                        <div className="text-xs opacity-75 mt-2">Monthly Income</div>
                      </button>
                      
                      <button 
                        onClick={() => {
                          addTransaction({ amount: 20000, category: 'saving', description: 'Investment Portfolio' });
                          addNotification({ type: 'success', title: 'Investment Made!', message: '₹20,000 added to portfolio', duration: 3000 });
                        }}
                        className="group bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-rotate-2 transition-all duration-500"
                      >
                        <div className="text-4xl mb-3 group-hover:animate-bounce">📈</div>
                        <div className="text-lg font-bold">Invest</div>
                        <div className="text-sm opacity-90 mt-1">₹20,000</div>
                        <div className="text-xs opacity-75 mt-2">Smart Investment</div>
                      </button>
                      
                      <button 
                        onClick={() => {
                          addTransaction({ amount: -12000, category: 'expense', description: 'Monthly Rent' });
                          addNotification({ type: 'info', title: 'Rent Paid', message: '₹12,000 deducted for rent', duration: 3000 });
                        }}
                        className="group bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-rotate-2 transition-all duration-500"
                      >
                        <div className="text-4xl mb-3 group-hover:animate-bounce">🏠</div>
                        <div className="text-lg font-bold">Pay Rent</div>
                        <div className="text-sm opacity-90 mt-1">₹12,000</div>
                        <div className="text-xs opacity-75 mt-2">Housing</div>
                      </button>
                      
                      <button 
                        onClick={() => {
                          addTransaction({ amount: -4000, category: 'expense', description: 'Groceries & Daily Needs' });
                          addNotification({ type: 'info', title: 'Groceries Paid', message: '₹4,000 spent on essentials', duration: 3000 });
                        }}
                        className="group bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-rotate-2 transition-all duration-500"
                      >
                        <div className="text-4xl mb-3 group-hover:animate-bounce">🛒</div>
                        <div className="text-lg font-bold">Groceries</div>
                        <div className="text-sm opacity-90 mt-1">₹4,000</div>
                        <div className="text-xs opacity-75 mt-2">Daily Essentials</div>
                      </button>
                    </div>
                  </div>

                  {/* Premium Tree Visualization */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <span className="mr-3 text-3xl animate-pulse">🌳</span>
                        Your Financial Growth Tree
                      </h3>
                      <div className="flex space-x-3">
                        <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200">
                          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                          Health: Excellent
                        </div>
                        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                          Growing Strong
                        </div>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl">
                      <TreeVisualizationNew 
                        balance={totalBalance}
                        income={totalIncome}
                        expenses={totalExpenses}
                        savings={totalSavings}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                  {/* Financial Story Enhanced */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2 text-2xl">📖</span>
                      Your Financial Story
                    </h3>
                    <FinancialStoryPanel 
                      balance={totalBalance}
                      income={totalIncome}
                      expenses={totalExpenses}
                      savings={totalSavings}
                      transactions={transactions}
                    />
                  </div>

                  {/* Enhanced UPI Panel */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <span className="mr-2 text-2xl">💳</span>
                        UPI Quick Pay
                      </h3>
                      <div className="space-y-4">
                        <button 
                          onClick={() => {
                            const amount = prompt("Enter deposit amount (₹):");
                            if (amount && Number(amount) > 0) {
                              addTransaction({ 
                                amount: Number(amount), 
                                category: 'income', 
                                description: 'UPI Instant Deposit' 
                              });
                              addNotification({
                                type: 'success',
                                title: 'UPI Success!',
                                message: `₹${amount} deposited instantly via UPI`,
                                duration: 4000
                              });
                            }
                          }}
                          className="w-full bg-white/20 hover:bg-white/30 rounded-2xl p-4 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-2xl">🚀</span>
                            <div>
                              <div className="font-bold">Instant Deposit</div>
                              <div className="text-sm opacity-90">Add money to wallet</div>
                            </div>
                          </div>
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setShowUPISettings(true)}
                            className="bg-white/20 hover:bg-white/30 rounded-xl p-3 transition-all duration-300 text-center"
                          >
                            <div className="text-xl mb-1">⚙️</div>
                            <div className="text-sm font-medium">Settings</div>
                          </button>
                          <div className="bg-white/10 rounded-xl p-3 text-center">
                            <div className="text-xl mb-1">🔒</div>
                            <div className="text-sm font-medium">Secure</div>
                          </div>
                        </div>
                        
                        <div className="text-center text-sm opacity-90">
                          <p>🔒 Bank-grade encryption</p>
                          <p>💳 All UPI apps supported</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity - Full Width Landscape */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold text-gray-800 flex items-center">
                    <span className="mr-3 text-4xl">📊</span>
                    Recent Activity Dashboard
                  </h3>
                  <div className="flex space-x-3">
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                      Live Tracking
                    </div>
                    <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200">
                      {transactions.length} Transactions
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                  <TransactionPanel 
                    transactions={transactions}
                    onAddTransaction={addTransaction}
                  />
                </div>
              </div>

              {/* Advanced Analytics Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Statistics Panel */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                    <h2 className="text-2xl font-bold flex items-center">
                      <span className="mr-3 text-3xl">📊</span>
                      Financial Analytics
                    </h2>
                    <p className="text-blue-100 mt-2">Advanced insights and trends</p>
                  </div>
                  <div className="p-6">
                    <StatisticsPanel transactions={transactions} />
                  </div>
                </div>

                {/* AI Analysis Panel */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-6">
                    <h2 className="text-2xl font-bold flex items-center">
                      <span className="mr-3 text-3xl">🤖</span>
                      AI Financial Advisor
                    </h2>
                    <p className="text-emerald-100 mt-2">Smart recommendations powered by AI</p>
                  </div>
                  <div className="p-6">
                    <AIAnalysisPanel transactions={transactions} />
                  </div>
                </div>
              </div>

              {/* Financial Health Score */}
              <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                <div className="relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl font-bold mb-4 flex items-center">
                        <span className="mr-3 text-4xl">🏆</span>
                        Financial Health Score
                      </h3>
                      <div className="text-6xl font-bold mb-2">
                        {Math.min(100, Math.round((totalBalance / 100000) * 30 + (totalSavings / totalIncome * 100) * 0.7))}
                        <span className="text-3xl">/100</span>
                      </div>
                      <p className="text-purple-200 text-lg">Excellent financial health!</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200">Emergency Fund</span>
                        <span className="font-bold">85%</span>
                      </div>
                      <div className="w-full bg-purple-800/50 rounded-full h-3">
                        <div className="bg-white h-3 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200">Investment Ratio</span>
                        <span className="font-bold">72%</span>
                      </div>
                      <div className="w-full bg-purple-800/50 rounded-full h-3">
                        <div className="bg-white h-3 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200">Expense Control</span>
                        <span className="font-bold">91%</span>
                      </div>
                      <div className="w-full bg-purple-800/50 rounded-full h-3">
                        <div className="bg-white h-3 rounded-full" style={{width: '91%'}}></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <span className="text-6xl">🌟</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Keep Growing!</h4>
                      <p className="text-purple-200">You're on track for financial success</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'goals':
        return (
          <div className="flex flex-col lg:flex-row gap-6 h-screen max-h-[calc(100vh-120px)]">
            {/* Goals Panel - Takes most of the width */}
            <div className="flex-1 lg:flex-[3]">
              <Goals 
                balance={totalBalance}
                savings={totalSavings}
              />
            </div>
            
            {/* Transaction Panel - Takes smaller width */}
            <div className="lg:flex-1 lg:max-w-sm">
              <TransactionPanel 
                transactions={transactions}
                onAddTransaction={addTransaction}
              />
            </div>
          </div>
        )
      case 'predictions':
        return (
          <div className="flex flex-col lg:flex-row gap-6 h-screen max-h-[calc(100vh-120px)]">
            {/* Predictions Panel - Takes most of the width */}
            <div className="flex-1 lg:flex-[3]">
              <Predictions 
                balance={totalBalance}
                income={totalIncome}
                expenses={totalExpenses}
                savings={totalSavings}
                transactions={transactions}
              />
            </div>
            
            {/* Transaction Panel - Takes smaller width */}
            <div className="lg:flex-1 lg:max-w-sm">
              <TransactionPanel 
                transactions={transactions}
                onAddTransaction={addTransaction}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="w-full px-1 py-1">
        {renderContent()}
      </div>

      {/* UPI Settings Modal */}
      {showUPISettings && (
        <UPISettings 
          onClose={() => setShowUPISettings(false)}
          onAddTransaction={addTransaction}
        />
      )}

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onClose={removeNotification}
      />

      {/* Professional Footer */}
      <Footer />
    </div>
  )
}

export default App
