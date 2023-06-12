import "chartjs-adapter-moment";
import "chartjs-plugin-datalabels";
import React, {useEffect, useState} from "react";

export default function TotalMacCount() {
  const [macCount, setMacCount] = useState(0);

  useEffect(() => {
    const fetchMacData = async () => {
      try {
        const response = await fetch("http://localhost:5050/inventory"); // Endpoint pour récupérer toutes les données de la collection "inventory"
        const data = await response.json();

        // Filtrer les données pour n'inclure que celles avec la variable "category" de type "Mac"
        const macData = data.filter((item) => item.category === "Mac");

        // Compter le nombre de résultats
        const count = macData.length;

        // Mettre à jour l'état avec le nombre total de résultats
        setMacCount(count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMacData();
  }, []);

  return (
    <div>
      <span
        style={{
          fontFamily: "poppins-regular",
          fontSize: "1.25rem",
        }}
      >
        Nombre total de Mac :{" "}
      </span>
      <span
        style={{
          fontFamily: "poppins-semibold",
          fontSize: "1.25rem",
        }}
      >
        {macCount}
      </span>
    </div>
  );
}
