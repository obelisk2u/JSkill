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
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  annotationPlugin
);

interface NormalCurveProps {
  trueskill: number;
  mu: number;
  sigma: number;
  title?: string;
  className?: string;
}

export default function NormalCurve({
  trueskill,
  mu,
  sigma,
  title = "Normal Curve",
  className = "",
}: NormalCurveProps) {
  const averageDistance = Math.abs(mu - trueskill);
  const data = useMemo(() => {
    const xs = [];
    const ys = [];
    const minX = 500;
    const maxX = 3500;
    const step = (maxX - minX) / 100;

    for (let x = minX; x <= maxX; x += step) {
      const y =
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
      xs.push(x.toFixed(0));
      ys.push(y);
    }

    return {
      labels: xs,
      datasets: [
        {
          label: "Density",
          data: ys,
          fill: false,
          borderColor: "#f0f0f0", // consistent blue
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };
  }, [mu, sigma]);

  return (
    <Card className={className} style={{ backgroundColor: "#121212" }}>
      <CardHeader>
        <CardTitle style={{ color: "#ffffff" }}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-16 flex flex-col items-center justify-center">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              annotation: {
                annotations: {},
              },
            },
            scales: {
              x: {
                grid: { color: "#121212" },
                ticks: { color: "#9ca3af" },
              },
              y: {
                grid: { color: "#121212" },
                ticks: { color: "#121212" },
              },
            },
          }}
        />

        <div className="text-center text-md text-gray-300 mt-2">
          Current Rating: {mu.toFixed(0)}
        </div>
        <div className="text-center text-md text-gray-300 mt-1">
          True Rating: {trueskill.toFixed(0)}
        </div>
        <div className="text-center text-md text-gray-300 mt-1">
          Distance from True Rating: {averageDistance.toFixed(0)}
        </div>
      </CardContent>
    </Card>
  );
}
