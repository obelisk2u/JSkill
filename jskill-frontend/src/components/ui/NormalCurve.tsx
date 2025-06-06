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
    const minX = 500;
    const maxX = 2400;
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
      <CardContent className="h-[300px]">
        <Line
          data={data}
          options={{
            responsive: true,
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
      </CardContent>
    </Card>
  );
}
