import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import React, { useState } from "react";
import burn from "./BurnDown.json";

ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);
function createBurnDownData() {
  // Average for IdealProgressLine
  const average = Math.max(...burn.TeamProgress) / (burn.sprintTime.length - 1);
  //Max of story point
  var max = Math.max(...burn.TeamProgress);
  //   console.log(max);
  var idealProgressTable = [];
  idealProgressTable.push(max);

  while (max >= 0) {
    max = max - average;
    idealProgressTable.push(max);
  }

  idealProgressTable = idealProgressTable.filter((word) => word >= 0);

  const min = Math.min(...idealProgressTable);
  if (min !== 0) {
    idealProgressTable.push(0);
  }

  return idealProgressTable;
}

export default function BurnDown() {
  const idealProgressLine = createBurnDownData();

  const [data] = useState({
    labels: burn.sprintTime, // BurnDown.sprintTime Json data
    datasets: [
      {
        // Ideal progression Blue
        label: "Avancée idéal",
        data: idealProgressLine,
        backgroundColor: "blue",
        borderColor: "blue",
        tension: 0.1,
        // https://www.chartjs.org/docs/latest/charts/line.html attributes for datasets
      },
      {
        // Team Progress Red
        label: "Avancée de l'équipe",
        data: burn.TeamProgress,
        backgroundColor: "orange",
        borderColor: "orange",
        tension: 0.4,
      },
    ],
    options: {
      responsive: true,
      beginAtZero: true,
      plugins: {
        legend: {
          labels: {
            // This more specific font property overrides the global property
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: "Burn Down",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Temps dans le sprint",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Quantité Totale de travail",
          },
        },
      },
    },
  });

  return (
    <div className="App">
      <Line
        data={data}
        options={data.options}
        style={{ width: "1000px", height: "1000px" }}
      >
        Hello
      </Line>
    </div>
  );
}
