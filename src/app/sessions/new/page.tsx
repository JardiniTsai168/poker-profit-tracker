'use client';

import { useRouter } from 'next/navigation';
import SessionForm from '@/components/sessions/SessionForm';
import { createSession } from '@/lib/db';

export default function NewSessionPage() {
  const router = useRouter();

  const handleSubmit = async (data: Parameters<typeof createSession>[0]) => {
    try {
      const id = await createSession(data);
      router.push(`/sessions/${id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            ← Back to Sessions
          </button>
          <h1 className="text-3xl font-bold text-gray-900">New Session</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <SessionForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
