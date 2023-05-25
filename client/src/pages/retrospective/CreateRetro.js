import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import RetroHero from "../../assets/img/retrospective_hero.png";
import { TextField, InputLabel, MenuItem, FormControl, Select, Box, Card } from "@mui/material";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NativeSelect from '@mui/material/NativeSelect';

function CreateRetro() {
    const navigate = useNavigate();
    const [cours, setCours] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const initialValues = {
        name: "",
        cours: "",
        type: ""
    };

    const categoriesCreation = () => {
        var newRetro;
        if (formValues.type === "GMS") {
            newRetro = {...formValues,Glad:[],Mad:[],Sad:[]}
        }
        else if (formValues.type === "PNA") {
            newRetro = {...formValues,Positif:[],Negatif:[],Amelioration:[]}
        }
        else if (formValues.type === "4L"){
            newRetro = {...formValues,Like:[],Learned:[],Lacked:[],Longed:[]}
        }
        newRetroRequest(newRetro)
    }

    const newRetroRequest = async (newRetro) => {
        await axios.post("http://localhost:5050/retro", {
            retro:newRetro
        }).then((res) => {
            console.log(res.data)
            // useNavigate().navigate("/");
        }).catch((err) => {
            console.log(err)
        })
    }

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            categoriesCreation();
        }
    });

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

    const validate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Un titre est requis!";
        }
        if(!values.cours || values.cours === "") {
            errors.cours = "Choisissez le cours lié à cette rétrospective";
        }
        if(!values.type || values.type === ""){
            errors.type = "Choisissez un type";
        }

        return errors;
    };

    return(
        <div>
            <form>
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
                />
                {/* Cours lié à la rétro */}
                <h4>Choisissez un cours : </h4>
                <div className="ListUser">
                    {cours.map((courses) => {
                        return (
                            <Card sx={{ maxWidth: 345 }} key={courses.id}>
                              <CardMedia
                                component="img"
                                alt={courses.data.title}
                                height="140"
                                image={courses.data.imageCourseUrl}
                              />
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                  {courses.data.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {courses.data.description}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button size="small">Choisir</Button>
                              </CardActions>
                            </Card>
                        );
                    })}
                </div>
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
                                name: 'age',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value="GMS"> - Glad, Mad, Sad</option>
                            <option value="PNA"> - Positif, Négatif, Amélioration</option>
                            <option value="4L"> - 4L</option>
                        </NativeSelect>
                    </FormControl>
                </div>
                <div className="ListUser">
                    {users.map((user) => {
                        if(user.status === "po"){
                            return (
                                <div key={user.id}>
                                    <h4>{user.firstname} - {user.lastname}</h4>
                                </div>
                            )
                        }
                    })}
                </div>
            </form>
        </div>
    )
}

export default CreateRetro;