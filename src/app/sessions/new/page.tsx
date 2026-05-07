import SessionForm from '@/components/sessions/SessionForm';

export default function NewSessionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/sessions" className="text-blue-600 hover:text-blue-800 inline-block mb-2">
            ← Back
          </a>
          <h1 className="text-3xl font-bold text-gray-900">New Session</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <SessionForm />
        </div>
      </div>
    </div>
  );
}
