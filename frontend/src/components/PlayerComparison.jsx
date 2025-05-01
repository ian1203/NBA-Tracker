// src/components/PlayerComparison.jsx
import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export default function PlayerComparison() {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/players")
      .then((res) => res.json())
      .then((players) => setPlayers(players))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  const handleCompare = () => {
    if (!player1 || !player2 || player1 === player2) return;

    fetch(`http://localhost:8000/compare?player1=${player1}&player2=${player2}`)
      .then((res) => res.json())
      .then((result) => {
        const stats = [
          "PTS", "AST", "TRB", "STL", "BLK", "TOV", "FG%", "3P%", "FT%", "PER", "USG%", "BPM",
        ];
        const chartData = stats.map((stat) => ({
          stat,
          [result[0]["Player"]]: parseFloat(result[0][stat]) || 0,
          [result[1]["Player"]]: parseFloat(result[1][stat]) || 0,
        }));
        setData(chartData);
      })
      .catch((err) => console.error("Error comparing players:", err));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Compare Two NBA Players</h1>
      <div className="flex gap-4 items-center mb-6">
        <select
          className="border p-2 rounded"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        >
          <option value="">Select Player 1</option>
          {players.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        >
          <option value="">Select Player 2</option>
          {players.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCompare}>
          Compare
        </button>
      </div>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={data} outerRadius={180}>
            <PolarGrid />
            <PolarAngleAxis dataKey="stat" />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
            <Radar name={player1} dataKey={player1} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name={player2} dataKey={player2} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
