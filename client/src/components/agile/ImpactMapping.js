import React,{useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import Card from './Card';

const ImpactMapping = () => {
    const [cardObjectif, setCardObjectif] = useState([]);
    const [cardActors, setCardActors] = useState([]);
    const [cardImpacts, setCardImpacts] = useState([]);
    const [cardDeliverables, setCardDeliverables] = useState([]);

  const addCard = () => {
    console.log("addCard");
    setCardObjectif([...cardObjectif, <Card title="Adrien" type="card"/>]);
  };

  const confirmCard = () =>{
    console.log("confirmCard");
  };
  return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" >Objectif</TableCell>
              <TableCell align="center">Acteurs</TableCell>
              <TableCell align="center">Impacts</TableCell>
              <TableCell align="center">Deliverables</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
                {cardObjectif}

                <IconButton aria-label="add" onClick={addCard}>
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
              <Card title="Adrien" type="form"/>
                <IconButton aria-label="add" onClick={addCard}>
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
                <IconButton aria-label="add" onClick={addCard}>
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
                <IconButton aria-label="add" onClick={addCard}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
  );
};

export default ImpactMapping;
