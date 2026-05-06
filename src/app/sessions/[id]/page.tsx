'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SessionDetail from '@/components/sessions/SessionDetail';
import { getSessionById, updateSession, deleteSession } from '@/lib/db';
import { PokerSession } from '@/lib/types';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<PokerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, [params.id]);

  const loadSession = async () => {
    try {
      const id = parseInt(params.id as string);
      if (isNaN(id)) {
        setError('Invalid session ID');
        return;
      }
      const data = await getSessionById(id);
      if (!data) {
        setError('Session not found');
        return;
      }
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
      setError('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: Partial<PokerSession>) => {
    const id = parseInt(params.id as string);
    await updateSession(id, data);
    await loadSession();
  };

  const handleDelete = async () => {
    const id = parseInt(params.id as string);
    await deleteSession(id);
    router.push('/sessions');
  };

  const handleBack = () => {
    router.push('/sessions');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading session...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error || 'Session not found'}</p>
        <button
          onClick={() => router.push('/sessions')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <SessionDetail
        session={session}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}
