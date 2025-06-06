import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

interface NormalCurveProps {
  mu: number;
  sigma: number;
  title?: string;
  className?: string;
}

export default function NormalCurve({
  mu,
  sigma,
  title = "Normal Curve",
  className = "",
}: NormalCurveProps) {
  const data = useMemo(() => {
    const xs = [];
    const ys = [];
    const minX = mu - 4 * sigma;
    const maxX = mu + 4 * sigma;
    const step = (maxX - minX) / 100;

    for (let x = minX; x <= maxX; x += step) {
      const y =
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
      xs.push(x.toFixed(0)); // or keep raw x for exact display
      ys.push(y);
    }

    return {
      labels: xs,
      datasets: [
        {
          label: "Density",
          data: ys,
          fill: false,
          borderColor: "#3b82f6",
          tension: 0.2,
        },
      ],
    };
  }, [mu, sigma]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Line
          data={data}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { color: "#374151" },
                ticks: { color: "#9ca3af" },
              },
              y: {
                grid: { color: "#374151" },
                ticks: { color: "#9ca3af" },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
