import Link from 'next/link';
import SessionForm from '@/components/sessions/SessionForm';

export default function NewSessionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-gray-900 inline-block mb-2"
              title="Settings"
            >
              ⚙️ Settings
            </Link>
            <Link
              href="/sessions"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Sessions
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">New Session</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <SessionForm />
        </div>
      </div>
    </div>
  );
}
