import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label
} from "recharts";

const plotOptions = [
  {
    key: "ast_vs_potential",
    label: "Assists vs. Usage %",
    x: "usg_pct",
    y: "ast"
  },
  {
    key: "usage_vs_tov",
    label: "Usage % vs. Turnover %",
    x: "usg_pct",
    y: "tov"
  },
  {
    key: "threepar_vs_ts",
    label: "3P Attempt Rate vs. True Shooting %",
    x: "threepar",
    y: "ts_pct"
  },
  {
    key: "orb_vs_drb",
    label: "Offensive vs. Defensive Rebounds",
    x: "orb",
    y: "drb"
  }
];

export default function ScatterPlot() {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(plotOptions[0]);
  const [playerCount, setPlayerCount] = useState(10);

  useEffect(() => {
    axios.get("http://localhost:8000/all_stats")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching all_stats:", err));
  }, []);

  const getPlottedData = () => {
    return [...data]
      .filter(
        (d) =>
          d[selectedOption.x] !== null &&
          d[selectedOption.y] !== null &&
          !isNaN(d[selectedOption.x]) &&
          !isNaN(d[selectedOption.y])
      )
      .slice(0, playerCount)
      .map((d) => ({
        ...d,
        name: d.player
      }));
  };

  return (
    <div className="p-8 text-center min-h-screen dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">NBA Scatter Plot Explorer</h1>

      <div className="flex justify-center gap-4 flex-wrap mb-6">
        <select
          value={selectedOption.key}
          onChange={(e) => {
            const option = plotOptions.find((opt) => opt.key === e.target.value);
            setSelectedOption(option);
          }}
          className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
        >
          {plotOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        <select
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
          className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
        >
          {[5, 10, 20].map((n) => (
            <option key={n} value={n}>{n} Players</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey={selectedOption.x}
            name={selectedOption.x}
            tick={{ fill: "#888" }}
          >
            <Label value={selectedOption.x.toUpperCase()} offset={-10} position="insideBottom" fill="#666" />
          </XAxis>
          <YAxis
            type="number"
            dataKey={selectedOption.y}
            name={selectedOption.y}
            tick={{ fill: "#888" }}
          >
            <Label value={selectedOption.y.toUpperCase()} angle={-90} position="insideLeft" fill="#666" />
          </YAxis>
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [`${value.toFixed(2)}`, name]}
            labelFormatter={(label, payload) => payload[0] ? payload[0].payload.name : ""}
          />
          <Legend />
          <Scatter
            name="Players"
            data={getPlottedData()}
            fill="#2563eb"
            shape="circle"
            label={{ dataKey: "name", position: "top", fill: "#aaa", fontSize: 12 }}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Hover to see player names and values.</p>
    </div>
  );
}
