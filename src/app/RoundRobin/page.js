'use client';

import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    pools: '',
    teamsPerPool: '',
    totalTeams: '',
    playersPerTeam: '',
    courts: '',
    category: '',
    startTime: '',
    interval: '',
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateRoundRobin = (e) => {
    e.preventDefault();

    const {
      pools,
      teamsPerPool,
      totalTeams,
      playersPerTeam,
      courts,
      category,
      startTime,
      interval,
    } = form;

    const p = parseInt(pools);
    const tpp = parseInt(teamsPerPool);
    const total = parseInt(totalTeams);
    const ppt = parseInt(playersPerTeam);
    const c = parseInt(courts);
    const intervalMin = parseInt(interval);

    const gamesPerPool = tpp * (tpp - 1) / 2;
    const totalGames = gamesPerPool * p;
    const totalPlayers = total * ppt;
    const rounds = Math.ceil(totalGames / c);

    // Generate time slots
    const timeSlots = [];
    let matchTime = new Date(`2025-01-01T${startTime}`);
    for (let r = 0; r < rounds; r++) {
      timeSlots.push({
        time: matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        round: r + 1,
        courts: Array(c).fill(category), 
      });

      matchTime = new Date(matchTime.getTime() + intervalMin * 60000);
    }

    setResults({
      gamesPerPool,
      totalGames,
      totalPlayers,
      rounds,
      timeSlots,
      totalCourts: c,
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <div className="bg-white p-7 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Round Robin Calculator</h1>
        <form onSubmit={generateRoundRobin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'pools', label: 'Number of Pools', type: 'number' },
            { name: 'teamsPerPool', label: 'Teams in Each Pool', type: 'number' },
            { name: 'totalTeams', label: 'Total Number of Teams', type: 'number' },
            { name: 'playersPerTeam', label: 'Players per Team', type: 'number' },
            { name: 'courts', label: 'Number of Courts', type: 'number' },
            { name: 'category', label: 'Category Name', type: 'text' },
            { name: 'startTime', label: 'Start Time', type: 'time' },
            { name: 'interval', label: 'Interval Time (min)', type: 'number' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                type={field.type}
                className="w-full mt-1 p-2 border rounded-md"
                required
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Generate Schedule
            </button>
          </div>
        </form>
      </div>

      {results && (
        <div className="mt-10 w-full max-w-6xl">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <ul className="mb-6 bg-white p-4 rounded shadow space-y-1">
            <li>Games per Pool: <strong>{results.gamesPerPool}</strong></li>
            <li>Total Games: <strong>{results.totalGames}</strong></li>
            <li>Total Players: <strong>{results.totalPlayers}</strong></li>
            <li>Rounds Required: <strong>{results.rounds}</strong></li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">Match Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm border text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Time Slot</th>
                  <th className="p-2 border">Round Robin Flights</th>
                  {Array.from({ length: results.totalCourts }, (_, i) => (
                    <th key={i} className="p-2 border">{results.totalCourts - i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.timeSlots.map((slot, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 border">{slot.time}</td>
                    <td className="p-2 border">{slot.round}</td>
                    {[...slot.courts].reverse().map((court, j) => (
                      <td key={j} className="p-2 border">{court}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}


