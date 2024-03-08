import React, { useState, useEffect } from "react";
import "../agile/agile.css";
import Button from "@mui/material/Button";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import { Rings } from "react-loader-spinner";
import ElevatorPitch from "../../components/agile/ElevatorPitch";
import { w3cwebsocket } from "websocket";
import CardElevatorPitch from "../../components/agile/CardElevatorPitch";
export default function ElevatorPitchPage({ dashboardId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const getElevatorPitch = async () => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/elevator`);
    wsComments.onopen = () => {
      wsComments.send(JSON.stringify({ dashboardId: dashboardId }));
    };
    wsComments.onmessage = (message) => {
      const elevator = JSON.parse(message.data);
      setData(elevator);
      setLoading(false);
    };
  };

  useEffect(() => {
    getElevatorPitch();
  }, []);
  const exportToPDF = () => {
    const element = document.getElementById("pdf-content");
    const opt = {
      margin: [0, 0, 0, 0],
      filename: "impact_mapping.pdf",
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: [297, 210], orientation: "landscape" },
    };

    //html2pdf().set(opt).from(element).save();

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        return pdf.output("arraybuffer");
      })
      .then((buffer) => {
        const formData = new FormData();
        formData.append(
          "pdfFile",
          new Blob([buffer], { type: "application/pdf" }),
          "elevator-pitch.pdf"
        );
        formData.append("fieldName", "elevator_pitch");

        return axios.post(
          "http://localhost:5050/agile/" + dashboardId + "/folder",
          formData
        );
      })
      .then((response) => {
        toast.success(
          "Votre elevator Pitch a été ajouté a votre dossier agile",
          {
            duration: 5000,
          }
        );
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite veuillez réessayer ultérieurement" + error,
          {
            duration: 5000,
          }
        );
      });
  };
  return (
    <Box sx={{ width: "100%", paddingLeft: 10, paddingRight: 10 }}>
      <h1>Elevator Pitch</h1>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : data.forWho.length !== 0 ? (
        <>
          <Button variant="contained" onClick={exportToPDF}>
            Ajouter au dossier à Agile
          </Button>
          <Toaster />
          <div id="pdf-content">
            <CardElevatorPitch info={data} />
          </div>
        </>
      ) : (
        <ElevatorPitch dashboardId={dashboardId} />
      )}
    </Box>
  );
}
