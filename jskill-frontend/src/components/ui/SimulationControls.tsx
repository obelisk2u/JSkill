import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RatingSystemDropdown } from "@/components/ui/RatingSelectionDropdown";
import type { Player } from "@/features/simulation/useSimulation";

interface Props {
  loopCount: number;
  loading: boolean;
  updateType: string;
  selectedPlayer: Player | null;
  setLoopCount: (n: number) => void;
  setUpdateType: (s: string) => void;
  simulateMatch: () => void;
  resetSimulation: () => void;
  setSelectedPlayer: (p: Player | null) => void;
}

export default function SimulationControls({
  loopCount,
  loading,
  updateType,
  selectedPlayer,
  setLoopCount,
  setUpdateType,
  simulateMatch,
  resetSimulation,
  setSelectedPlayer,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      <Button onClick={simulateMatch} disabled={loading}>
        {loading ? "Simulating..." : "Simulate Match"}
      </Button>

      <div className="flex flex-col">
        <Label
          htmlFor="loopCount"
          className="text-sm mb-1 text-muted-foreground"
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
          className="w-28 bg-[#121212] text-white"
        />
      </div>

      <Button onClick={resetSimulation}>Reset</Button>

      <RatingSystemDropdown value={updateType} onChange={setUpdateType} />

      {selectedPlayer && updateType === "TrueSkill" && (
        <Button onClick={() => setSelectedPlayer(null)}>
          Back to All Players
        </Button>
      )}
    </div>
  );
}
