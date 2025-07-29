// app/page.js

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to Court Calculator</h1>
      <p className="mb-6 text-gray-700">Select a mode</p>

      <div className="flex space-x-4">
        <a href="/RoundRobin">
          <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Round Robin
          </button>
        </a>

        <a href="/Knockout">
          <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Knockout
          </button>
        </a>
      </div>
    </main>
  );
}
