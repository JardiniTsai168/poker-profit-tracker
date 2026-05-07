export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">TEST PAGE - If you see this, React is working</h1>
        
        <a href="/sessions/new" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-4">
          Go to New Session
        </a>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg mb-2">This is a static test page.</p>
          <p className="text-gray-600">
            If buttons work here but not on /sessions, the issue is in the SessionList component.
          </p>
        </div>
      </div>
    </div>
  );
}
