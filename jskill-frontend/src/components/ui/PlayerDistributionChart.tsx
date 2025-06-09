import NormalCurve from "@/components/ui/NormalCurve";
import HistogramCard from "@/components/ui/HistogramCard";
import type { Player } from "@/features/simulation/useSimulation";

interface Props {
  players: Player[];
  updateType: string;
  selectedPlayer: Player | null;
}

export default function PlayerDistributionChart({
  players,
  updateType,
  selectedPlayer,
}: Props) {
  if (selectedPlayer && updateType === "TrueSkill") {
    return (
      <NormalCurve
        mu={selectedPlayer.mu}
        sigma={selectedPlayer.sigma}
        trueskill={selectedPlayer.trueSkill}
        title={`Player ${selectedPlayer.id} Skill Distribution`}
        className="w-1/2"
      />
    );
  }

  return <HistogramCard players={players} updateType={updateType} />;
}
