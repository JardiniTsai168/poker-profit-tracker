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

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      console.log('Loading sessions...');
      const allSessions = await getAllSessions();
      console.log('Sessions loaded:', allSessions.length);
      setSessions(allSessions.sort((a, b) => b.date.localeCompare(a.date)));
    } catch (error) {
      console.error('Error loading sessions:', error);
      alert('Error loading sessions: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading sessions...</p>
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
