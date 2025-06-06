import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Player {
  id: number;
  mu: number;
  sigma: number;
  trueSkill: number;
}

interface HistogramCardProps {
  players: Player[];
  title?: string;
  className?: string;
}

export default function HistogramCard({
  players,
  title = "Rating Distribution",
  className = "w-1/2 bg-gray-900",
}: HistogramCardProps) {
  const bucketSize = 100;
  const maxRating = 3500;
  const minRating = 0;
  const buckets = new Map<number, number>();

  // Fill all buckets with 0 to ensure consistent display
  for (let r = minRating; r <= maxRating; r += bucketSize) {
    buckets.set(r, 0);
  }

  // Count players into buckets
  players.forEach((p) => {
    let rounded = Math.round(p.mu / bucketSize) * bucketSize;
    rounded = Math.max(minRating, Math.min(maxRating, rounded));
    buckets.set(rounded, (buckets.get(rounded) || 0) + 1);
  });

  const sortedEntries = Array.from(buckets.entries()).sort(
    (a, b) => a[0] - b[0]
  );

  const data = {
    labels: sortedEntries.map(([rating]) => rating.toString()),
    datasets: [
      {
        label: "Player Count",
        data: sortedEntries.map(([, count]) => count),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[500px]">
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { color: "#374151" },
                title: { display: true, text: "Rating (μ)", color: "#fff" },
                ticks: { color: "#fff" },
              },
              y: {
                beginAtZero: true,
                grid: { color: "#374151" },
                ticks: { color: "#fff" },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
