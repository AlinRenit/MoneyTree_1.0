
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
    try {
      const data = await geminiProRequest(chatInput, apiKey, true, chatHistory);
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
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>AI Financial Analysis</h2>
      <button onClick={handleAnalyze} disabled={loading} style={{ marginBottom: '1rem' }}>
        {loading ? 'Analyzing...' : 'Analyze My Transactions'}
      </button>
      {analysis && <div style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{analysis}</div>}
      <form onSubmit={handleAsk} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask a question about your finances..."
          style={{ flex: 1, padding: '0.5rem' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question}>
          {loading ? 'Answering...' : 'Ask AI'}
        </button>
      </form>
      {answer && <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>{answer}</div>}

      <h3>Gemini Pro Chat</h3>
      <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={chatInput}
          onChange={handleChatInputChange}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '0.5rem' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !chatInput}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{chatResponse}</div>
      {chatHistory.length > 0 && (
        <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#f9f9f9', padding: '0.5rem', borderRadius: '4px' }}>
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '0.5rem' }}>
              <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong> {msg.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
