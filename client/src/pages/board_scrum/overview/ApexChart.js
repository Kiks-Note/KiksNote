import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ selectedBoard }) => {
  const { data } = selectedBoard;


  const totalTasks =
    data.done.items.length +
    data.inProgress.items.length +
    data.toDo.items.length;


  const series = [
    (data.toDo.items.length / totalTasks) * 100,
    (data.inProgress.items.length / totalTasks) * 100,
    (data.done.items.length / totalTasks) * 100,
  ];

  const options = {
    chart: {
      height: 20,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
        },
      },
    },
    labels: ["To Do", "In Progress", "Done"],
  };

  return (
    <div id="chart" className="chart-container">

      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={295}
      />

    </div>
  );
};

export default ApexChart;
