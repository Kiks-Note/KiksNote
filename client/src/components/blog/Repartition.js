import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Title,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

function BlogRepartition() {
  const [creationDistributionData, setCreationDistributionData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://212.73.217.176:5050/blog/stats/distribution"
      );
      const data = response.data;

      setCreationDistributionData({
        labels: ["Blogs", "Tutoriels"],
        datasets: [
          {
            data: [data.blogCount, data.tutorialCount],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(192, 75, 192, 0.6)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(192, 75, 192, 1)"],
          },
        ],
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de répartition des créations :",
        error
      );
    }
  };

  return (
    <div>
      <h2>Répartition entre les tutos et les blogs</h2>
      {creationDistributionData.labels &&
      creationDistributionData.labels.length > 0 ? (
        <Doughnut
          data={creationDistributionData}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Répartition des créations de tutoriels et de blogs",
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
            responsive: true,
          }}
        />
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
}

export default BlogRepartition;
