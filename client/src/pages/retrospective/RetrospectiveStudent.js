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
import Autocomplete from '@mui/material/Autocomplete';

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
  const [allTeamMates, setAllTeamMates] = useState([])

  let navigate = useNavigate();


  useEffect(() => {
    if (user?.status == "po") {
        navigate('/retro');
    }
  })

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

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
    {
      label: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { label: 'City of God', year: 2002 },
    { label: 'Se7en', year: 1995 },
    { label: 'The Silence of the Lambs', year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: 'Life Is Beautiful', year: 1997 },
    { label: 'The Usual Suspects', year: 1995 },
    { label: 'Léon: The Professional', year: 1994 },
    { label: 'Spirited Away', year: 2001 },
    { label: 'Saving Private Ryan', year: 1998 },
    { label: 'Once Upon a Time in the West', year: 1968 },
    { label: 'American History X', year: 1998 },
    { label: 'Interstellar', year: 2014 },
    { label: 'Casablanca', year: 1942 },
    { label: 'City Lights', year: 1931 },
    { label: 'Psycho', year: 1960 },
    { label: 'The Green Mile', year: 1999 },
    { label: 'The Intouchables', year: 2011 },
    { label: 'Modern Times', year: 1936 },
    { label: 'Raiders of the Lost Ark', year: 1981 },
    { label: 'Rear Window', year: 1954 },
    { label: 'The Pianist', year: 2002 },
    { label: 'The Departed', year: 2006 },
    { label: 'Terminator 2: Judgment Day', year: 1991 },
    { label: 'Back to the Future', year: 1985 },
    { label: 'Whiplash', year: 2014 },
    { label: 'Gladiator', year: 2000 },
    { label: 'Memento', year: 2000 },
    { label: 'The Prestige', year: 2006 },
    { label: 'The Lion King', year: 1994 },
    { label: 'Apocalypse Now', year: 1979 },
    { label: 'Alien', year: 1979 },
    { label: 'Sunset Boulevard', year: 1950 },
    {
      label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { label: 'The Great Dictator', year: 1940 },
    { label: 'Cinema Paradiso', year: 1988 },
    { label: 'The Lives of Others', year: 2006 },
    { label: 'Grave of the Fireflies', year: 1988 },
    { label: 'Paths of Glory', year: 1957 },
    { label: 'Django Unchained', year: 2012 },
    { label: 'The Shining', year: 1980 },
    { label: 'WALL·E', year: 2008 },
    { label: 'American Beauty', year: 1999 },
    { label: 'The Dark Knight Rises', year: 2012 },
    { label: 'Princess Mononoke', year: 1997 },
    { label: 'Aliens', year: 1986 },
    { label: 'Oldboy', year: 2003 },
    { label: 'Once Upon a Time in America', year: 1984 },
    { label: 'Witness for the Prosecution', year: 1957 },
    { label: 'Das Boot', year: 1981 },
    { label: 'Citizen Kane', year: 1941 },
    { label: 'North by Northwest', year: 1959 },
    { label: 'Vertigo', year: 1958 },
    {
      label: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { label: 'Reservoir Dogs', year: 1992 },
    { label: 'Braveheart', year: 1995 },
    { label: 'M', year: 1931 },
    { label: 'Requiem for a Dream', year: 2000 },
    { label: 'Amélie', year: 2001 },
    { label: 'A Clockwork Orange', year: 1971 },
    { label: 'Like Stars on Earth', year: 2007 },
    { label: 'Taxi Driver', year: 1976 },
    { label: 'Lawrence of Arabia', year: 1962 },
    { label: 'Double Indemnity', year: 1944 },
    {
      label: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { label: 'Amadeus', year: 1984 },
    { label: 'To Kill a Mockingbird', year: 1962 },
    { label: 'Toy Story 3', year: 2010 },
    { label: 'Logan', year: 2017 },
    { label: 'Full Metal Jacket', year: 1987 },
    { label: 'Dangal', year: 2016 },
    { label: 'The Sting', year: 1973 },
    { label: '2001: A Space Odyssey', year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: 'Toy Story', year: 1995 },
    { label: 'Bicycle Thieves', year: 1948 },
    { label: 'The Kid', year: 1921 },
    { label: 'Inglourious Basterds', year: 2009 },
    { label: 'Snatch', year: 2000 },
    { label: '3 Idiots', year: 2009 },
    { label: 'Monty Python and the Holy Grail', year: 1975 },
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


  const getTeamMates = async () => {
     let studentClass = user?.class

    try {
      const response = await axios.get(`http://localhost:5050/retro/getTeamMates/${studentClass}`);
      const allTeamMates = response.data;
      console.log(allTeamMates);
  
      const liste = allTeamMates.map(el => ({ label: el.firstname + "/" +el.class, data: el }));
      console.log(liste);
  
      setAllTeamMates(liste);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
   getTeamMates()
  }, []);

  useEffect(() => {
    const ws = new w3cwebsocket("ws://localhost:5050/retro");
    ws.onmessage = async (message) => {
      console.log("wsss");
      let allRetros = [];
      await axios.get("http://localhost:5050/retro/getAll").then((res) => {
        console.log(res.data);
        let responseRetros = res.data;
        responseRetros.forEach(retro => {
          allRetros.push(retro["dataRetro"])
        });
        const updatedRows = res.data.map((retro) => createData(retro["titleRetro"], retro["creationDate"], retro["firstname"] + " " + retro["lastname"], retro["idRetro"]));
        setRows(updatedRows);
        setDatas(res.data)
      })
    };
    return () => {
      ws.close();
    };
  }, []);


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
    axios.get("http://localhost:5050/retro/getAll").then((res) => {
      let responseRetros = res.data;
      setAllRetrosAtbeginning(res.data);

    });
  }, []);


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

  const getAllRetroByUser = async () => {
    const userId = user.id;

    if (user.status == "po") {
      console.log("im a po");
      await axios.get(`http://localhost:5050/retro/getAll`
      ).then((res) => {
        console.log("************");
        console.log(res.data)
        console.log("************");
        setListRetros(res.data)
      }).catch((err) => {
        console.log(err)
      })
    } else if (user.status == "etudiant") {
      console.log("im a student ");
      await axios.get(`http://localhost:5050/retro/getAll`
      ).then((res) => {
        console.log("************");
        console.log(res.data)
        console.log("************");
        setListRetros(res.data)
      }).catch((err) => {
        console.log(err)
      })

    }
  }



  useEffect(() => {
    getAllRetroByUser();
  }, []);

  useEffect(() => {
    console.log(listRetros);
    if (listRetros !== undefined) {
      const updatedRows = listRetros.map((retro) => createData(retro["titleRetro"], retro["creationDate"], retro["firstname"] + " " + retro["lastname"], retro["idRetro"]));
      setRows(updatedRows);
    }
  }, [listRetros]);

  const goToBoard = (idRetro) => {
    datas.map(retro => {
      if (retro["idRetro"] == idRetro) {
        console.log(retro);
        navigate('/boardRetro', { state: { retro } });
      }
    })
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

      <Button onClick={getAllRetroByUser} > Get retros </Button>


      <div className="container-in-retro">
        <Button variant="outlined"
          onClick={handleClickOpen} className="add-retro"> + Ajouter une retro </Button>
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

            <InputLabel id="select-course">Personnes invitées</InputLabel>
            <Autocomplete
            disablePortal
            multiple
            id="combo-box-demo"
            options={allTeamMates}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params}  />} //label="Movie"
          />
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