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

import HistogramCard from "@/components/ui/HistogramCard";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
interface Player {
  id: number;
  mu: number;
  sigma: number;
  trueSkill: number;
}

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"id" | "mu" | "trueSkill">("id");
  const [loopCount, setLoopCount] = useState(1);

  const simulateMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/simulate?loops=${loopCount}`
      );
      const data: Player[] = await res.json();
      setPlayers(sortPlayers(data, sortBy));
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = async () => {
    await fetch("http://localhost:8080/reset", { method: "POST" });
    setPlayers([]);
  };

  const sortPlayers = (data: Player[], field: "id" | "mu" | "trueSkill") => {
    return [...data].sort((a, b) => a[field] - b[field]);
  };

  const handleSort = (field: "id" | "mu" | "trueSkill") => {
    setSortBy(field);
    setPlayers(sortPlayers(players, field));
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
      </div>

      <div className="flex gap-6">
        {/* Table Card */}
        <Card className="w-1/2 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white text-lg">Player Ratings</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800">
                  <TableHead
                    onClick={() => handleSort("id")}
                    className="cursor-pointer text-white"
                  >
                    ID
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("mu")}
                    className="cursor-pointer text-white"
                  >
                    Rating (μ)
                  </TableHead>
                  <TableHead className="cursor-pointer text-white">
                    Sigma (σ)
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("trueSkill")}
                    className="cursor-pointer text-white"
                  >
                    True Skill
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow
                    className="cursor-pointer text-white"
                    key={player.id}
                  >
                    <TableCell>{player.id}</TableCell>
                    <TableCell>{player.mu.toFixed(2)}</TableCell>
                    <TableCell>{player.sigma.toFixed(2)}</TableCell>
                    <TableCell>{player.trueSkill.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Chart Card */}
        <HistogramCard players={players} />
      </div>
    </div>
  );
}
