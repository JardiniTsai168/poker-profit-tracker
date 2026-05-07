'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Session {
  id: number;
  date: string;
  gameType: string;
  location: string;
  stakes?: string;
  buyIn: number;
  cashOut: number;
  profit: number;
}

export default function SessionsPage() {
  // Read from localStorage on mount
  const [sessions] = useState<Session[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('poker-sessions');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

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
          {sessions.length === 0 ? (
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
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Sessions</h2>
                <p className="text-sm text-gray-500">{sessions.length} session(s) | Total Profit: ${sessions.reduce((sum, s) => sum + s.profit, 0).toFixed(2)}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Buy In</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cash Out</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.sort((a, b) => b.id - a.id).map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.gameType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${session.buyIn.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${session.cashOut.toFixed(2)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                          session.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${session.profit.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/sessions/${session.id}`} className="text-blue-600 hover:text-blue-900">
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
