'use client';

import { useState, useEffect } from 'react';
import { PokerSession, SessionFilters } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface SessionListProps {
  sessions: PokerSession[];
}

export default function SessionList({ sessions: initialSessions }: SessionListProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<PokerSession[]>(initialSessions);
  const [filters, setFilters] = useState<SessionFilters>({
    search: '',
    dateFrom: '',
    dateTo: '',
    gameType: '',
    location: '',
    profitFilter: 'all',
  });

  const handleFilterChange = (key: keyof SessionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredSessions = sessions.filter(session => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        session.location.toLowerCase().includes(searchLower) ||
        session.gameType.toLowerCase().includes(searchLower) ||
        (session.notes && session.notes.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    
    if (filters.dateFrom && session.date < filters.dateFrom) return false;
    if (filters.dateTo && session.date > filters.dateTo) return false;
    if (filters.gameType && session.gameType !== filters.gameType) return false;
    if (filters.location && session.location !== filters.location) return false;
    
    if (filters.profitFilter && filters.profitFilter !== 'all') {
      if (filters.profitFilter === 'positive' && session.profit <= 0) return false;
      if (filters.profitFilter === 'negative' && session.profit >= 0) return false;
    }
    
    return true;
  });

  const totalProfit = sessions.reduce((sum, s) => sum + s.profit, 0);
  const filteredTotalProfit = filteredSessions.reduce((sum, s) => sum + s.profit, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Location, game type, notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="dateFrom"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="dateTo"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="gameType" className="block text-sm font-medium text-gray-700 mb-1">
              Game Type
            </label>
            <select
              id="gameType"
              value={filters.gameType || ''}
              onChange={(e) => handleFilterChange('gameType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="Cash Game">Cash Game</option>
              <option value="Tournament">Tournament</option>
              <option value="Sit & Go">Sit & Go</option>
              <option value="Home Game">Home Game</option>
            </select>
          </div>

          <div>
            <label htmlFor="profitFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Profit
            </label>
            <select
              id="profitFilter"
              value={filters.profitFilter || 'all'}
              onChange={(e) => handleFilterChange('profitFilter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setFilters({
            search: '',
            dateFrom: '',
            dateTo: '',
            gameType: '',
            location: '',
            profitFilter: 'all',
          })}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all filters
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sessions</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </p>
          <p className={`text-lg font-semibold ${filteredTotalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Total Profit: ${filteredTotalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stakes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buy In
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cash Out
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No sessions found. Create your first session!
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.gameType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.stakes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${session.buyIn.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${session.cashOut.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                    session.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${session.profit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/sessions/${session.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
