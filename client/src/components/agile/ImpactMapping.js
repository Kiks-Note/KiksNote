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
        setCardObjectif(impactMapping.goals);
        setCardActors(impactMapping.actors);
        setCardImpacts(impactMapping.impacts);
        setCardDeliverables(impactMapping.deliverables);
    }, [impactMapping]);

  const addCard = (index) => {
    console.log("addCard");
    setShowCard(true);
    setColumnIndex(index.toString());
  };

  const handleButtonForm = () => {
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
                {cardObjectif.map((texte, index)=>{
                    return <Card title='Objectif' type="card" column={0} texte={texte} key={index} index={index}/>
                })}
                {showCard && columnIndex === '0' && (
                    <Card type="form" column={0} onCloseForm={handleButtonForm}/>
                )}
                <IconButton
                    aria-label="add"
                    onClick={() => addCard(0)}
                >
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
              {cardActors.map((texte, index)=>{
                    return <Card title='Acteur' type="card" column={1} texte={texte} key={index} index={index}/>
                })}
              {showCard && columnIndex === '1' && (
                    <Card type="form" column={1} onCloseForm={handleButtonForm}/>
                )}
                <IconButton aria-label="add"  onClick={() => addCard(1)}>
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
              {cardImpacts.map((texte, index)=>{
                    return <Card title='Impact' type="card" column={2} texte={texte} key={index} index={index}/>
                })}
                {showCard && columnIndex === '2' && (
                    <Card type="form" column={2} onCloseForm={handleButtonForm}/>
                )}
                <IconButton aria-label="add"  onClick={() => addCard(2)}>
                  <AddIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center" sx={{ padding: 2, width:'20%', border: '1px solid black'}}>
              {cardDeliverables.map((index, texte)=>{
                    return <Card title="Deliverables" column={3} type="card" texte={texte} key={index} index={index}/>
                })}
                
              {showCard && columnIndex === '3' && (
                    <Card type="form" column={3} onCloseForm={handleButtonForm}/>
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
