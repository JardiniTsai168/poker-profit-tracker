'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/db';

export default function SessionForm() {
  const router = useRouter();
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

  useEffect(() => {
    const profit = formData.cashOut - formData.buyIn;
    setFormData(prev => ({ ...prev, profit }));
  }, [formData.buyIn, formData.cashOut]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    console.log('[Form] Changed', name, 'to', value);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Form] Submitting...', formData);
    
    if (!formData.location || !formData.gameType || !formData.date) {
      alert('Please fill in all required fields (Date, Game Type, Location, Buy In, Cash Out)');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('[Form] Calling createSession...');
      const id = await createSession(formData);
      console.log('[Form] Session created with ID:', id);
      alert('Session created successfully!');
      window.location.href = '/sessions';
    } catch (error) {
      console.error('[Form] Error:', error);
      alert('Failed to create session: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Fill in the required fields (*). Profit is calculated automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="gameType" className="block text-sm font-medium text-gray-700 mb-1">
            Game Type *
          </label>
          <select
            id="gameType"
            name="gameType"
            required
            value={formData.gameType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select game type</option>
            <option value="Cash Game">Cash Game</option>
            <option value="Tournament">Tournament</option>
            <option value="Sit & Go">Sit & Go</option>
            <option value="Home Game">Home Game</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., CTP, Home, PokerStars"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="stakes" className="block text-sm font-medium text-gray-700 mb-1">
            Stakes
          </label>
          <input
            type="text"
            id="stakes"
            name="stakes"
            value={formData.stakes}
            onChange={handleChange}
            placeholder="e.g., $1/$2, $10 NL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="buyIn" className="block text-sm font-medium text-gray-700 mb-1">
            Buy In ($) *
          </label>
          <input
            type="number"
            id="buyIn"
            name="buyIn"
            required
            min="0"
            step="0.01"
            value={formData.buyIn}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cashOut" className="block text-sm font-medium text-gray-700 mb-1">
            Cash Out ($) *
          </label>
          <input
            type="number"
            id="cashOut"
            name="cashOut"
            required
            min="0"
            step="0.01"
            value={formData.cashOut}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <label htmlFor="profit" className="block text-sm font-medium text-gray-700 mb-1">
          Profit ($)
        </label>
        <input
          type="number"
          id="profit"
          name="profit"
          readOnly
          value={formData.profit}
          className={`w-full px-3 py-2 border rounded-md shadow-sm text-lg font-semibold ${
            formData.profit >= 0 
              ? 'bg-green-50 border-green-300 text-green-800' 
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        />
        <p className="text-xs text-gray-500 mt-1">Calculated as: Cash Out - Buy In</p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any notes about this session (opponents, strategy, results)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-semibold text-lg"
        >
          {isSubmitting ? '⏳ Saving...' : '✓ Create Session'}
        </button>
        <a
          href="/sessions"
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center font-semibold"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
