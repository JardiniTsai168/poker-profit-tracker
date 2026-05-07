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

const INITIAL_FORM_DATA = {
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
};

export default function SessionForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value,
    }));
  };

  const saveToStorage = (session: SessionData) => {
    let sessions: SessionData[] = [];
    const existing = localStorage.getItem('poker-sessions');
    if (existing) {
      try {
        sessions = JSON.parse(existing);
      } catch (e) {
        console.error('Failed to parse existing sessions:', e);
      }
    }
    sessions.push(session);
    localStorage.setItem('poker-sessions', JSON.stringify(sessions));
    console.log('✅ Saved to localStorage. Total sessions:', sessions.length);
    console.log('Stored data:', localStorage.getItem('poker-sessions'));
  };

  const handleSubmitClick = () => {
    console.log('🔘 Button clicked!');
    
    // Check required fields
    if (!formData.date || !formData.gameType || !formData.location || !formData.buyIn || !formData.cashOut) {
      alert('⚠️ Please fill in all required fields:\n- Date\n- Game Type\n- Location\n- Buy In\n- Cash Out');
      return;
    }

    setIsSubmitting(true);

    try {
      const session: SessionData = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };

      console.log('📝 Data to save:', session);
      saveToStorage(session);

      alert('✅ Session saved successfully!\n\nID: ' + session.id + '\nProfit: $' + session.profit.toFixed(2) + '\n\nRedirecting to sessions list...');

      // Reset form
      setFormData(INITIAL_FORM_DATA);

      // Redirect
      setTimeout(() => {
        window.location.href = '/sessions';
      }, 1500);

    } catch (error) {
      console.error('❌ Save error:', error);
      alert('❌ Error saving:\n' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Required fields are marked with *
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Game Type *</label>
          <select
            name="gameType"
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
          type="button"
          onClick={handleSubmitClick}
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
    </div>
  );
}
