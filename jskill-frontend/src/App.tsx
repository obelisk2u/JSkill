import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import HistogramCard from "@/components/ui/HistogramCard";
import NormalCurve from "@/components/ui/NormalCurve";
import { RatingSystemDropdown } from "./components/ui/RatingSelectionDropdown";

interface Player {
  id: number;
  mu: number;
  sigma: number;
  trueSkill: number;
  elo: number;
}

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [loopCount, setLoopCount] = useState(1);
  const [updateType, setUpdateType] = useState("TrueSkill");

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const simulateMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/simulate?loops=${loopCount}&updateType=${updateType}`
      );

      const data: Player[] = await res.json();
      setPlayers(data);

      if (selectedPlayer) {
        const updated = data.find((p) => p.id === selectedPlayer.id);
        if (updated) setSelectedPlayer(updated);
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = async () => {
    await fetch("http://localhost:8080/reset", { method: "POST" });
    setPlayers([]);
    setSelectedPlayer(null);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}
    >
      <h1 className="text-3xl font-bold mb-4">TrueSkill Simulation</h1>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <Button onClick={simulateMatch} disabled={loading}>
          {loading ? "Simulating..." : "Simulate Match"}
        </Button>

        <div className="flex flex-col">
          <Label
            htmlFor="loopCount"
            className="text-sm mb-1"
            style={{ color: "#b0b0b0" }}
          >
            Simulation Loops
          </Label>
          <Input
            id="loopCount"
            type="number"
            min={1}
            max={100}
            value={loopCount}
            onChange={(e) => setLoopCount(Number(e.target.value))}
            className="w-28"
            style={{ backgroundColor: "#121212", color: "#ffffff" }}
          />
        </div>

        <Button onClick={resetSimulation}>Reset</Button>
        <RatingSystemDropdown value={updateType} onChange={setUpdateType} />

        {selectedPlayer && updateType == "TrueSkill" && (
          <div className="mt-4">
            <Button onClick={() => setSelectedPlayer(null)}>
              Back to All Players
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Table Card */}
        <Card className="w-1/2" style={{ backgroundColor: "#121212" }}>
          <CardHeader>
            <CardTitle className="text-white text-lg">
              Top 10 Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "#121212" }}>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Current Rating</TableHead>
                  <TableHead className="text-white">True Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...players]
                  .sort((a, b) => b.mu - a.mu)
                  .slice(0, 10)
                  .map((player) => (
                    <TableRow
                      className="cursor-pointer text-white"
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <TableCell>{player.id}</TableCell>
                      <TableCell>
                        {updateType === "ELO"
                          ? player.elo.toFixed(2)
                          : player.mu.toFixed(2)}
                      </TableCell>

                      <TableCell>{player.trueSkill.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Chart Area */}
        {selectedPlayer && updateType == "TrueSkill" ? (
          <NormalCurve
            trueskill={selectedPlayer.trueSkill}
            mu={selectedPlayer.mu}
            sigma={selectedPlayer.sigma}
            title={`Player ${selectedPlayer.id} Skill Distribution`}
            className="w-1/2"
          />
        ) : (
          <HistogramCard players={players} updateType={updateType} />
        )}
      </div>
    </div>
  );
}
