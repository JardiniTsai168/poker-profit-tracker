'use client';

import { useState } from 'react';
import { PokerSession } from '@/lib/types';
import SessionForm from './SessionForm';

interface SessionDetailProps {
  session: PokerSession;
  onUpdate: (data: Partial<PokerSession>) => Promise<void>;
  onDelete: () => Promise<void>;
  onBack: () => void;
}

export default function SessionDetail({ session, onUpdate, onDelete, onBack }: SessionDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (data: Omit<PokerSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    await onUpdate(data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this session? This cannot be undone.')) {
      setIsDeleting(true);
      await onDelete();
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Session</h2>
        <SessionForm
          initialData={session}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Sessions
        </button>
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
            <p className={`text-3xl font-bold ${
              session.profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
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

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-400">
            <p>Created: {session.createdAt ? new Date(session.createdAt).toLocaleString() : 'N/A'}</p>
            <p>Last Updated: {session.updatedAt ? new Date(session.updatedAt).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
