import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import PostIt from "../../components/agile/PostIt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";


import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { setDoc } from "firebase/firestore";
import Board from "../../components/retro/board";

function Retrospective() {
  const { user } = useFirebase();
  


  const [open, setOpen] = useState(false);
  const [openPostItEdit, setOpenPostItEdit] = useState(false);
  const [postItText, setPostItText] = useState("");
  const [categorie, setCategorie] = useState("")
  const [selectedPostItIndex, setSelectedPostItIndex] = useState();
  const [retroModel, setRetroModel] = useState('Model de retro')
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [columns, setColumns] = useState(null);
  const [allRetro, setAllRetro] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [newPostItContent, setNewPostItContent] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [selectedRetro, setSelectedRetro] = useState('');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [currentRetroIndex, setCurrentRetroIndex] = useState(null)
  const [choosenCourse, setChoosenCourse] = useState(null)

  const GMDBoard = {
    Glad: {
      name: "Glad",
      color: "#ff0000",
      params: "1 / 1 / 3 / 3",
      items: [],
    },
    Mad: {
      name: "Mad",
      color: "#0000ff",
      params: "1 / 3 / 3 / 5",
      items: [],
    },
    Sad: {
      name: "Sad",
      color: "#9ACD32",
      params: "3 / 1 / 5 / 3",
      items: [],
    }
  };

  const PNABoard = {
    Positif: {
      name: "Positif",
      color: "#ff0000",
      params: "1 / 1 / 3 / 3",
      items: [],
    },
    Negatif: {
      name: "Négatif",
      color: "#0000ff",
      params: "1 / 3 / 3 / 5",
      items: [],
    },
    Axe: {
      name: "Axe d'amélioration",
      color: "#9ACD32",
      params: "3 / 1 / 5 / 3",
      items: [],
    }
  };

  const FourLBoard = {
    Liked: {
      name: "Liked",
      color: "#ff0000",
      params: "1 / 1 / 3 / 3",
      items: [],
    },
    Learned: {
      name: "Learned",
      color: "#0000ff",
      params: "1 / 3 / 3 / 5",
      items: [],
    },
    Lacked: {
      name: "Lacked",
      color: "#9ACD32",
      params: "3 / 1 / 5 / 3",
      items: [],
    },
    Longed: {
      name: "Longed",
      color: "#FFFF00",
      params: "3 / 3 / 5 / 5",
      items: [],
    }
  };




  useEffect(() => {

    const ws = new w3cwebsocket("ws://localhost:5050/retro");
    ws.onmessage = (message) => {
      const receivedData = JSON.parse(message.data);
      //  setDocuments(receivedData);
      if (currentRetroIndex !== null) {
        setColumns(receivedData[currentRetroIndex]["dataRetro"])
      } else {
        console.log("current index is null");
      }
      
    };


    return () => {
      ws.close();
    };
  }, [currentRetroIndex, currentRetroIndex]);

  useEffect(() => {

    let allRetros = [];
    axios.get("http://localhost:5050/retro/getAll").then((res) => {
      let responseRetros = res.data;
      responseRetros.forEach(retro => {
        allRetros.push(retro["dataRetro"])
      });
      setAllRetro(allRetros);
    });


  }, []);




  const saveToDb = async () => {
    if (columns == null) return;
    // setCurrentRetroIndex(allRetro.length)
    await axios.post(
      `http://localhost:5050/retro/newRetro`,
      {
        dataRetro: columns,
        idUser: user?.id
      }
    );
  }



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleValidate = (e) => {
    let value = e.target.value;
    if (value == "GMDBoard") {
      setColumns(GMDBoard)
    } else if (value == "fourLBoard") {
      setColumns(FourLBoard)
    } else if (value == "PNABoard") {
      setColumns(PNABoard)
    }
    setRetroModel(e.target.value)
    setOpen(false);

  }

  return (

    <div className="container-retro">
      <h2> Retrospective </h2>


      <div className="container-in-retro">
      <Button variant="outlined"
 onClick={handleClickOpen} className="add-retro"> + Ajouter une retro </Button>
        <div className="historic">
          Choix de la retrospective
          <table>
            <tr>
              <tl>
                Nom
              </tl>
              <tl>
                Nom
              </tl>
              <tl>
                Nom
              </tl>
            </tr>
          </table>
        </div>
  
      </div>

      
{/* 
      <Select
        onChange={(e) => setColumns(e.target.value)}
      >
        {allRetro.map((retroElem, index) => (
          <MenuItem
            key={index}
            value= {retroElem || null} 
            sx={{
              width: "100%",
            }}
            onClick={()=> setCurrentRetroIndex(index)}
          >
            {index}
          </MenuItem>
        ))}
      </Select> */}

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"sm"}
        >
          <DialogTitle>Créer une nouvelle retrospective</DialogTitle>
  
          <DialogContent>
                    
            <TextField
            
            aria-describedby="my-helper-text"
            //InputLabelProps={{ shrink: true }}
            variant="outlined"
            placeholder="Titre"
            
            fullWidth
            //onChange={(e) => setText(e.target.value)}
            wrap="true"
          />

            <InputLabel id="demo-simple-select-label">Type de representation</InputLabel>
            <Select
              labelId="model-retro-select-label"
              id="model-retro-select"
              value={retroModel}
              label="model de retro"
              //onChange={handleValidate}
            >
              <MenuItem value="GMDBoard">Glad, Mad, Sad</MenuItem>
              <MenuItem value="fourLBoard">4L</MenuItem>
              <MenuItem value="PNABoard">Positif, Negatif, Axe d'amélioration</MenuItem>
            </Select>

            <InputLabel id="select-course">Cours</InputLabel>
            <Select
              labelId="model-retro-select-label"
              id="model-retro-select"
              value={retroModel}
              onChange={setChoosenCourse}
            >
              <MenuItem value="HTML/CSS">HTML/CSS</MenuItem>
              <MenuItem value="JS">JavaScript</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
          </DialogActions>
        </Dialog>
      </div>
    
      {columns !== null ? <Board choosenColumn = {columns}/> : (<></>)}


    </div>
  );
}

export default Retrospective;