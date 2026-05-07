'use client';

import { useRouter } from 'next/navigation';

export default function SessionsPage() {
  const router = useRouter();

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

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Sessions</h2>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No sessions yet</p>
            <button
              onClick={() => router.push('/sessions/new')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
