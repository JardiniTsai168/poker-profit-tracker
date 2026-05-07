import Link from 'next/link';
import SessionForm from '@/components/sessions/SessionForm';
import { createSession } from '@/lib/db';

export default function NewSessionPage() {
  const handleSubmit = async (data: Parameters<typeof createSession>[0]) => {
    try {
      const id = await createSession(data);
      // Redirect to sessions list after creation
      window.location.href = `/sessions`;
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/sessions"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            ← Back to Sessions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">New Session</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <SessionForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
