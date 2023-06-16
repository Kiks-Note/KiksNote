import "chartjs-adapter-moment";
import "chartjs-plugin-datalabels";
import React, {useEffect, useState} from "react";

export default function TotalMacCount() {
  const [macCount, setMacCount] = useState(0);

  useEffect(() => {
    const fetchMacData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_API}/inventory`
        ); // Endpoint pour récupérer toutes les données de la collection "inventory"
        const data = await response.json();

        // Filtrer les données pour n'inclure que celles avec la variable "category" de type "Mac"
        const macData = data.filter((item) =>
          ["Mac", "MacBook", "MacBook Pro", "MacBook Air"].includes(
            item.category
          )
        );

        // Compter le nombre de résultats
        const count = macData.length;
        console.log("Nombre total de Mac :", count);

        // Mettre à jour l'état avec le nombre total de résultats
        setMacCount(count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMacData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "poppins-semiBold",
          fontSize: "18px",
          color: "grey",
        }}
      >
        Nombre total de Mac :{" "}
      </span>
      <span
        style={{
          fontFamily: "poppins-semibold",
          fontSize: "2.5rem",
          marginTop: "50px",
          minWidth: "125px",
          height: "100px",
          backgroundColor: "#1E4675",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          borderTopLeftRadius: "30px",
          borderBottomRightRadius: "30px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "10px",

          color: "white",
          boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.15)",
        }}
      >
        {macCount}
      </span>
    </div>
  );
}
