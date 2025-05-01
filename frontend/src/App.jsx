import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import CompareChart from "@/components/CompareChart";
import PlayerCombobox from "@/components/PlayerCombobox";
import { Switch } from "@/components/ui/switch";
import { RotateCw } from "lucide-react";
import PlayerComparison from "@/components/PlayerComparison";
import ScatterPlot from "@/components/ScatterPlot";

function App() {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [statCategory, setStatCategory] = useState("general");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/players")
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  const handleCompare = () => {
    if (!player1 || !player2) return;
    axios
      .get("http://localhost:8000/compare", {
        params: { player1, player2 },
      })
      .then((res) => setComparisonData(res.data))
      .catch((err) => console.error("Error fetching comparison:", err));
  };

  const handleReset = () => {
    setPlayer1("");
    setPlayer2("");
    setComparisonData(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={darkMode ? "dark bg-gray-900 min-h-screen" : "bg-white min-h-screen"}>
        <div className="flex">
          {/* Sidebar */}
          {isSidebarOpen && (
            <div className="w-56 min-h-screen bg-white dark:bg-gray-800 shadow-md fixed z-40">
              <div className="p-4 text-gray-800 dark:text-white font-bold border-b">Menu</div>
              <ul className="p-4 text-sm text-gray-700 dark:text-gray-300">
                <li
                  className="mb-2 cursor-pointer hover:underline"
                  onClick={() => (window.location.href = "/scatter")}
                >
                  📉 Scatter Plot Explorer
                </li>
              </ul>
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-56" : "ml-0"}`}>
            <div className="p-6 text-center">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="bg-black text-white p-2 rounded-md shadow"
                  >
                    ☰
                  </button>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NBA Tracker</h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>
              </div>

              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className="flex justify-center gap-4 mb-6 flex-wrap">
                        <PlayerCombobox
                          items={players}
                          placeholder="Search Player 1"
                          selectedValue={player1}
                          onChange={setPlayer1}
                        />
                        <PlayerCombobox
                          items={players}
                          placeholder="Search Player 2"
                          selectedValue={player2}
                          onChange={setPlayer2}
                        />
                        <Button onClick={handleCompare}>Compare</Button>
                        {(player1 || player2) && (
                          <Button onClick={handleReset}>
                            <RotateCw className="w-4 h-4 mr-2" />
                            Reset
                          </Button>
                        )}
                        <select
                          value={statCategory}
                          onChange={(e) => setStatCategory(e.target.value)}
                          className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                        >
                          <option value="general">General</option>
                          <option value="offensive">Offensive</option>
                          <option value="defensive">Defensive</option>
                        </select>
                      </div>

                      {comparisonData && (
                        <>
                          <h2 className="text-xl font-semibold mb-2 capitalize text-gray-900 dark:text-white">
                            {`Currently Viewing: ${statCategory} Stats`}
                          </h2>
                          <CompareChart data={comparisonData} statCategory={statCategory} />
                        </>
                      )}
                    </>
                  }
                />
                <Route path="/scatter" element={<ScatterPlot />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
