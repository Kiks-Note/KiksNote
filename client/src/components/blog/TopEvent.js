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
import { Line } from "react-chartjs-2";
import axios from "axios";

function MostParticipantsChart() {
  const [mostParticipantsData, setMostParticipantsData] = useState({});
  const [participantDetails, setParticipantDetails] = useState([]);

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
  );
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5050/blog/stats/participant"
      ); // Remplacez l'URL par la route appropriée pour récupérer les blogs
      const blogs = response.data;

      const sortedBlogs = blogs.sort((a, b) => b.participant - a.participant);
      const topBlogs = sortedBlogs.slice(0, 10);

      const labels = topBlogs.map((blog) => blog.count);
      const data = topBlogs.map((blog) => blog.participant);

      setMostParticipantsData({
        labels,
        datasets: [
          {
            label: "Nombre de participants",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });

      const blogIds = topBlogs.map((blog) => blog.id); // Utilisez l'identifiant approprié pour les blogs
      fetchParticipantDetails(blogIds); // Appel de la fonction fetchParticipantDetails avec blogIds
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des événements avec le plus de participants :",
        error
      );
    }
  };

  const fetchParticipantDetails = async (blogIds) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/blog/participant", // Remplacez l'URL par la route appropriée pour récupérer les participants
        {
          blogIds: blogIds,
        }
      );
      setParticipantDetails(response.data);

      // Effectuez d'autres opérations avec les détails des participants
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Top 10 des événements avec le plus de participants</h2>
      {mostParticipantsData.labels && mostParticipantsData.labels.length > 0 ? (
        <Line data={mostParticipantsData} />
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
}

export default MostParticipantsChart;
