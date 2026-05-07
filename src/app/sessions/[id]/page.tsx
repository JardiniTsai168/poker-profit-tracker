'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SessionDetail from '@/components/sessions/SessionDetail';
import { getSessionById, updateSession, deleteSession } from '@/lib/db';
import { PokerSession } from '@/lib/types';

export default function SessionDetailPage() {
  const params = useParams();
  const [session, setSession] = useState<PokerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    window.location.href = `/sessions/${id}`;
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this session? This cannot be undone.')) {
      setIsDeleting(true);
      try {
        const id = parseInt(params.id as string);
        await deleteSession(id);
        window.location.href = '/sessions';
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session');
      } finally {
        setIsDeleting(false);
      }
    }
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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600">{error || 'Session not found'}</p>
        <Link href="/sessions" className="text-blue-600 hover:text-blue-800 underline">
          Back to Sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <SessionDetail
        session={session}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
