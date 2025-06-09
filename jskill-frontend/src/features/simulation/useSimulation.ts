import { useState } from "react";
import { simulateMatchAPI, resetSimulationAPI } from "./simulationService";

export interface Player {
  id: number;
  mu: number;
  sigma: number;
  trueSkill: number;
  elo: number;
}

export function useSimulation() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [loopCount, setLoopCount] = useState(1);
  const [updateType, setUpdateType] = useState("TrueSkill");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const simulateMatch = async () => {
    setLoading(true);
    try {
      const data = await simulateMatchAPI(loopCount, updateType);
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
    await resetSimulationAPI();
    setPlayers([]);
    setSelectedPlayer(null);
  };

  return {
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
  };
}
