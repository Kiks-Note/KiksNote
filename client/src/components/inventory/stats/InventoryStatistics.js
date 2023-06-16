import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  TimeScale,
  Title,
} from "chart.js";
import "chartjs-adapter-moment";
import "chartjs-plugin-datalabels";
import moment from "moment";
import React, {useEffect, useRef, useState} from "react";

export default function InventoryStatistics() {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    Chart.register(
      CategoryScale,
      LinearScale,
      Title,
      BarController,
      BarElement,
      TimeScale
    );

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_API}/inventory/statistics`
        );
        console.log("Réponse du serveur:", response);
        const data = await response.json();
        const formattedData = data.map((document) => ({
          ...document,
          createdAt: moment(document.createdAt).toDate(),
        }));
        setData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const sortedData = data.sort((a, b) => a.createdAt - b.createdAt);
      const labels = [];
      const values = [];

      // Sélectionner les 5 plus anciens matériels
      const top5 = sortedData.slice(0, 5);

      // Créer les étiquettes et valeurs pour les barres
      top5.forEach((document) => {
        labels.push(
          `${document.label} (${moment(document.createdAt).format("MMM D")})`
        );
        values.push(moment(document.createdAt).toDate());
      });

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Matériels les plus anciens",
            data: [100, 75, 50, 25, 10],
            backgroundColor: [
              "rgba(255, 99, 132)",
              "rgba(255, 159, 64)",
              "rgba(255, 205, 86)",
              "rgba(75, 192, 192)",
              "rgba(54, 162, 235)",
              "rgba(153, 102, 255)",
              "rgba(201, 203, 207)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
            ],
            borderWidth: 1,
          },
        ],
      };

      const options = {
        type: "bar",
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "MMM D",
              },
            },
          },
          y: {},
        },
        plugins: {
          title: {
            display: true,
            text: "Matériels les plus anciens",
            position: "top",
            align: "center",
            font: {
              size: 18,
              weight: "bold",
            },
          },
          legend: {
            display: false,
          },
        },
      };

      if (chartInstance) {
        chartInstance.destroy();
      }

      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        const newChartInstance = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: options,
        });
        setChartInstance(newChartInstance);
      }
    }
  }, [data]);

  return (
    <div
      style={{
        width: "600px",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
