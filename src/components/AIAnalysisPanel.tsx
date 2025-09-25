
import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Transaction } from '../App';
import { geminiProRequest } from '../utils/geminiPro';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

interface AIAnalysisPanelProps {
  transactions: Transaction[];
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatResponse, setChatResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const prompt = `Analyze the following transactions. For each, state how much was earned and spent, give advice, and warn about possible problems if advice is ignored.\n${JSON.stringify(transactions)}`;
    try {
      const data = await geminiProRequest(prompt, apiKey);
      setAnalysis(data.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available.');
    } catch (err: any) {
      setAnalysis(`Error: ${err.message || err}`);
    }
    setLoading(false);
  };

  const handleAsk = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const prompt = `Given these transactions: ${JSON.stringify(transactions)}, answer the following user question: ${question}`;
    try {
      const data = await geminiProRequest(prompt, apiKey);
      setAnswer(data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer available.');
    } catch (err: any) {
      setAnswer(`Error: ${err.message || err}`);
    }
    setLoading(false);
  };

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  // Chat functionality
  const handleChatInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const handleSendChat = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput) return;
    setLoading(true);
    const newHistory = [...chatHistory, { role: 'user', content: chatInput }];
    
    // Create financial summary from transactions
    const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.category === 'expense').reduce((sum, t) => sum + t.amount, 0));
    const totalSavings = transactions.filter(t => t.category === 'saving').reduce((sum, t) => sum + t.amount, 0);
    
    const financialContext = `
FINANCIAL CONTEXT - You are helping a user with their personal finances based on their actual transaction data:

CURRENT FINANCIAL STATUS:
- Total Balance: ₹${totalBalance.toLocaleString()}
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpenses.toLocaleString()}
- Total Savings: ₹${totalSavings.toLocaleString()}

RECENT TRANSACTIONS:
${transactions.slice(0, 10).map(t => 
  `${t.date.toLocaleDateString()}: ${t.category.toUpperCase()} - ₹${t.amount.toLocaleString()} (${t.description})`
).join('\n')}

Based on this financial data, please answer the user's question: ${chatInput}
`;

    try {
      const data = await geminiProRequest(financialContext, apiKey, true, chatHistory);
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      setChatResponse(responseText);
      setChatHistory([...newHistory, { role: 'model', content: responseText }]);
      setChatInput('');
    } catch (err: any) {
      setChatResponse(`Error: ${err.message || err}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {!apiKey && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Warning:</strong> Gemini API key not found. Please add your API key to the .env file.
        </div>
      )}
      
      <div>
        <button 
          onClick={handleAnalyze} 
          disabled={loading || !apiKey}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze My Transactions'}
        </button>
      </div>
      
      {analysis && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">Analysis Results:</h4>
          <div className="whitespace-pre-wrap text-sm">{analysis}</div>
        </div>
      )}

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask a question about your finances..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading || !apiKey}
        />
        <button 
          type="submit" 
          disabled={loading || !question || !apiKey}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Asking...' : 'Ask AI'}
        </button>
      </form>

      {answer && (
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">AI Answer:</h4>
          <div className="whitespace-pre-wrap text-sm">{answer}</div>
        </div>
      )}

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">💬 Gemini Pro Chat</h3>
        <form onSubmit={handleSendChat} className="flex gap-2 mb-4">
          <input
            type="text"
            value={chatInput}
            onChange={handleChatInputChange}
            placeholder="hi"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading || !apiKey}
          />
          <button 
            type="submit" 
            disabled={loading || !chatInput || !apiKey}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {chatResponse && (
          <div className="bg-green-50 p-3 rounded-lg border mb-4">
            <strong>Gemini:</strong> <span className="whitespace-pre-wrap">{chatResponse}</span>
          </div>
        )}

        {chatHistory.length > 0 && (
          <div className="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-lg border">
            <h4 className="font-semibold mb-2">Chat History:</h4>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className="mb-2 p-2 rounded bg-white">
                <strong className={msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}>
                  {msg.role === 'user' ? 'You' : 'Gemini'}:
                </strong>{' '}
                <span className="text-sm">{msg.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
