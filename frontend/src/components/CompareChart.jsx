import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

const positionMap = {
  PG: "Point Guard",
  SG: "Shooting Guard",
  SF: "Small Forward",
  PF: "Power Forward",
  C: "Center",
};

const teamMap = {
  ATL: "Atlanta Hawks",
  BOS: "Boston Celtics",
  BKN: "Brooklyn Nets",
  CHA: "Charlotte Hornets",
  CHI: "Chicago Bulls",
  CLE: "Cleveland Cavaliers",
  DAL: "Dallas Mavericks",
  DEN: "Denver Nuggets",
  DET: "Detroit Pistons",
  GSW: "Golden State Warriors",
  HOU: "Houston Rockets",
  IND: "Indiana Pacers",
  LAC: "Los Angeles Clippers",
  LAL: "Los Angeles Lakers",
  MEM: "Memphis Grizzlies",
  MIA: "Miami Heat",
  MIL: "Milwaukee Bucks",
  MIN: "Minnesota Timberwolves",
  NOP: "New Orleans Pelicans",
  NYK: "New York Knicks",
  OKC: "Oklahoma City Thunder",
  ORL: "Orlando Magic",
  PHI: "Philadelphia 76ers",
  PHX: "Phoenix Suns",
  POR: "Portland Trail Blazers",
  SAC: "Sacramento Kings",
  SAS: "San Antonio Spurs",
  TOR: "Toronto Raptors",
  UTA: "Utah Jazz",
  WAS: "Washington Wizards",
};

const statLabels = {
  pts: "Points",
  ast: "Assists",
  trb: "Rebounds",
  stl: "Steals",
  blk: "Blocks",
  tov: "Turnovers",
  fg_pct: "FG%",
  threep_pct: "3P%",
  ft_pct: "FT%",
  per: "PER",
  usg_pct: "USG%",
  bpm: "BPM",
  assist_turnover_ratio: "AST/TOV",
  ts_pct: "TS%",
  threepar: "3PAr",
  ftr: "FTr",
  ows: "Off Win Shares",
  obpm: "OBPM",
  orb: "Off Rebounds",
  drb: "Def Rebounds",
  orb_pct: "ORB%",
  drb_pct: "DRB%",
  trb_pct: "TRB%",
  stl_pct: "Steal%",
  blk_pct: "Block%",
  dws: "Def Win Shares",
  dbpm: "DBPM",
};

const maxValues = {
  pts: 35,
  ast: 10,
  trb: 12,
  stl: 3,
  blk: 3,
  tov: 5,
  fg_pct: 0.6,
  threep_pct: 0.5,
  ft_pct: 0.9,
  per: 30,
  usg_pct: 35,
  bpm: 10,
  assist_turnover_ratio: 4,
  ts_pct: 0.7,
  threepar: 0.5,
  ftr: 0.6,
  ows: 10,
  obpm: 8,
  orb: 5,
  drb: 10,
  orb_pct: 15,
  drb_pct: 35,
  trb_pct: 25,
  stl_pct: 5,
  blk_pct: 5,
  dws: 8,
  dbpm: 6,
};

function formatValue(value, key) {
  if (value === null || value === undefined) return "-";
  const alreadyPercentStats = [
    "orb_pct", "drb_pct", "trb_pct", "stl_pct", "blk_pct", "usg_pct"
  ];
  if (alreadyPercentStats.includes(key)) {
    return `${Number(value).toFixed(1)}%`;
  }
  if (key.includes("pct") || ["fg_pct", "threep_pct", "ft_pct", "ts_pct"].includes(key)) {
    return `${(Number(value) * 100).toFixed(1)}%`;
  }
  return Number(value).toFixed(1);
}

export default function CompareChart({ data, statCategory = "general" }) {
  if (!data || data.length !== 2) return null;
  const [player1, player2] = data;

  const statsGeneral = [
    "pts", "ast", "trb", "stl", "blk", "tov",
    "fg_pct", "threep_pct", "ft_pct", "per", "usg_pct", "bpm",
  ];

  const statsOffensive = [
    "pts", "assist_turnover_ratio", "fg_pct", "threep_pct", "ft_pct",
    "ts_pct", "threepar", "ftr", "ows", "obpm"
  ];

  const statsDefensive = [
    "orb", "drb", "trb", "stl", "blk",
    "orb_pct", "drb_pct", "trb_pct", "stl_pct", "blk_pct",
    "dws", "dbpm"
  ];

  let statsToCompare = statsGeneral;
  if (statCategory === "offensive") statsToCompare = statsOffensive;
  if (statCategory === "defensive") statsToCompare = statsDefensive;

  const chartData = statsToCompare.map((key) => {
    let value1 = key === "assist_turnover_ratio"
      ? (player1.ast / (player1.tov || 1))
      : player1[key];
    let value2 = key === "assist_turnover_ratio"
      ? (player2.ast / (player2.tov || 1))
      : player2[key];
    const max = maxValues[key] || 1;
    return {
      stat: statLabels[key] || key,
      [player1.player]: value1 ? Number(value1) / max : 0,
      [player2.player]: value2 ? Number(value2) / max : 0,
    };
  });

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-center md:items-center gap-12 p-6">
      <div className="w-full md:w-1/2 flex justify-center">
        <ResponsiveContainer width={450} height={450}>
          <RadarChart data={chartData} outerRadius={160}>
            <PolarGrid />
            <PolarAngleAxis dataKey="stat" />
            <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
            <Radar
              name={player1.player}
              dataKey={player1.player}
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.4}
              dot={{ r: 4 }}
            />
            <Radar
              name={player2.player}
              dataKey={player2.player}
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.4}
              dot={{ r: 4 }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full max-w-md">
          <table className="table-auto w-full text-sm text-left border-t border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2">Stat</th>
                <th className="px-4 py-2">{player1.player}</th>
                <th className="px-4 py-2">{player2.player}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              <tr className="border-b dark:border-gray-700">
                <td className="px-4 py-2 font-semibold">Team</td>
                <td className="px-4 py-2">{teamMap[player1.team] || player1.team}</td>
                <td className="px-4 py-2">{teamMap[player2.team] || player2.team}</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="px-4 py-2 font-semibold">Position</td>
                <td className="px-4 py-2">{positionMap[player1.position] || player1.position}</td>
                <td className="px-4 py-2">{positionMap[player2.position] || player2.position}</td>
              </tr>
              {statsToCompare.map((stat) => {
                const val1 = stat === "assist_turnover_ratio"
                  ? (player1.ast / (player1.tov || 1)).toFixed(2)
                  : player1[stat];
                const val2 = stat === "assist_turnover_ratio"
                  ? (player2.ast / (player2.tov || 1)).toFixed(2)
                  : player2[stat];
                return (
                  <tr key={stat} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 font-semibold">{statLabels[stat]}</td>
                    <td className="px-4 py-2">{formatValue(val1, stat)}</td>
                    <td className="px-4 py-2">{formatValue(val2, stat)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
