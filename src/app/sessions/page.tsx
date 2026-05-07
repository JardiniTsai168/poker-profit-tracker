'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SessionList from '@/components/sessions/SessionList';
import { getAllSessions } from '@/lib/db';
import { PokerSession } from '@/lib/types';

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
    
    // Timeout detection
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('Loading is taking longer than expected. Please refresh the page.');
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);

  const loadSessions = async () => {
    try {
      console.log('[Sessions] Loading...');
      const allSessions = await getAllSessions();
      console.log('[Sessions] Loaded:', allSessions.length, 'sessions');
      setSessions(allSessions.sort((a, b) => b.date.localeCompare(a.date)));
      setError(null);
    } catch (err) {
      consterrorMsg=(err as Error).message;
      console.error('[Sessions] Error:', err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Loading sessions...</p>
          <p className="text-sm text-gray-400">Checking database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-red-600 font-bold mb-4">Error Loading Sessions</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Poker Profit Tracker</h1>
          <button
            onClick={() => router.push('/sessions/new')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            + New Session
          </button>
        </div>

        <SessionList sessions={sessions} />
      </div>
    </div>
  );
}
