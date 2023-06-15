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
import { useNavigate } from "react-router-dom";

import * as React from 'react';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { setDoc } from "firebase/firestore";
import Board from "../board_retro/board";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';


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
  const [allCourses, setAllCourses] = useState([]);
  const [choosenCourse, setChoosenCourse] = useState(null)
  const [boardTitle, setBoardTitle] = useState("")
  const [listRetros, setListRetros] = useState();
  const [rows, setRows] = useState([]);
  const [datas, setDatas] = useState(null);
  const [role, setRole] = useState("");
  const [onGoingRetro, setOnGoingRetro] = useState([])

  let navigate = useNavigate();

  const columno = [
    {
      width: 200,
      label: 'titleRetro',
      dataKey: 'titleRetro',
    },
    {
      width: 120,
      label: 'date',
      dataKey: 'date',
      //numeric: true,
    },
    {
      width: 120,
      label: 'name',
      dataKey: 'name',
      numeric: true,
    }
  ];

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  };

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columno.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric || false ? 'right' : 'left'}
            style={{ width: column.width }}
            sx={{
              backgroundColor: 'background.paper',
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function rowContent(_index, row) {
    return (
      <React.Fragment>
        {columno.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? 'right' : 'left'}
          >
            {row[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

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
    if (user?.status == "etudiant") {
        navigate('/retroStudent');
    }
  })



  const getCourse = async (idOwner) => {
    console.log(user);
    await axios.get(`http://localhost:5050/ressources/coursbyowner/${idOwner}`).then(
      (res) => {
        console.log(res.data)
        setAllCourses(res.data)
      }
    )
  }

  useEffect(() => {
    getCourse(user.id)
  }, []);



  useEffect(async () => {

      console.log("wsss");
      let allRetros = [];
      await axios.get("http://localhost:5050/retro/getAllRetrosForPO").then((res) => {
        console.log(res.data);
        let responseRetros = res.data;
        responseRetros.forEach(retro => {
          allRetros.push(retro["dataRetro"])
        });
        const updatedRows = res.data.map((retro) => createData(retro["titleRetro"], retro["date"], retro["po_name"], retro["idRetro"]));
        setRows(updatedRows);
        setDatas(res.data)
      })

      axios.get("http://localhost:5050/retro/getAllRooms").then((res) => 
      {
        console.log(res.data);
        if (res.data.length > 0) {
          setOnGoingRetro(res.data)
        }
        
      })
  }, []);

  useEffect(() => {
    const ws = new w3cwebsocket("ws://localhost:5050/retro");
    ws.onmessage = async (message) => {
      console.log("wsss");
      let allRetros = [];
      await axios.get("http://localhost:5050/retro/getAllRetrosForPO").then((res) => {
        console.log(res.data);
        let responseRetros = res.data;
        responseRetros.forEach(retro => {
          allRetros.push(retro["dataRetro"])
        });
        const updatedRows = res.data.map((retro) => createData(retro["titleRetro"], retro["date"], retro["po_name"], retro["idRetro"]));

        setRows(updatedRows);
        setDatas(res.data)
      })

      axios.get("http://localhost:5050/retro/getAllRooms").then((res) => 
      {
        console.log(res.data);
        if (res.data.length > 0) {
          setOnGoingRetro(res.data)
        }
        
      })
    };
    return () => {
      ws.close();
    };
  });


  const setAllRetrosAtbeginning = async (dataResponse) => {
    let allRetros = [];

    dataResponse.forEach(retro => {
      allRetros.push(retro["dataRetro"])
    });

    console.log(allRetros);
    console.log(allRetro);
    setAllRetro(allRetros);
  }

  useEffect(() => {
    let allRetros = [];
    axios.get("http://localhost:5050/retro/getAllRetrosForPO").then((res) => {
      let responseRetros = res.data;
      setAllRetrosAtbeginning(res.data);
      responseRetros.forEach(retro => {
        allRetros.push(retro["dataRetro"])
      });
      const updatedRows = res.data.map((retro) => createData(retro["titleRetro"], retro["date"], retro["po_name"], retro["idRetro"]));
      setRows(updatedRows);
      setDatas(res.data)

    });

    axios.get("http://localhost:5050/retro/getAllRooms").then((res) => 
    {
      console.log(res.data);
      if (res.data.length > 0) {
        setOnGoingRetro(res.data)
      }
      
    })
  }, []);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getAllRetroByUser = async () => {
    const userId = user.id;

    await axios.get(`http://localhost:5050/retro/getAllRetrosForPO`
    ).then((res) => {
      console.log("************");
      console.log(res.data)
      console.log("************");
      setListRetros(res.data)
    }).catch((err) => {
      console.log(err)
    })
    
  }

  useEffect(() => {
    getAllRetroByUser();
  }, []);

  useEffect(() => {
    console.log(listRetros);
    if (listRetros !== undefined) {
      const updatedRows = listRetros.map((retro) => createData(retro["titleRetro"], retro["date"], retro["po_name"], retro["idRetro"]));
      setRows(updatedRows);
    }
  }, [listRetros]);

  const goToBoard = (idRetro) => {
    console.log(datas);
    datas.map(retro => {
      if (retro["idRetro"] == idRetro) {
        console.log(retro);
        navigate('/boardReview', { state: { retro } });
      }
    })
  }

  const goToOnGoingBoard = () => {
    navigate('/board')
  }

  const validateBoard = async () => {
    if (boardTitle && choosenCourse && retroModel) {

      let choosenModel = null;

      if (retroModel == "GMDBoard") {
        choosenModel = GMDBoard;
      } else if (retroModel == "fourLBoard") {
        choosenModel = FourLBoard;
      } else if (retroModel == "PNABoard") {
        choosenModel = PNABoard;
      }

      await axios.post("http://localhost:5050/retro/newRetro",
        {
          dataRetro: choosenModel,
          titleRetro: boardTitle,
          courseRetro: choosenCourse,
          idUser: user?.id,
          firstname: user?.firstname,
          lastname: user?.lastname
        }
      )
      setBoardTitle("")
      setChoosenCourse(null)
      setRetroModel("'Model de retro'")
      handleClose();
    } else {
      console.log("champ manquant");
    }
  }


  function createData(titleRetro, date, name, idRetro) {
    return { titleRetro, date, name, idRetro };
  }


  return (

    <div className="container-retro">
      <h2> Retrospective </h2>

      {onGoingRetro.length !== 0 ? (
      <div>
        <Button onClick={goToOnGoingBoard}>Rejoindre une retro en cours</Button>

      </div>) : (<></>)}


      <div className="container-in-retro">
        {/* <Button variant="outlined"
          onClick={handleClickOpen} className="add-retro"> + Ajouter une retro </Button> */}
        <div className="historic">
          Choix de la retrospective
          <TableContainer component={Paper} style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>Nom retro</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Proprietaire</TableCell>

                </TableRow>
              </TableHead>
              <TableBody > {/*style={{cursor: "pointer"}}*/}
                {rows.map((row) => (
                  console.log(row),
                  <TableRow key={row.date}>
                    <TableCell component="th" scope="row">
                      {row.titleRetro}
                    </TableCell>
                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => goToBoard(row.idRetro)}> go board </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </div>

      </div>

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
              onChange={(e) => setBoardTitle(e.target.value)}
              wrap="true"
            />

            <InputLabel id="demo-simple-select-label">Type de representation</InputLabel>
            <Select
              labelId="model-retro-select-label"
              id="model-retro-select"
              value={retroModel}
              label="model de retro"
              onChange={(e) => setRetroModel(e.target.value)}
            >
              <MenuItem value="GMDBoard">Glad, Mad, Sad</MenuItem>
              <MenuItem value="fourLBoard">4L</MenuItem>
              <MenuItem value="PNABoard">Positif, Negatif, Axe d'amélioration</MenuItem>
            </Select>

            <InputLabel id="select-course">Cours</InputLabel>
            <Select
              labelId="model-retro-select-label"
              id="model-retro-select"
              value={choosenCourse}
              onChange={(e) => setChoosenCourse(e.target.value)}
            >

              {allCourses.map((course, index) => (
                <MenuItem
                  key={index}
                  value={course}
                  sx={{
                    width: "100%",
                  }}
                >
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button onClick={validateBoard}>Valider</Button>
          </DialogActions>
        </Dialog>
      </div>

      {columns !== null ? <Board choosenColumn={columns} /> : (<></>)}

    </div>
  );
}

export default Retrospective;