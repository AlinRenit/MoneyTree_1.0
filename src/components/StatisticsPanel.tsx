import React from 'react';
import type { Transaction } from '../App';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface StatisticsPanelProps {
  transactions: Transaction[];
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ transactions }) => {
  const income = transactions.filter((t: Transaction) => t.category === 'income').reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const expenses = Math.abs(transactions.filter((t: Transaction) => t.category === 'expense').reduce((sum: number, t: Transaction) => sum + t.amount, 0));
  const savings = transactions.filter((t: Transaction) => t.category === 'saving').reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const barData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        label: 'Amount',
        data: [income, expenses, savings],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
      },
    ],
  };

  const pieData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        data: [income, expenses, savings],
        backgroundColor: ['#4ade80', '#f87171', '#fbbf24'],
      },
    ],
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }}>
      <h3 style={{ marginBottom: '1rem' }}>Financial Statistics</h3>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ width: '300px' }}>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div style={{ width: '200px' }}>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
