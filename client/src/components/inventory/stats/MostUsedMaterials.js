import {
  ArcElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";
import "chartjs-plugin-datalabels";
import moment from "moment";
import React, {useEffect, useRef, useState} from "react";
import {Typography} from "@material-ui/core";

export default function MostUsedMaterials() {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Chart.register(
      ArcElement,
      Title,
      LineElement,
      CategoryScale,
      LinearScale,
      PointElement,
      Filler,
      Tooltip,
      Legend
    );

    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5050/inventory/statistics2"
        );
        console.log("Réponse du serveur:", response);
        const data = await response.json();
        console.log("data:", data);
        const formattedData = data.map((document) => ({
          ...document,
          count: moment(document.deviceId),
        }));
        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const labels = [];
      const values = [];
      // Filtrer les données pour n'inclure que les matériels "accepted"
      const acceptedMaterials = data.filter(
        (document) => document.status === "accepted"
      );

      // Traiter les données pour obtenir le top 5 des matériels les plus utilisés
      const topMaterials = acceptedMaterials.reduce((acc, curr) => {
        const materialId = curr.deviceId;
        acc[materialId] = (acc[materialId] || 0) + 1;
        return acc;
      }, {});

      // Convertir le topMaterials en tableau pour le tri
      const topMaterialsArray = Object.entries(topMaterials).map(
        ([deviceId, count]) => ({deviceId, count})
      );

      // Trier le tableau en fonction du nombre d'utilisations (count) de manière décroissante
      topMaterialsArray.sort((a, b) => b.count - a.count);

      // Obtenir uniquement les 5 premiers matériels
      const top5Materials = topMaterialsArray.slice(0, 5);

      // Extraire les labels et les valeurs pour le graphique
      top5Materials.forEach((document) => {
        labels.push(document.deviceId);
        values.push(document.count);
      });
      // console.log("labels:", labels);

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Les matériels les plus utilisés",
            data: values,
            backgroundColor: [
              "rgba(255, 99, 132)",
              "rgba(255, 159, 64)",
              "rgba(255, 205, 86)",
              "rgba(75, 192, 192)",
              "rgba(54, 162, 235)",
            ],
            hoverOffset: 4,
          },
        ],
      };

      console.log("chartData:", chartData);
      setChartData(chartData);

      const options = {
        type: "doughnut",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Matériels les plus utilisés",
            position: "top",
            align: "center",
            font: {
              size: 18,
              weight: "bold",
            },
          },
          legend: {
            display: true,
            position: "right",
            labels: {
              display: true,
              color: "white",
            },
          },
        },
      };

      if (chartInstance) {
        chartInstance.destroy();
      }

      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        const newChartInstance = new Chart(ctx, {
          type: "doughnut",
          data: chartData,
          options: options,
        });

        setChartInstance(newChartInstance);
      }
    }
  }, [data]);

  return (
    <div style={{width: "600px", height: "330px"}}>
      {!loading && chartData.labels < 0 ? (
        <canvas ref={chartRef}></canvas>
      ) : (
        <div>
          <Typography
            variant="h6"
            align="center"
            style={{
              fontFamily: "poppins-semiBold",
              color: "grey",
              fontSize: "18px",
            }}
          >
            Matériels les plus utilisés
          </Typography>
          <Typography
            variant="body1"
            align="center"
            style={{marginTop: "40px", fontFamily: "poppins-regular"}}
          >
            Aucune donnée disponible
          </Typography>
        </div>
      )}
    </div>
  );
}
