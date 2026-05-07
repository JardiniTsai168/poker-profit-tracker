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
  updatedAt: string;
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
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const saveToLocalStorage = (session: SessionData) => {
    try {
      // Get existing sessions
      const existing = localStorage.getItem('poker-sessions');
      const sessions: SessionData[] = existing ? JSON.parse(existing) : [];
      
      // Add new session
      sessions.push(session);
      
      // Save back
      localStorage.setItem('poker-sessions', JSON.stringify(sessions));
      
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDebugInfo('Validating form...');
    
    if (!formData.location || !formData.gameType || !formData.date || !formData.buyIn || !formData.cashOut) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      setDebugInfo('Creating session data...');
      
      const session: SessionData = {
        id: Date.now(), // Simple unique ID
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDebugInfo('Saving to localStorage...');
      
      // Try localStorage first (more reliable)
      const success = saveToLocalStorage(session);
      
      if (success) {
        setDebugInfo('✅ Success! ID: ' + session.id);
        alert('✅ Session created successfully!\nID: ' + session.id);
        
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

        // Redirect
        setTimeout(() => {
          window.location.href = '/sessions';
        }, 1000);
      } else {
        throw new Error('Failed to save to localStorage');
      }

    } catch (error) {
      const errorMsg = (error as Error).message;
      setDebugInfo('❌ Error: ' + errorMsg);
      alert('❌ Failed to create session:\n' + errorMsg + '\n\nDebug: ' + debugInfo);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Note:</strong> Data is stored locally in your browser. Clearing browser data will delete your sessions.
        </p>
      </div>

      {debugInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-mono">{debugInfo}</p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Game Type *</label>
          <select
            name="gameType"
            required
            value={formData.gameType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {isSubmitting ? '⏳ Saving...' : '✓ Create Session'}
        </button>
        <a href="/sessions" className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg text-center font-semibold hover:bg-gray-300">
          Cancel
        </a>
      </div>
    </form>
  );
}
