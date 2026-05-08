'use client';

import { useState, useEffect, useCallback } from 'react';

interface Session {
  id: number;
  date: string;
  gameType: string;
  location: string;
  stakes?: string;
  startTime?: string;
  endTime?: string;
  buyIn: number;
  cashOut: number;
  profit: number;
  notes?: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    gameType: '',
    location: '',
    stakes: '',
    startTime: '',
    endTime: '',
    buyIn: '',
    cashOut: '',
    notes: '',
  });

  // Load sessions when component mounts
  useEffect(() => {
    const saved = localStorage.getItem('poker-sessions');
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        console.log('✅ Loaded', loaded.length, 'sessions from localStorage');
        setSessions(loaded);
      } catch (e) {
        console.error('❌ Failed to load sessions:', e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profit = parseFloat(formData.cashOut || '0') - parseFloat(formData.buyIn || '0');
    
    const newSession: Session = {
      id: Date.now(),
      date: formData.date,
      gameType: formData.gameType,
      location: formData.location,
      stakes: formData.stakes,
      startTime: formData.startTime,
      endTime: formData.endTime,
      buyIn: parseFloat(formData.buyIn || '0'),
      cashOut: parseFloat(formData.cashOut || '0'),
      profit,
      notes: formData.notes,
    };

    const updatedSessions = [...sessions, newSession];
    localStorage.setItem('poker-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    
    console.log('✅ Session saved:', newSession);
    console.log('Total sessions:', updatedSessions.length);
    console.log('localStorage content:', localStorage.getItem('poker-sessions'));
    
    alert('✅ Session created!\nProfit: $' + profit.toFixed(2) + '\n\nNow showing list...');
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      gameType: '',
      location: '',
      stakes: '',
      startTime: '',
      endTime: '',
      buyIn: '',
      cashOut: '',
      notes: '',
    });
  };

  const handleDelete = useCallback((id: number) => {
    if (!confirm('Delete this session?')) return;
    const updated = sessions.filter(s => s.id !== id);
    localStorage.setItem('poker-sessions', JSON.stringify(updated));
    setSessions(updated);
    alert('Session deleted');
  }, [sessions]);

  const toggleForm = useCallback(() => {
    console.log('🔘 Toggle clicked!');
    setShowForm((prev) => {
      console.log('showForm was:', prev, 'now:', !prev);
      return !prev;
    });
  }, []);

  const totalProfit = sessions.reduce((sum, s) => sum + s.profit, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🃏 Poker Profit Tracker</h1>
            <p className="text-sm text-gray-500 mt-1">
              {sessions.length} session(s) | Total: ${totalProfit.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
          >
            {showForm ? '✕ Cancel' : '+ New Session'}
          </button>
        </header>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">📝 New Session</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Game Type *</label>
                  <select
                    required
                    value={formData.gameType}
                    onChange={(e) => setFormData({...formData, gameType: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select...</option>
                    <option value="Cash Game">💵 Cash Game</option>
                    <option value="Tournament">🏆 Tournament</option>
                    <option value="Sit & Go">⚡ Sit & Go</option>
                    <option value="Home Game">🏠 Home Game</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., CTP, Home, PokerStars"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stakes</label>
                  <input
                    type="text"
                    value={formData.stakes}
                    onChange={(e) => setFormData({...formData, stakes: e.target.value})}
                    placeholder="$1/$2"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Buy In ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.buyIn}
                    onChange={(e) => setFormData({...formData, buyIn: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cash Out ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.cashOut}
                    onChange={(e) => setFormData({...formData, cashOut: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any notes about this session..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-bold text-lg shadow-md"
                >
                  💾 Save Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400 font-bold text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <main className="bg-white rounded-xl shadow-md p-6">
          {sessions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🀄</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">No Sessions Yet</h2>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Start tracking your poker profits today!
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 font-bold text-xl shadow-lg inline-flex items-center gap-2"
              >
                <span>+</span>
                <span>Create Your First Session</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2">
                <h2 className="text-2xl font-bold text-gray-900">📊 Your Sessions</h2>
                <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Total Profit: ${totalProfit.toFixed(2)}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Game</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Buy In</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Cash Out</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Profit</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sessions.sort((a, b) => b.id - a.id).map((session) => (
                      <tr key={session.id} className="hover:bg-blue-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{session.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{session.gameType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{session.location}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">${session.buyIn.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">${session.cashOut.toFixed(2)}</td>
                        <td className={`px-4 py-3 text-sm font-bold text-right ${
                          session.profit >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        } rounded-lg`}>
                          ${session.profit.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(session.id)}
                            className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded font-medium transition"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>💡 All data is stored locally in your browser</p>
        </footer>
      </div>
    </div>
  );
}
