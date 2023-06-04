import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import Card from "../../components/agile/Card";
import { getImpactMapping } from "../../components/agile/agile";
import { setImpactMapping } from "../../redux/slices/impactMappingSlice";

ImpactMapping.propTypes = {
  data: PropTypes.array.isRequired,
};

export default function ImpactMapping({ data }) {
  const dispatch = useDispatch();
  const { goals, actors, impacts, deliverables } = useSelector(
    (state) => state.impactMapping
  );
  const [showCard, setShowCard] = useState(false);
  const [columnIndex, setColumnIndex] = useState("");

  const [cardObjectif, setCardObjectif] = useState([]);
  const [cardActors, setCardActors] = useState([]);
  const [cardImpacts, setCardImpacts] = useState([]);
  const [cardDeliverables, setCardDeliverables] = useState([]);

  useEffect(() => {
    getImpactMappingInfo();
    setCardObjectif(goals);
    setCardActors(actors);
    setCardImpacts(impacts);
    setCardDeliverables(deliverables);
  }, [goals, actors, impacts, deliverables]);

  const addCard = (index) => {
    setShowCard(true);
    setColumnIndex(index.toString());
  };

  const handleButtonForm = () => {
    setShowCard(false);
    setColumnIndex("");
  };

  const getImpactMappingInfo = async () => {
    console.log('oui')
    const impact = await getImpactMapping(data.dashboardId);
    console.log('impactMapping12', impact.actors);
    dispatch(setImpactMapping(impact.goals, impact.actors, impact.impacts, impact.deliverables));
  };
  return (
    <TableContainer
      component={Paper}
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
                <Card type="form" column={0} onCloseForm={handleButtonForm} />
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
                <Card type="form" column={1} onCloseForm={handleButtonForm} />
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
                <Card type="form" column={2} onCloseForm={handleButtonForm} />
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
                <Card type="form" column={3} onCloseForm={handleButtonForm} />
              )}
              <IconButton aria-label="add" onClick={() => addCard(3)}>
                <AddIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
