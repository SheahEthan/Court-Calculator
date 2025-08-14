'use client';

import { useState } from 'react';

export default function Knockout() {
  const [step, setStep] = useState(1);
  const [teamCourtForm, setTeamCourtForm] = useState({
    totalTeam: '',
    court: '',
  });

  const [roundInputs, setRoundInputs] = useState([]);
  const [scheduleData, setScheduleData] = useState(null);

  const isPowerOfTwo = (n) => (n & (n - 1)) === 0;

  const handleTeamCourtChange = (e) => {
    setTeamCourtForm({ ...teamCourtForm, [e.target.name]: e.target.value });
  };

  const handleRoundChange = (index, field, value) => {
    const updated = [...roundInputs];
    updated[index][field] = value;
    setRoundInputs(updated);
  };

  const proceedToRounds = (e) => {
    e.preventDefault();
    const team = parseInt(teamCourtForm.totalTeam);
    const courts = parseInt(teamCourtForm.court);

    if (!isPowerOfTwo(team) || team < 2) {
      alert('Teams must be a power of 2 (e.g. 2, 4, 8, 16, ...)');
      return;
    }

    const rounds = [];
    let currentTeams = team;
    while (currentTeams >= 2) {
      const label =
        currentTeams >= 16 ? `Round of ${currentTeams}` :
        currentTeams === 8 ? 'Quarterfinal' :
        currentTeams === 4 ? 'Semifinal' :
        'Final';

      rounds.push({
        teams: currentTeams,
        label,
        startTime: '',
        interval: '',
      });

      currentTeams /= 2;
    }

    setRoundInputs(rounds);
    setStep(2);
  };

  const generateSchedule = (e) => {
    e.preventDefault();
    const courtCount = parseInt(teamCourtForm.court);
    const schedule = [];

    roundInputs.forEach(({ teams, label, startTime, interval }) => {
      const games = teams / 2;
      const matchCode =
        teams >= 16 ? `R${teams}` :
        teams === 8 ? 'QF' :
        teams === 4 ? 'SF' :
        'F';

      let matchTime = new Date(`2025-01-01T${startTime}`);
      for (let i = 0; i < games; i += courtCount) {
        const courts = Array.from(
          { length: Math.min(courtCount, games - i) },
          () => matchCode
        );
        schedule.push({
          time: matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label,
          courts,
        });
        matchTime = new Date(matchTime.getTime() + parseInt(interval) * 60000);
      }
    });

    setScheduleData({ schedule, courtCount });
    setStep(3);
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <img 
        src="Linkedup-logo.png" 
        alt="Logo" 
        className="w-[202px] h-[96px] absolute top-4 left-4"
      />
      <div className="bg-white p-7 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Knockout Round Calculator</h1>

        {step === 1 && (
          <form onSubmit={proceedToRounds} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{ name: 'totalTeam', label: 'Number of Teams' }, { name: 'court', label: 'Number of Courts' }].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  name={field.name}
                  value={teamCourtForm[field.name]}
                  onChange={handleTeamCourtChange}
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  required
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >Next</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={generateSchedule} className="space-y-4">
            {roundInputs.map((round, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">{round.label}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="time"
                      value={round.startTime}
                      onChange={(e) => handleRoundChange(index, 'startTime', e.target.value)}
                      required
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interval (minutes)</label>
                    <input
                      type="number"
                      value={round.interval}
                      onChange={(e) => handleRoundChange(index, 'interval', e.target.value)}
                      required
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >Generate Schedule</button>
          </form>
        )}
      </div>

      {step === 3 && scheduleData && (
        <div className="mt-10 w-full max-w-6xl">
          <h2 className="text-xl font-semibold mb-2">Knockout Schedule</h2>
          <table className="w-full bg-white rounded shadow text-sm border text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Type of Round</th>
                {Array.from({ length: scheduleData.courtCount }, (_, i) => (
                  <th key={i} className="p-2 border">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData.schedule.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border">{row.time}</td>
                  <td className="p-2 border">{row.label}</td>
                  {Array.from({ length: scheduleData.courtCount }).map((_, j) => (
                    <td key={j} className="p-2 border">{row.courts[j] || ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}