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
import burn from "./BurnUp.json";

ChartJS.register(Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler);
function createDataPlannedCompletion() {
  // Average for IdealProgressLine
  const average = Math.max(...burn.teamProgress) / (burn.sprintNumber.length - 1);
  //Max of story point
  const max = Math.max(...burn.teamProgress);
  //Min of story point
  var min = Math.min(...burn.teamProgress);
  var idealProgressTable = [];
  idealProgressTable.push(min);

  while (min <= max) {
    min = min + average;
    idealProgressTable.push(min);
  }
  return idealProgressTable;
}
function TotalPoint() {
  //Max of story point
  const max = Math.max(...burn.teamProgress);

  var storyPoint = [];
  for (let i = 0; i < burn.sprintNumber.length; i++) {
    storyPoint.push(max);
  }
  return storyPoint;
}

export default function BurnUp() {
  const plannedCompletionLine = createDataPlannedCompletion();
  const allPoint = TotalPoint();
  const teamProgress = burn.teamProgress.sort((a, b) => a - b);

  const [data] = useState({
    labels: burn.sprintNumber, // BurnDown.sprintNumber Json data
    datasets: [
      {
        // planned CompletionLine Black
        label: "Achèvement Prévu",
        data: plannedCompletionLine,
        backgroundColor: "black",
        borderColor: "black",
        tension: 1,
        borderDash: [5],
        pointRadius: 0,
      },
      {
        // Team Progress Red
        label: " Nombre Réel de points terminés",
        data: teamProgress,
        backgroundColor: "green",
        borderColor: "green",
        tension: 0.4,
        pointBorderWidth: 10,
        pointStyle: "rect",
      },
      {
        // Team Progress Red
        label: "Nombre Total prévu de points",
        data: allPoint,
        backgroundColor: "blue",
        borderColor: "blue",
        tension: 0.4,
        borderWidth: 3,
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
          text: "Burn Up",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Nombre de Sprint",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Story Point Livré",
          },
        },
      },
    },
  });

  return (
    <div className="App">
      <Line data={data} options={data.options} style={{ width: "1000px", height: "1000px" }}>
        Hello
      </Line>
    </div>
  );
}
