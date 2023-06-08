import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { w3cwebsocket } from "websocket";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Card from "../../components/agile/Card";
import {
  getImpactMapping,
  addImpactMapping,
} from "../../components/agile/agile";
import { setImpactMapping } from "../../redux/slices/impactMappingSlice";

ImpactMapping.propTypes = {
  data: PropTypes.object.isRequired,
};

export default function ImpactMapping({ data }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { goals, actors, impacts, deliverables } = useSelector(
    (state) => state.impactMapping
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [showCard, setShowCard] = useState(false);
  const [columnIndex, setColumnIndex] = useState("");
  const [textAlert, setTextAlert] = useState("undefined");
  const [cardObjectif, setCardObjectif] = useState([]);
  const [cardActors, setCardActors] = useState([]);
  const [cardImpacts, setCardImpacts] = useState([]);
  const [cardDeliverables, setCardDeliverables] = useState([]);

  useEffect(() => {
    getImpactMappingInfo();
  }, []);

  useEffect(() => {
    addDataToImpactMappingDB();
    setCardObjectif(goals);
    setCardActors(actors);
    setCardImpacts(impacts);
    setCardDeliverables(deliverables);
  }, [goals, actors, impacts, deliverables]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const addDataToImpactMappingDB = async () => {
    if (goals && actors && deliverables && impacts && goals.length !== 0) {
      console.log(deliverables.length);
      const res = await addImpactMapping({
        dashboardId: data.dashboardId,
        goals: goals,
        actors: actors,
        impacts: impacts,
        deliverables: deliverables,
      });
      if (res.status === 200) {
        setTextAlert("Impact mapping mis à jour.");
        setOpenSnackbar(true);
      } else {
        setTextAlert("Erreur lors de la mise à jour de votre impact mapping.");
      }
    }
  };

  const addCard = (index) => {
    setShowCard(true);
    setColumnIndex(index.toString());
  };

  const handleButtonForm = () => {
    setShowCard(false);
    setTextAlert("");
    setColumnIndex("");
  };

  const getImpactMappingInfo = async () => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/impact`);
    wsComments.onopen = () => {
      console.log("Connected to server");
      wsComments.send(JSON.stringify({ dashboardId: data.dashboardId }));
    };
    wsComments.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      dispatch(
        setImpactMapping({
          goals: data.goals,
          actors: data.actors,
          impacts: data.impacts,
          deliverables: data.deliverables,
        })
      );
    };
  };
  const exportToPDF = () => {
    const element = document.getElementById("pdf-content");
    const opt = {
      margin: [0, 0, 0, 0],
      filename: "impact_mapping.pdf",
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "paysage" },
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
          "impact-mapping.pdf"
        );
        formData.append("fieldName", "impact_mapping");

        return axios.post(
          "http://localhost:5050/agile/" + data.dashboardId + "/folder",
          formData
        );
      })
      .then((response) => {
        toast.success("Votre impact Mapping a été ajouté a votre dossier agile", {
          duration: 5000,
        });
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite veuillez réessayer ultérieurement",
          {
            duration: 5000,
          }
        );
      });
  };
  return (
    <div style={{ margin: 2 }}>
      <Button variant="contained" onClick={exportToPDF}>
        Ajouter au dossier à Agile
      </Button>
      <Toaster />
      <TableContainer
        id="pdf-content"
        sx={{
          width: "100%",
          height: "100%",
          padding: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ border: "2px solid black" }}>
                Objectif
              </TableCell>
              <TableCell align="center" sx={{ border: "2px solid black" }}>
                Acteurs
              </TableCell>
              <TableCell align="center" sx={{ border: "2px solid black" }}>
                Impacts
              </TableCell>
              <TableCell align="center" sx={{ border: "2px solid black" }}>
                Deliverables
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                align="center"
                sx={{ padding: 2, width: "20%", border: "1px solid black" }}
              >
                {cardObjectif.map((goal, index) => {
                  return (
                    <Card
                      title="Objectif"
                      type="card"
                      column={0}
                      texte={goal.text}
                      key={index}
                      index={index}
                      defineColor={goal.color}
                      dashboardId={data.dashboardId}
                    />
                  );
                })}
                {showCard && columnIndex === "0" && (
                  <Card
                    type="form"
                    column={0}
                    onCloseForm={handleButtonForm}
                    dashboardId={data.dashboardId}
                  />
                )}
                <IconButton aria-label="add" onClick={() => addCard(0)}>
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell
                align="center"
                sx={{ padding: 2, width: "20%", border: "1px solid black" }}
              >
                {cardActors.map((actor, index) => {
                  return (
                    <Card
                      title="Acteur"
                      type="card"
                      column={1}
                      texte={actor.text}
                      key={index}
                      index={index}
                      defineColor={actor.color}
                      dashboardId={data.dashboardId}
                    />
                  );
                })}
                {showCard && columnIndex === "1" && (
                  <Card
                    type="form"
                    column={1}
                    onCloseForm={handleButtonForm}
                    dashboardId={data.dashboardId}
                  />
                )}
                <IconButton aria-label="add" onClick={() => addCard(1)}>
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell
                align="center"
                sx={{ padding: 2, width: "20%", border: "1px solid black" }}
              >
                {cardImpacts.map((impact, index) => {
                  return (
                    <Card
                      title="Impact"
                      type="card"
                      column={2}
                      texte={impact.text}
                      key={index}
                      index={index}
                      defineColor={impact.color}
                      dashboardId={data.dashboardId}
                    />
                  );
                })}
                {showCard && columnIndex === "2" && (
                  <Card
                    type="form"
                    column={2}
                    onCloseForm={handleButtonForm}
                    dashboardId={data.dashboardId}
                  />
                )}
                <IconButton aria-label="add" onClick={() => addCard(2)}>
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell
                align="center"
                sx={{ padding: 2, width: "20%", border: "1px solid black" }}
              >
                {cardDeliverables.map((deliverable, index) => {
                  return (
                    <Card
                      title="Deliverables"
                      type="card"
                      column={3}
                      texte={deliverable.text}
                      key={index}
                      index={index}
                      defineColor={deliverable.color}
                      dashboardId={data.dashboardId}
                    />
                  );
                })}

                {showCard && columnIndex === "3" && (
                  <Card
                    type="form"
                    column={3}
                    onCloseForm={handleButtonForm}
                    dashboardId={data.dashboardId}
                  />
                )}
                <IconButton aria-label="add" onClick={() => addCard(3)}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {textAlert}
          </Alert>
        </Snackbar>
      </TableContainer>
    </div>
  );
}
