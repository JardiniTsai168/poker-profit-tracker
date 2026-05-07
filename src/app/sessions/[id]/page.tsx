'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSessionById, updateSession, deleteSession } from '@/lib/db';
import { PokerSession } from '@/lib/types';

export default function SessionDetailPage() {
  const params = useParams();
  const [session, setSession] = useState<PokerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PokerSession>>({});

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
      setFormData(data);
    } catch (error) {
      console.error('Error loading session:', error);
      setError('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = parseInt(params.id as string);
      await updateSession(id, formData);
      await loadSession();
      setIsEditing(false);
      window.location.href = `/sessions/${id}`;
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session');
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
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

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setIsEditing(false)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
            >
              ← Cancel Edit
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Session</h1>
          </div>

          <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Game Type</label>
                <select
                  name="gameType"
                  value={formData.gameType || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select game type</option>
                  <option value="Cash Game">Cash Game</option>
                  <option value="Tournament">Tournament</option>
                  <option value="Sit & Go">Sit & Go</option>
                  <option value="Home Game">Home Game</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stakes</label>
                <input
                  type="text"
                  name="stakes"
                  value={formData.stakes || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buy In ($)</label>
                <input
                  type="number"
                  name="buyIn"
                  value={formData.buyIn || 0}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cash Out ($)</label>
                <input
                  type="number"
                  name="cashOut"
                  value={formData.cashOut || 0}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Save Changes
              </button>
              <a href={`/sessions/${session.id}`} className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center hover:bg-gray-300">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/sessions" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            ← Back to Sessions
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
              <p className="text-lg">{session.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Game Type</h3>
              <p className="text-lg">{session.gameType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p className="text-lg">{session.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Stakes</h3>
              <p className="text-lg">{session.stakes || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Time</h3>
              <p className="text-lg">
                {session.startTime || 'N/A'} - {session.endTime || 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
              <p className="text-lg">
                {session.startTime && session.endTime ? (
                  (() => {
                    const start = new Date(`2000-01-01T${session.startTime}`);
                    const end = new Date(`2000-01-01T${session.endTime}`);
                    const diff = (end.getTime() - start.getTime()) / 1000 / 60;
                    const hours = Math.floor(diff / 60);
                    const minutes = diff % 60;
                    return `${hours}h ${minutes}m`;
                  })()
                ) : (
                  'N/A'
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Buy In</h3>
              <p className="text-lg text-green-600">${session.buyIn.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Cash Out</h3>
              <p className="text-lg text-green-600">${session.cashOut.toFixed(2)}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Profit</h3>
              <p className={`text-3xl font-bold ${session.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {session.profit >= 0 ? '+' : ''}${session.profit.toFixed(2)}
              </p>
            </div>
            {session.notes && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                <p className="text-base whitespace-pre-wrap">{session.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
