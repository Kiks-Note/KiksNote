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
        label: "BurnDown IdealProgress",
        data: idealProgressLine,
        backgroundColor: "yellow",
        borderColor: "blue",
        tension: 0.1,
        // https://www.chartjs.org/docs/latest/charts/line.html attributes for datasets
      },
      {
        // Team Progress Red
        label: "BurnDown TeamProgress",
        data: burn.TeamProgress,
        backgroundColor: "orange",
        borderColor: "red",
        tension: 0.4,
      },
    ],
    options: {
      responsive: true,
      beginAtZero: true,
    },
  });

  return (
    <div className="App">
      <h1>BurnDown / BurnUp</h1>
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
