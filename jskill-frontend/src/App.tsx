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
import NormalCurve from "@/components/ui/NormalCurve"; // ✅ Make sure this exists

interface Player {
  id: number;
  mu: number;
  sigma: number;
  trueSkill: number;
}

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [loopCount, setLoopCount] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // ✅ New

  const simulateMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/simulate?loops=${loopCount}`
      );
      const data: Player[] = await res.json();
      setPlayers(data);

      if (selectedPlayer) {
        const updated = data.find((p) => p.id === selectedPlayer.id);
        if (updated) setSelectedPlayer(updated); // ✅ Sync latest values
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
    setSelectedPlayer(null); // ✅ Reset view
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">TrueSkill Simulation</h1>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <Button onClick={simulateMatch} disabled={loading}>
          {loading ? "Simulating..." : "Simulate Match"}
        </Button>

        <div className="flex flex-col">
          <Label
            htmlFor="loopCount"
            className="text-sm text-muted-foreground mb-1"
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
            className="w-28 bg-gray-800 text-white"
          />
        </div>

        <Button
          variant="secondary"
          className="text-white"
          onClick={resetSimulation}
        >
          Reset
        </Button>

        {selectedPlayer && (
          <div className="mt-4">
            <Button onClick={() => setSelectedPlayer(null)}>
              Back to All Players
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Table Card */}
        <Card className="w-1/2 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              Top 10 Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800">
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
                      onClick={() => setSelectedPlayer(player)} // ✅ Set selected player
                    >
                      <TableCell>{player.id}</TableCell>
                      <TableCell>{player.mu.toFixed(2)}</TableCell>
                      <TableCell>{player.trueSkill.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Chart Area: Switch between Histogram and Player Distribution */}
        {selectedPlayer ? (
          <NormalCurve
            mu={selectedPlayer.mu}
            sigma={selectedPlayer.sigma}
            title={`Player ${selectedPlayer.id} Skill Distribution`}
            className="w-1/2 bg-gray-900"
          />
        ) : (
          <HistogramCard players={players} />
        )}
      </div>
    </div>
  );
}
