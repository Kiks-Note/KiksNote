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
import { Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

function TopCreatorsChart() {
  const [topCreatorsData, setTopCreatorsData] = useState({});
  const [participantDetail, setParticipantDetail] = useState([]);

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
        "http://localhost:5050/blog/stats/created_by"
      );
      const blogs = response.data;
      console.log(blogs);
      const creatorsMap = new Map();
      blogs.forEach((blog) => {
        const creator = blog.name;
        const articleCount = blog.articleCount;
        if (creator) {
          creatorsMap.set(
            creator,
            (creatorsMap.get(creator) || 0) + articleCount
          );
        }
      });

      const topCreators = Array.from(creatorsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      const labels = topCreators.map((creator) => creator[0]);
      const data = topCreators.map((creator) => creator[1]);

      setTopCreatorsData({
        labels,
        datasets: [
          {
            label: "Nombre d'articles créés",
            data,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",

            ],
          },
        ],
      });

      const userIds = topCreators.map((creator) => creator[0]); // Use blog.name as userIds
      console.log(userIds);
      fetchUserDetails(userIds); // Call fetchUserDetails with userIds
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des créateurs :",
        error
      );
    }
  };

  const fetchUserDetails = async (userIds) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/blog/participant",
        {
          userIds: userIds,
        }
      );
      setParticipantDetail(response.data);

      const userDetails = response.data;
      const labels = userDetails.map((user) => user.firstname + " " + user.lastname);

      setTopCreatorsData((prevData) => ({
        ...prevData,
        labels: labels,
      }));

      // Perform any other operations with the userDetails
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {topCreatorsData.labels && topCreatorsData.labels.length > 0 ? (
        <Doughnut
          data={topCreatorsData}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Top 10 des créateurs d'articles",
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

export default TopCreatorsChart;
