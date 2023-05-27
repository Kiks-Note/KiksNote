import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import RetroHero from "../../assets/img/retrospective_hero.png";
import { TextField, InputLabel, MenuItem, FormControl, Select, Box, Card } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import NativeSelect from '@mui/material/NativeSelect';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';

function CreateRetro() {

    const [formData, setFormData] = useState({
        title: "",
        cours: "",
        type: "",
        po: "",
    });

    const [cours, setCours] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [checked, setChecked] = React.useState([1]);
    const [checked2, setChecked2] = React.useState([1]);

    const handlePoToggle = (value) => () => {
        if (checked === value) {
          setChecked(null);
        } else {
            setFormData({...formData, po: value});
            setChecked(value);
        }
    };

    const handleCoursesToggle = (value) => () => {
        if (checked2 === value) {
            setChecked2(null);
        } else {
            setFormData({...formData, cours: value});
            setChecked2(value);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const newRetroRequest = async (newRetro) => {
        await axios.post("http://localhost:5050/retro/newretro", {
            retro:newRetro
        }).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        newRetroRequest(formData);
        console.log(formData);
    }

    useEffect(() => {
        const getAllCours = async () => {
            try {
                await axios
                .get("http://localhost:5050/ressources/cours")
                .then((res) => {
                    setCours(res.data.cours);
                })
                .catch((err) => {
                    console.log(err);
                })
            }catch(error){
                console.log(error);
            }
        };
        getAllCours();
    }, []);

    useEffect(() => {
        const getUsers = async () => {
            try {
                await axios
                .get("http://localhost:5050/ressources/instructors")
                .then((res) => {
                    setUsers(res.data);
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
            }catch(error){
                console.log(error);
            }
        };
        getUsers();
    }, []);

    return(
        <div>
            <form onSubmit={handleSubmit} >
                <h1 style={{
                        textAlign: "center",
                        marginTop: "5%",
                        marginBottom: "5%",
                        fontSize: "3rem",
                        fontWeight: "bold",
                        color: "#3f51b5",
                    }} 
                >CRÉER TA RETROSPECTIVE</h1>
                <img src={RetroHero} style={{
                    width: "40%",
                    height: "50%",
                    objectFit: "cover",
                    objectPosition: "center",
                    margin: "auto",
                    display: "block",
                }} />
                {/* PARTIE FORMULAIRE */}
                <h3 style={{
                    textAlign: "center",
                    marginTop: "5%",
                    marginBottom: "5%",
                    fontSize: "2rem",
                    fontWeight: "bold",
                }}> Rétro créée le : {currentDate.toDateString()}</h3>
                {/* Titre de la rétro */}
                <TextField
                    id="outlined-title-input"
                    label="Titre"
                    type="title"
                    autoComplete="current-title"
                    style={{
                        width: "50%",
                        margin: "auto",
                        display: "block",
                        marginTop: "5%",
                        marginBottom: "5%",
                    }}
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                {/* PO */}
                <div className="ListUser">
                    <h4>Choisissez un PO : </h4>
                    <FormControl fullWidth style={{
                        width: "50%",
                        margin: "auto",
                        display: "block",
                    }}>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Templates
                        </InputLabel>
                        <NativeSelect
                            defaultValue="GMS"
                            inputProps={{
                                name: 'type',
                                id: 'uncontrolled-native',
                            }}
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option value="GMS"> - Glad, Mad, Sad</option>
                            <option value="PNA"> - Positif, Négatif, Amélioration</option>
                            <option value="4L"> - 4L</option>
                        </NativeSelect>
                    </FormControl>
                </div>
                {/* Listes des PO */}
                <div className="ListUser">
                    {users.map((user) => {
                        if(user.status === "po"){
                            return (
                                <div key={user.id}>
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={`Avatar n°${user.id + 1}`}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText id={user.id} primary={`${user.firstname} ${user.lastname}`} />
                                                <Checkbox
                                                    checked={checked.indexOf(user.id) !== -1}
                                                    onChange={handlePoToggle(user.id)}
                                                    inputProps={{
                                                        'aria-labelledby': user.id,
                                                    }}
                                                    name="po"
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </div>
                            );
                        }
                        return null;
                    })}
                {/* Cours lié à la rétro */}
                    <h4>Choisissez un cours : </h4>
                    {cours.map((courses) => {
                        return (
                            <Card sx={{ maxWidth: 345 }} key={courses.id}>
                              <CardMedia
                                component="img"
                                alt={courses.data.title}
                                height="140"
                                image={courses.data.imageCourseUrl}
                                name="cours"
                              />
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                  {courses.data.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {courses.data.description}
                                </Typography>
                                </CardContent>
                                <Checkbox
                                    checked={checked2.indexOf(courses.id) !== -1}
                                    onChange={handleCoursesToggle(courses.id)}
                                    inputProps={{
                                        'aria-labelledby': courses.id,
                                    }}
                                    name="cours"
                                />
                            </Card>
                        );
                    })}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateRetro;