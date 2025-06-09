import { useSimulation } from "@/features/simulation/useSimulation";
import SimulationControls from "@/components/ui/SimulationControls";
import LeaderboardTable from "@/components/ui/LeaderBoardTable";
import PlayerDistributionChart from "@/components/ui/PlayerDistributionChart";

export default function Simulation() {
  const {
    players,
    loading,
    loopCount,
    updateType,
    selectedPlayer,
    setLoopCount,
    setUpdateType,
    simulateMatch,
    resetSimulation,
    setSelectedPlayer,
  } = useSimulation();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white px-6 py-4">
      <h1 className="text-3xl font-bold mb-4">TrueSkill Simulation</h1>
      <SimulationControls
        loopCount={loopCount}
        loading={loading}
        updateType={updateType}
        setLoopCount={setLoopCount}
        setUpdateType={setUpdateType}
        simulateMatch={simulateMatch}
        resetSimulation={resetSimulation}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
      />
      <div className="flex gap-6">
        <LeaderboardTable
          players={players}
          updateType={updateType}
          setSelectedPlayer={setSelectedPlayer}
        />
        <PlayerDistributionChart
          players={players}
          updateType={updateType}
          selectedPlayer={selectedPlayer}
        />
      </div>
    </div>
  );
}
