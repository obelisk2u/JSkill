import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Player } from "@/features/simulation/useSimulation";

interface Props {
  players: Player[];
  updateType: string;
  setSelectedPlayer: (p: Player) => void;
}

export default function LeaderboardTable({
  players,
  updateType,
  setSelectedPlayer,
}: Props) {
  return (
    <Card className="w-1/2 bg-[#121212]">
      <CardHeader>
        <CardTitle className="text-white text-lg">Top 10 Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#121212]">
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
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className="cursor-pointer text-white"
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
  );
}
