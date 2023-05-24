import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

function TopCreatorsChart() {
  const [topCreatorsData, setTopCreatorsData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
 
    try {
        const response = await axios.get('http://localhost:5050/blog/created_by');
        const blogs = response.data;
  
      const creatorsMap = new Map();
      blogs.forEach(blog => {
        const creator = blog.created_by.name;
        if (creatorsMap.has(creator)) {
          creatorsMap.set(creator, creatorsMap.get(creator) + 1);
        } else {
          creatorsMap.set(creator, 1);
        }
      });
  
      const topCreators = Array.from(creatorsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
  
      const labels = topCreators.map(creator => creator[0]);
      const data = topCreators.map(creator => creator[1]);
  
      setTopCreatorsData({
        labels,
        datasets: [
          {
            label: "Nombre d'articles créés",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données des créateurs :", error);
    }
  };
  

  return (
    <div>
      <h2>Top 10 des créateurs d'articles</h2>
      {topCreatorsData.labels && topCreatorsData.labels.length > 0 ? (
        <Bar data={topCreatorsData} />
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
}

export default TopCreatorsChart;
