import React, { useState, useEffect } from 'react'

interface PredictionsProps {
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

interface Prediction {
  timeframe: string
  projectedBalance: number
  projectedSavings: number
  confidence: number
  insights: string[]
  recommendations: string[]
}

const Predictions: React.FC<PredictionsProps> = ({ 
  balance, 
  income, 
  expenses, 
  savings, 
  transactions 
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1month' | '3months' | '6months' | '1year'>('3months')

  useEffect(() => {
    generatePredictions()
  }, [balance, income, expenses, savings, transactions])

  const generatePredictions = () => {
    const netMonthlyIncome = income - expenses
    const savingsRate = income > 0 ? (netMonthlyIncome / income) * 100 : 0
    
    const timeframes = [
      { key: '1month', label: '1 Month', months: 1 },
      { key: '3months', label: '3 Months', months: 3 },
      { key: '6months', label: '6 Months', months: 6 },
      { key: '1year', label: '1 Year', months: 12 }
    ]

    const newPredictions: Prediction[] = timeframes.map(tf => {
      const projectedBalance = balance + (netMonthlyIncome * tf.months)
      const projectedSavings = savings + (Math.max(netMonthlyIncome * 0.2, 0) * tf.months)
      
      // Calculate confidence based on transaction history consistency
      const recentTransactions = transactions.slice(0, 10)
      const hasConsistentIncome = recentTransactions.filter(t => t.category === 'income').length > 0
      const confidence = hasConsistentIncome ? Math.min(95, 60 + (savingsRate * 0.5)) : 40

      // Generate insights
      const insights: string[] = []
      if (netMonthlyIncome > 0) {
        insights.push(`💰 You're saving $${netMonthlyIncome.toLocaleString()} per month`)
      } else {
        insights.push(`⚠️ You're spending $${Math.abs(netMonthlyIncome).toLocaleString()} more than you earn`)
      }
      
      if (savingsRate > 20) {
        insights.push(`🎯 Excellent savings rate of ${savingsRate.toFixed(1)}%`)
      } else if (savingsRate > 10) {
        insights.push(`👍 Good savings rate of ${savingsRate.toFixed(1)}%`)
      } else if (savingsRate > 0) {
        insights.push(`📈 Room to improve savings rate (${savingsRate.toFixed(1)}%)`)
      } else {
        insights.push(`🚨 Negative savings rate - expenses exceed income`)
      }

      // Generate recommendations
      const recommendations: string[] = []
      if (netMonthlyIncome < 0) {
        recommendations.push(`Reduce expenses by $${Math.abs(netMonthlyIncome).toLocaleString()} to break even`)
        recommendations.push(`Consider finding additional income sources`)
      } else if (savingsRate < 20) {
        recommendations.push(`Try to save an additional $${((income * 0.2) - netMonthlyIncome).toFixed(0)} monthly`)
        recommendations.push(`Review and cut unnecessary expenses`)
      } else {
        recommendations.push(`Consider investing your surplus for better returns`)
        recommendations.push(`You're on track for financial independence!`)
      }

      return {
        timeframe: tf.label,
        projectedBalance,
        projectedSavings,
        confidence,
        insights,
        recommendations
      }
    })

    setPredictions(newPredictions)
  }

  const getCurrentPrediction = () => {
    const timeframeMap = {
      '1month': '1 Month',
      '3months': '3 Months', 
      '6months': '6 Months',
      '1year': '1 Year'
    }
    return predictions.find(p => p.timeframe === timeframeMap[selectedTimeframe])
  }

  const currentPrediction = getCurrentPrediction()

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getBalanceColor = (balance: number) => {
    if (balance >= 10000) return 'text-green-600'
    if (balance >= 5000) return 'text-yellow-600'
    if (balance >= 0) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <h2 className="text-2xl font-bold text-tree-green mb-6">Financial Predictions</h2>
        
        {/* Timeframe Selection */}
        <div className="flex space-x-2 mb-6">
          {(['1month', '3months', '6months', '1year'] as const).map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-tree-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {timeframe === '1month' ? '1M' : 
               timeframe === '3months' ? '3M' :
               timeframe === '6months' ? '6M' : '1Y'}
            </button>
          ))}
        </div>

        {currentPrediction && (
          <>
            {/* Prediction Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Projected Balance</h3>
                <p className={`text-2xl font-bold ${getBalanceColor(currentPrediction.projectedBalance)}`}>
                  ${currentPrediction.projectedBalance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {currentPrediction.projectedBalance > balance ? '+' : ''}
                  ${(currentPrediction.projectedBalance - balance).toLocaleString()} from current
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Projected Savings</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${currentPrediction.projectedSavings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  +${(currentPrediction.projectedSavings - savings).toLocaleString()} growth
                </p>
              </div>
            </div>

            {/* Confidence Level */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Prediction Confidence</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(currentPrediction.confidence)}`}>
                  {currentPrediction.confidence.toFixed(0)}% Confident
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    currentPrediction.confidence >= 80 ? 'bg-green-500' : 
                    currentPrediction.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${currentPrediction.confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Insights */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Key Insights</h3>
              <div className="space-y-2">
                {currentPrediction.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600">💡</span>
                    <span className="text-blue-800 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Recommendations</h3>
              <div className="space-y-2">
                {currentPrediction.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600">🎯</span>
                    <span className="text-green-800 text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Health Score */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Financial Health Score</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      style={{ width: `${Math.min(currentPrediction.confidence, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-700">
                    {Math.round(currentPrediction.confidence)}/100
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Predictions
