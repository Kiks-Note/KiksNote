import React,{useState, useEffect} from "react";
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


import Card from './Card';


const ImpactMapping = () => {

    const impactMapping = useSelector((state) => state.impactMapping);

    const [showCard, setShowCard] = useState(false);
    const [columnIndex, setColumnIndex] = useState('');

    const [cardObjectif, setCardObjectif] = useState([]);
    const [cardActors, setCardActors] = useState([]);
    const [cardImpacts, setCardImpacts] = useState([]);
    const [cardDeliverables, setCardDeliverables] = useState([]);


    useEffect(() => {
        console.log('impact', impactMapping);
        setCardObjectif(impactMapping.goal);
        setCardActors(impactMapping.actors);
        setCardImpacts(impactMapping.impacts);
        setCardDeliverables(impactMapping.deliverables);
    }, [impactMapping]);

  const addCard = (index) => {
    console.log("addCard");
    setShowCard(true);
    setColumnIndex(index.toString());
  };

  const handleConfirmForm = () => {
    setShowCard(false);
    setColumnIndex('');
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
                {cardObjectif.map((texte)=>{
                    return <Card type="card" texte={texte} key={texte}/>
                })}
                {showCard && columnIndex === '0' && (
                    <Card type="form" column={0} onConfirmForm={handleConfirmForm}/>
                )}
                <IconButton
                    aria-label="add"
                    onClick={() => addCard(0)}
                >
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
              {cardActors.map((texte)=>{
                    return <Card type="card" texte={texte} key={texte}/>
                })}
              {showCard && columnIndex === '1' && (
                    <Card type="form" column={1} onConfirmForm={handleConfirmForm}/>
                )}
                <IconButton aria-label="add"  onClick={() => addCard(1)}>
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
              {cardImpacts.map((texte)=>{
                    return <Card type="card" texte={texte} key={texte}/>
                })}
                {showCard && columnIndex === '2' && (
                    <Card type="form" column={2} onConfirmForm={handleConfirmForm}/>
                )}
                <IconButton aria-label="add"  onClick={() => addCard(2)}>
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
              {cardDeliverables.map((texte)=>{
                    return <Card type="card" texte={texte} key={texte}/>
                })}
                
              {showCard && columnIndex === '3' && (
                    <Card type="form" column={3} onConfirmForm={handleConfirmForm}/>
                )}
                <IconButton aria-label="add"  onClick={() => addCard(3)}>
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
