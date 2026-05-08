export default function TestClick() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Click Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <button
            onClick={() => alert('✅ Button 1 works!')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Test Button 1 (onClick)
          </button>

          <button
            onClick={() => console.log('Log from button 2')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Test Button 2 (console.log)
          </button>
          
          <a 
            href="javascript:alert('✅ JavaScript works!')"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Test Link (javascript:)
          </a>
        </div>
      </div>
    </div>
  );
}
