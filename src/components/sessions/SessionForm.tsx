'use client';

import { useState } from 'react';

interface SessionData {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  gameType: string;
  stakes: string;
  buyIn: number;
  cashOut: number;
  profit: number;
  notes: string;
  createdAt: string;
}

export default function SessionForm() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    location: '',
    gameType: '',
    stakes: '',
    buyIn: 0,
    cashOut: 0,
    profit: 0,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.location || !formData.gameType || !formData.date) {
      setMessage({ type: 'error', text: 'Please fill in required fields' });
      return false;
    }

    const session: SessionData = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    try {
      // Get existing sessions
      const existing = localStorage.getItem('poker-sessions');
      const sessions: SessionData[] = existing ? JSON.parse(existing) : [];
      
      // Add new session
      sessions.push(session);
      
      // Save back to localStorage
      localStorage.setItem('poker-sessions', JSON.stringify(sessions));
      
      console.log('✅ Saved to localStorage:', session);
      console.log('Total sessions:', sessions.length);
      
      // Verify save
      const verify = localStorage.getItem('poker-sessions');
      console.log('Verification - stored data:', verify);
      
      setMessage({ type: 'success', text: 'Session saved! Redirecting...' });
      
      // Clear form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        location: '',
        gameType: '',
        stakes: '',
        buyIn: 0,
        cashOut: 0,
        profit: 0,
        notes: '',
      });

      // Redirect after delay
      setTimeout(() => {
        window.location.href = '/sessions';
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('❌ Save failed:', error);
      setMessage({ type: 'error', text: 'Failed to save: ' + (error as Error).message });
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted!');
    setIsSubmitting(true);
    setMessage(null);
    
    // Small delay to show UI feedback
    setTimeout(() => {
      handleSave();
      setIsSubmitting(false);
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Fill in required fields (*). Profit auto-calculates.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Game Type *</label>
          <select
            name="gameType"
            required
            value={formData.gameType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            <option value="Cash Game">Cash Game</option>
            <option value="Tournament">Tournament</option>
            <option value="Sit & Go">Sit & Go</option>
            <option value="Home Game">Home Game</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., CTP"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stakes</label>
          <input
            type="text"
            name="stakes"
            value={formData.stakes}
            onChange={handleChange}
            placeholder="$1/$2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buy In ($) *</label>
          <input
            type="number"
            name="buyIn"
            required
            min="0"
            step="0.01"
            value={formData.buyIn}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cash Out ($) *</label>
          <input
            type="number"
            name="cashOut"
            required
            min="0"
            step="0.01"
            value={formData.cashOut}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-1">Profit ($)</label>
        <input
          type="number"
          readOnly
          value={formData.profit}
          className={`w-full px-3 py-2 border rounded-md text-lg font-semibold ${
            formData.profit >= 0 ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
          }`}
        />
        <p className="text-xs text-gray-500 mt-1">Auto-calculated: Cash Out - Buy In</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any notes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold text-lg"
        >
          {isSubmitting ? '⏳ Saving...' : '✓ Create Session'}
        </button>
        <a
          href="/sessions"
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 text-center font-semibold"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
