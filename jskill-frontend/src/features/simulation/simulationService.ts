import type { Player } from "./useSimulation";

export async function simulateMatchAPI(
  loopCount: number,
  updateType: string
): Promise<Player[]> {
  const res = await fetch(
    `http://localhost:8080/simulate?loops=${loopCount}&updateType=${updateType}`
  );
  if (!res.ok) throw new Error("Simulation failed");
  return res.json();
}

export async function resetSimulationAPI(): Promise<void> {
  const res = await fetch("http://localhost:8080/reset", { method: "POST" });
  if (!res.ok) throw new Error("Reset failed");
}
