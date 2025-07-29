'use client';

import { useState } from 'react';

export default function Knockout(){
    const [form, setForm] = useState({
        totalTeam : '',
        startTime : '',
        interval : '',
        court : ''
    });

    const [results, setResults] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const generateKnockout = (e) => {
        e.preventDefault();

        const {
            totalTeam,
            startTime,
            interval,
            court,
        } = form;

        let team = parseInt(totalTeam);
        const intervalMin = parseInt(interval);
        const courtCount = parseInt(court);

        const schedule = [];
        let matchTime = new Date(`2025-01-01T${startTime}`);

        while (team > 1) {
            const games = team / 2;
            const matches = [];

            const roundLabel =
            team >= 16 ? `Round of ${team}` :
            team === 8 ? 'Quarterfinal' :
            team === 4 ? 'Semifinal' :
            team === 2 ? 'Final' : '';

            const matchCode =
            team >= 16 ? `R${team}` :
            team === 8 ? 'QF' :
            team === 4 ? 'SF' :
            team === 2 ? 'F' : '';

            for (let i = 0; i < games; i += courtCount) {
            const courts = Array.from(
                { length: Math.min(courtCount, games - i) },
                () => matchCode
            );

            schedule.push({
                time: matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                label: roundLabel,
                courts,
            });

            matchTime = new Date(matchTime.getTime() + intervalMin * 60000);
            }

            team = games;
        }

        setResults({
            schedule,
            courtCount,
        });
        };


    return(
        <main className = "min-h-screen flex flex-col items-center bg-gray-50 p-4">
            <div className = "bg-white p-7 rounded-2xl shadow-md w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4 text-center">Knockout Round Calculator</h1>
                <form onSubmit = {generateKnockout} className = "grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {name : 'totalTeam', label : 'Number of Teams', type : 'number'},
                        {name : 'court', label : 'Number of Courts', type : 'number'},
                        {name : 'startTime', label : 'Start Time', type : 'time'},
                        {name : 'interval', label : 'Interval Time (min)', type : 'number'},
                    ].map((field) => (
                        <div key = {field.name}>
                            <label className = "block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                                name = {field.name}
                                value = {form[field.name]}
                                onChange = {handleChange}
                                type = {field.type}
                                className = "w-full mt-1 p-2 border rounded-md"
                                required
                            />
                        </div>
                    ))}
                    <div className = "md:col-span-2">
                        <button 
                            type = "submit"
                            className = "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >Generate Schedule</button>
                    </div>
                </form>
            </div>

            {results && (
                <div className="mt-10 w-full max-w-6xl">
                    <h2 className="text-xl font-semibold mb-2">Knockout Schedule</h2>
                    <table className="w-full bg-white rounded shadow text-sm border text-center">
                    <thead className="bg-gray-200">
                        <tr>
                        <th className="p-2 border">Time</th>
                        <th className="p-2 border">Type of Round</th>
                        {Array.from({ length: results.courtCount }, (_, i) => (
                            <th key={i} className="p-2 border">{i + 1}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.schedule.map((row, i) => (
                        <tr key={i} className="border-t">
                            <td className="p-2 border">{row.time}</td>
                            <td className="p-2 border">{row.label}</td>
                            {Array.from({ length: results.courtCount }).map((_, j) => (
                            <td key={j} className="p-2 border">
                                {row.courts[j] || ''}
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
        </main>
    )
}