import { useState } from 'react'
import Navigation from './components/Navigation'
import TreeVisualizationNew from './components/TreeVisualizationNew'
import TransactionPanel from './components/TransactionPanel'
import FinancialStoryPanel from './components/FinancialStoryPanel'
import AIAnalysisPanel from './components/AIAnalysisPanel'
import StatisticsPanel from './components/StatisticsPanel'
import Goals from './components/Goals'
import Predictions from './components/Predictions'
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

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date()
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter(t => t.category === 'expense').reduce((sum, t) => sum + t.amount, 0))
  const totalSavings = transactions.filter(t => t.category === 'saving').reduce((sum, t) => sum + t.amount, 0)

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen max-h-[calc(100vh-120px)]">
            {/* Financial Story Panel - Left */}
            <div className="lg:col-span-1 order-3 lg:order-1">
              <FinancialStoryPanel 
                balance={totalBalance}
                income={totalIncome}
                expenses={totalExpenses}
                savings={totalSavings}
                transactions={transactions}
              />
            </div>

            {/* Tree Visualization - Center */}
            <div className="lg:col-span-2 order-1 lg:order-2 overflow-y-auto max-h-[calc(100vh-140px)]">
              {/* Tree Growth Test Buttons */}
              <div className="mb-4 flex flex-wrap gap-2 justify-center">
                <button 
                  onClick={() => addTransaction({ amount: 20000, category: 'income', description: 'Bonus Income' })}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  💰 +₹20,000 Income
                </button>
                <button 
                  onClick={() => addTransaction({ amount: 10000, category: 'saving', description: 'Quick Savings' })}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  🍎 +₹10,000 Savings
                </button>
                <button 
                  onClick={() => addTransaction({ amount: 50000, category: 'income', description: 'Big Bonus' })}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  🌳 +₹50,000 Wealth
                </button>
              </div>

              <TreeVisualizationNew 
                balance={totalBalance}
                income={totalIncome}
                expenses={totalExpenses}
                savings={totalSavings}
              />

              {/* AI Analysis, Chat, and Statistics Panels */}
              <div className="mt-8">
                {/* AI Analysis Panel */}
                <div className="mb-8">
                  <AIAnalysisPanel transactions={transactions} />
                  <StatisticsPanel transactions={transactions} />
                </div>
              </div>
            </div>

            {/* Transaction Panel - Right */}
            <div className="lg:col-span-1 order-2 lg:order-3">
              <TransactionPanel 
                transactions={transactions}
                onAddTransaction={addTransaction}
              />
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
      
      <div className="w-full px-2 py-4">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
