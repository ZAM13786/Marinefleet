// File: src/adapter/ui/components/CompareChart.tsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Route } from "../../../core/domain/Route";
import { TARGET_GHG } from "../../../core/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
); 

interface Props {
  baseline: Route;
  comparisons: Route[];
}

export function CompareChart({ baseline, comparisons }: Props) {
  const allRoutes = [baseline, ...comparisons];
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "ghgIntensity (gCO2e/MJ) Comparison",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  const labels = allRoutes.map(r => r.routeId);

  const data = {
    labels,
    datasets: [
      {
        label: "ghgIntensity",
        data: allRoutes.map(r => r.ghgIntensity),
        backgroundColor: allRoutes.map(r => 
          r.ghgIntensity <= TARGET_GHG ? "rgba(75, 192, 192, 0.5)" : "rgba(255, 99, 132, 0.5)"
        ),
        borderColor: allRoutes.map(r => 
          r.ghgIntensity <= TARGET_GHG ? "rgb(75, 192, 192)" : "rgb(255, 99, 132)"
        ),
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}