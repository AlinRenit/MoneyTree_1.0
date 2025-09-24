import { useState } from 'react'
import Navigation from './components/Navigation'
import TreeVisualization from './components/TreeVisualization'
import TransactionPanel from './components/TransactionPanel'
import FinancialStoryPanel from './components/FinancialStoryPanel'
import './App.css'

interface Transaction {
  id: string
  amount: number
  category: 'income' | 'expense' | 'saving'
  description: string
  date: Date
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 5000, category: 'income', description: 'Salary', date: new Date('2025-09-20') },
    { id: '2', amount: -1200, category: 'expense', description: 'Rent', date: new Date('2025-09-21') },
    { id: '3', amount: 500, category: 'saving', description: 'Emergency Fund', date: new Date('2025-09-22') }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="container mx-auto px-4 py-6">
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
          <div className="lg:col-span-2 order-1 lg:order-2">
            <TreeVisualization 
              balance={totalBalance}
              income={totalIncome}
              expenses={totalExpenses}
              savings={totalSavings}
            />
          </div>
          
          {/* Transaction Panel - Right */}
          <div className="lg:col-span-1 order-2 lg:order-3">
            <TransactionPanel 
              transactions={transactions}
              onAddTransaction={addTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
