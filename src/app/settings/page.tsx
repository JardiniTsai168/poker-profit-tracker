'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const GAME_TYPES = ['Cash Game', 'Tournament', 'Sit & Go', 'Home Game'];

interface Settings {
  defaultLocation: string;
  defaultStakes: string;
  defaultGameType: string;
  currency: string;
  timeFormat: '12h' | '24h';
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    defaultLocation: '',
    defaultStakes: '',
    defaultGameType: '',
    currency: 'USD',
    timeFormat: '24h',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('poker-tracker-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      localStorage.setItem('poker-tracker-settings', JSON.stringify(settings));
      setMessage('✅ Settings saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('❌ Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear ALL session data? This cannot be undone.')) {
      if (confirm('Really sure? All your poker sessions will be permanently deleted.')) {
        localStorage.removeItem('poker-sessions');
        localStorage.removeItem('poker-tracker-settings');
        alert('✅ All data cleared!');
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/sessions" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
            ← Back to Sessions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Settings</h1>
        </header>

        <div className="space-y-8">
          {/* Default Values */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Default Values</h2>
            <p className="text-sm text-gray-500 mb-6">These values will be pre-filled when creating a new session</p>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Location
                  </label>
                  <input
                    type="text"
                    value={settings.defaultLocation}
                    onChange={(e) => handleChange('defaultLocation', e.target.value)}
                    placeholder="e.g., CTP, Home"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Game Type
                  </label>
                  <select
                    value={settings.defaultGameType}
                    onChange={(e) => handleChange('defaultGameType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None</option>
                    {GAME_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Stakes
                  </label>
                  <input
                    type="text"
                    value={settings.defaultStakes}
                    onChange={(e) => handleChange('defaultStakes', e.target.value)}
                    placeholder="e.g., $1/$2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="TWD">TWD (NT$)</option>
                    <option value="CNY">CNY (¥)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Format
                  </label>
                  <select
                    value={settings.timeFormat}
                    onChange={(e) => handleChange('timeFormat', e.target.value as '12h' | '24h')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="24h">24-hour (14:30)</option>
                    <option value="12h">12-hour (2:30 PM)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {isSaving ? '⏳ Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </form>

            {message && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-800 border border-green-200">
                {message}
              </div>
            )}
          </section>

          {/* Data Management */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Data Management</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Export Data (Coming Soon)</h3>
                <p className="text-sm text-yellow-700">
                  Export your sessions to CSV or JSON format for backup or analysis.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Import Data (Coming Soon)</h3>
                <p className="text-sm text-blue-700">
                  Import sessions from a CSV or JSON file.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-3">
                  Permanently delete all your session data. This action cannot be undone.
                </p>
                <button
                  onClick={handleClearData}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
                >
                  🗑️ Clear All Data
                </button>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">ℹ️ About</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Poker Profit Tracker</strong> - Track your poker sessions and analyze your profits</p>
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Data Storage:</strong> All data is stored locally in your browser using IndexedDB</p>
              <p><strong>Privacy:</strong> Your data never leaves your device unless you choose to export it</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
