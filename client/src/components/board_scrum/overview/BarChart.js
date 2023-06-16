import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const BarChart = ({ participation, label }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  const randomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const chartLabels = [];
    const chartData = [];

    participation.forEach((item) => {
      chartLabels.push(item.name.split(".")[0]);
      chartData.push(item.participation);
    });

    setLabels(chartLabels);
    setData(chartData);
  }, [participation]);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const backgroundColors = labels.map(() => randomColor());

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, data]);


  return <canvas ref={chartRef} id="myChart" height="235" />;

};

export default BarChart;
