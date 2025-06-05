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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  const simulateMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/simulate");
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

  const ratingHistogram = () => {
    const buckets = new Map<number, number>();
    for (const player of players) {
      const rounded = Math.round(player.mu / 100) * 100;
      buckets.set(rounded, (buckets.get(rounded) || 0) + 1);
    }

    return Array.from(buckets.entries()).map(([bucket, count]) => ({
      rating: bucket,
      count,
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">TrueSkill Simulation</h1>
      <div className="flex gap-4 mb-6">
        <Button onClick={simulateMatch} disabled={loading}>
          {loading ? "Simulating..." : "Simulate Match"}
        </Button>
        <Button variant="secondary" onClick={resetSimulation}>
          Reset
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Left side: Table */}
        <div className="w-1/2 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("id")}>ID</TableHead>
                <TableHead onClick={() => handleSort("mu")}>
                  Rating (μ)
                </TableHead>
                <TableHead>Sigma (σ)</TableHead>
                <TableHead onClick={() => handleSort("trueSkill")}>
                  True Skill
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.mu.toFixed(2)}</TableCell>
                  <TableCell>{player.sigma.toFixed(2)}</TableCell>
                  <TableCell>{player.trueSkill.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right side: Graph */}
        <div className="w-1/2 h-[500px] bg-gray-900 p-4 rounded-md">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingHistogram()}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
