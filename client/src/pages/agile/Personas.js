import React, { useState, useEffect } from "react";
import CardPersona from "../../components/agile/CardPersona";
import { w3cwebsocket } from "websocket";
import { Rings } from "react-loader-spinner";
import FormPersona from "../../components/agile/FormPersona";
import { Toaster, toast } from "react-hot-toast";
import html2pdf from "html2pdf.js";
import Button from "@mui/material/Button";
import axios from "axios";
export default function Persona({ dashboardId, actorId }) {
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState({});
  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/persona`);
    wsComments.onopen = function (e) {
      wsComments.send(
        JSON.stringify({ dashboardId: dashboardId, actorId: actorId })
      );
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log(data.persona);
        setPersona(data.persona);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    };
  }, []);
  const exportToPDF = () => {
    const element = document.getElementById("pdf-content");
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: "my_persona.pdf",
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const avatarElements = element.getElementsByClassName("MuiAvatar-root");

        if (avatarElements.length > 0) {
          const canvasElements = document.createElement("canvas");
          const context = canvasElements.getContext("2d");

          for (let i = 0; i < avatarElements.length; i++) {
            const avatar = avatarElements[i];
            const image = avatar.getElementsByTagName("img")[0];
            const imageUrl = image.src;

            const x = avatar.offsetLeft;
            const y = avatar.offsetTop;
            const width = avatar.offsetWidth;
            const height = avatar.offsetHeight;

            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
              context.drawImage(img, x, y, width, height);
              pdf.addImage(
                canvasElements.toDataURL("image/jpeg"),
                "JPEG",
                x,
                y,
                width,
                height
              );
            };
          }
        }

        return pdf.output("arraybuffer");
      })
      .then((buffer) => {
        const formData = new FormData();
        formData.append(
          "pdfFile",
          new Blob([buffer], { type: "application/pdf" }),
          "persona.pdf"
        );
        formData.append("fieldName", "personas");
        formData.append("actorId", actorId);

        return axios.post(
          "http://localhost:5050/agile/" + dashboardId + "/folder",
          formData
        );
      })
      .then((response) => {
        toast.success("Votre persona a été ajouté à votre dossier agile", {
          duration: 5000,
        });
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite. Veuillez réessayer ultérieurement.",
          {
            duration: 5000,
          }
        );
      });
  };

  return (
    <>
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
      ) : Object.keys(persona).length === 0 ? (
        <FormPersona dashboardId={dashboardId} actorId={actorId} />
      ) : (
        <div style={{ margin: 2 }}>
          <Button variant="contained" onClick={exportToPDF}>
            Ajouter au dossier à Agile
          </Button>
          <Toaster />

          <div style={{ margin: "40px" }} id="pdf-content">
            <CardPersona info={persona} />
          </div>
        </div>
      )}
    </>
  );
}
