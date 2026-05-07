'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllSessions } from '@/lib/db';
import { PokerSession } from '@/lib/types';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    console.log('[Sessions] useEffect triggered');
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      console.log('[Sessions] Starting loadSessions...');
      const allSessions = await getAllSessions();
      console.log('[Sessions] Got sessions:', allSessions.length);
      setSessions(allSessions.sort((a, b) => b.date.localeCompare(a.date)));
      setError(null);
    } catch (err) {
      console.error('[Sessions] Error loading:', err);
      setError('Failed to load: ' + (err as Error).message);
    } finally {
      console.log('[Sessions] Setting isLoading to false');
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  // Show loading for max 2 seconds, then show empty state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasLoaded) {
        console.log('[Sessions] Timeout - showing empty state');
        setIsLoading(false);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [hasLoaded]);

  console.log('[Sessions] Render - isLoading:', isLoading, 'sessions:', sessions.length);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Poker Profit Tracker</h1>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-gray-900 p-2"
              title="Settings"
            >
              ⚙️
            </Link>
          </div>
          <Link
            href="/sessions/new"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            + New Session
          </Link>
        </header>

        <main className="bg-white p-8 rounded-xl shadow-md">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600 font-medium">Loading your sessions...</p>
              <p className="text-sm text-gray-400 mt-2">Checking database</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  loadSessions();
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                🔄 Try Again
              </button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🃏</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Sessions Yet</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start tracking your poker profits by creating your first session
              </p>
              <Link
                href="/sessions/new"
                className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 font-semibold transition inline-flex items-center gap-2"
              >
                <span>+</span>
                <span>Create Your First Session</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Sessions</h2>
                <p className="text-sm text-gray-500">{sessions.length} session(s)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Buy In</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cash Out</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{session.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{session.gameType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{session.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${session.buyIn.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${session.cashOut.toFixed(2)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                          session.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${session.profit.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link
                            href={`/sessions/${session.id}`}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
