import Link from 'next/link';

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Poker Profit Tracker</h1>
          <Link
            href="/sessions/new"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            + New Session
          </Link>
        </header>

        <main className="bg-white p-8 rounded-xl shadow-md">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🃏</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Sessions Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start tracking your poker profits by creating your first session
            </p>
            <Link
              href="/sessions/new"
              className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 font-semibold transition inline-flex items-center gap-2"
            >
              <span>+</span>
              <span>Create Your First Session</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
