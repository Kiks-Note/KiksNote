import "./Profile.scss";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  InputLabel,
  Input,
  Button,
  IconButton,
  Avatar,
  Alert,
  Box,
  Grid,
  Container,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm} from "react-hook-form";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
export default function Profile() {
  const today = new Date().toISOString().substring(0, 10);
  const [image, setImage] = useState(null);
  const [pictureToUpload, setPictureToUpload] = useState(null);
  const [user, setUser] = useState();
  const [isLoading, setLoading] = useState(false);
  const [dateBirthday, setDateBirthday] = useState(today);
  const [job, setJob] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [gitLink, setGitLink] = useState('');
  const [compagny, setCompany] = useState('');
  const [classe, setClasse] = useState('');
  const [programmationLanguage, setProgrammationLanguage] = useState('');
  const [discordName, setDiscordName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const mustClass = ["L1 TP", "L1 ALT", "L2", "L3"];
  const mustLanguage = ["PHP", "Java", "Ruby", "Javascript", "Python"];
  const mustJob = ["Intégrateur", "Back-End", "Front-end", "FullStack"];

/// VALIDATION && REGEX FORM
const MIN_AGE = 16;
const PHONE_NUMBER_REGEX = /^\d{10}$/;
const GITHUB_LINK_REGEX =
  /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
const DISCORD_REGEX = /^([A-Za-z0-9-_]{2,32})#([A-Za-z0-9-_]{4,5})$/;
const LINKEDIN_REGEX = /^https:\/\/www.linkedin.com\/in\/[a-zA-Z0-9_-]+\/?$/

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
  });

  const userUid = localStorage.getItem("userUid");

  useEffect(() => {

    if (isSubmitSuccessful) {
      reset({
        dateBirthday: "",
        job: "",
        linkedin: "",
        gitLink: "",
        compagny: "",
        classe: "",
        programmationLanguage: "",
        discordName: "",
        phoneNumber: "",
      });
    }
  }, [formState, isSubmitSuccessful, reset]);

  const getUser = async (userId) =>{
    try {
      const res = await axios.get(`http://localhost:5050/profile/getUser/${userId}`);
      setUser(res.data);
      console.log(res.data);
      setLoading(false);
      // const res = await axios.get(`http://localhost:5050/profile/users`);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // getUser(userUid);
    // getUser();
    
  }, []);

  const sendData = async (data, userId) => {
    console.log(data);
    const formData = {
      dateBirthday: data.dateBirthday,
      job: data.job,
      linkedin: data.linkedin,
      gitLink: data.gitLink,
      compagny: data.compagny,
      classe: data.classe,
      programmationLanguage: data.programmationLanguage,
      discordName: data.discordName,
      phoneNumber: data.phoneNumber,
    };
    console.log(formData);
    axios.put(`http://localhost:5050/profile/${userId}/editUser/` ,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
    // {
    //   dateBirthday: dateBirthday,
    //   job: job,
    //   linkedin: linkedin,
    //   gitLink: gitLink,
    //   compagny: compagny,
    //   classe: classe,
    //   programmationLanguage: programmationLanguage,
    //   discordName: discordName,
    //   phoneNumber: phoneNumber,
    // }
    );
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name + value);
    switch (name) {
      case "job":
        setJob(value);
        break;
      case "linkedin":
        setLinkedin(value);
        break;
      case "gitLink":
        setGitLink(value);
        break;
      case "linkedin":
        setLinkedin(value);
        break;
      case "compagny":
        setCompany(value);
        break;
      case "classe":
        setClasse(value);
        break;
      case "programmationLanguage":
        setProgrammationLanguage(value);
        break;
      case "discordName":
        setDiscordName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const handleOnChange = async (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
      const base64 = await convertToBase64(newImage);
      setPictureToUpload(base64);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Container>
          <Skeleton variant="h3" height={50} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              mt: 3,
            }}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(sendData)}
          >
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ borderRadius: 1, mb: 2 }}
            />
            <Grid container spacing={2}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Skeleton variant="text" height={40} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      ) : (
        <>
          <Typography variant="h3">Mise à jour du profil</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              mt: 3,
            }}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit((data)=>(sendData(userUid)))}
          >
            {isSubmitSuccessful && (
              <Alert severity="success">
                Vos modifications ont été enregrister avec succés
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: " center",
                  }}
                >
                  {image && (
                    <IconButton
                      color="indefined"
                      aria-label="upload picture"
                      component="label"
                    >
                      <input
                        hidden
                        type="file"
                        onChange={handleOnChange}
                        name="image"
                        accept="image/png,image/jpeg"
                      />
                      <Avatar
                        src={image}
                        style={{
                          width: "160px",
                          height: "160px",
                        }}
                      />
                    </IconButton>
                  )}
                  {!image && (
                    <IconButton
                      color="indefined"
                      aria-label="upload picture"
                      component="label"
                    >
                      <input
                        hidden
                        {...register("image", {
                          validate: {
                            lessThan10MB: (file) =>
                              file[0]?.size < 10000000 || "Max 10MB",
                          },
                        })}
                        type="file"
                        onChange={handleOnChange}
                        name="image"
                        accept="image/png,image/jpeg"
                      />
                      <Avatar
                        src={image}
                        style={{
                          width: "160px",
                          height: "160px",
                        }}
                      />
                    </IconButton>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {errors.image && (
                    <Typography
                      variant="subtitle1"
                      color="error"
                      align="center"
                    >
                      {"Choisissez une photo"}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="label_date_birthday">
                  Date de naissance *
                </InputLabel>
                <TextField
                  id="date"
                  type="date"
                  name="dateBirthday"
                  value={dateBirthday}
                  onChange={handleChange}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("dateBirthday", {
                    required: "",
                    validate: (value) => {
                      if (!value) {
                        return "La date de naissance ne peut pas être vide";
                      }

                      const dateOfBirth = new Date(value);

                      if (isNaN(dateOfBirth.getTime())) {
                        return "Votre date de naissance n'est pas valide";
                      }

                      const currentDate = new Date();
                      const age =
                        currentDate.getFullYear() - dateOfBirth.getFullYear();
                      const monthDiff =
                        currentDate.getMonth() - dateOfBirth.getMonth();

                      if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                          currentDate.getDate() < dateOfBirth.getDate())
                      ) {
                        age--;
                      }

                      if (age < MIN_AGE) {
                        return `Vous devez avoir au moins ${MIN_AGE} ans pour vous inscrire`;
                      }

                      return true;
                    },
                  })}
                />
                {errors.dateBirthday && (
                  <Typography variant="subtitle1" color="error">
                    {errors.dateBirthday.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="phonenumber"> Numéro de téléphone </InputLabel>
                <Input
                  id="phone-number"
                  aria-describedby="phoneNumber"
                  type="number"
                  name="phoneNumber"
                  onChange={handleChange}
                  value={phoneNumber}
                  {...register("phoneNumber", {
                    required: "",
                    pattern: {
                      value: PHONE_NUMBER_REGEX,
                      message: "Le format du numéro de téléphone est incorrect",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <Typography variant="subtitle1" color="error">
                    {errors.phoneNumber.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="select-class">Classe</InputLabel>
                <Select
                  name="classe"
                  id="class"
                  value={classe}
                  onChange={handleChange}
                  sx={{ width: 320 }}
                >
                  {mustClass.map((index) => (
                    <MenuItem key={index} value={index}>
                      {index}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="select-language">
                  Langage de Programmation Favori{" "}
                </InputLabel>
                <Select
                  name="ProgrammationLanguage"
                  id="language"
                  value={programmationLanguage}
                  onChange={handleChange}
                  sx={{ width: 320 }}
                >
                  {mustLanguage.map((index) => (
                    <MenuItem key={index} value={index}>
                      {index}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="github-link"> Lien GitHub </InputLabel>
                <Input
                  id="github-link"
                  type="text"
                  name="gitLink"
                  onChange={handleChange}
                  value={gitLink}
                  {...register("gitLink", {
                    pattern: {
                      value: GITHUB_LINK_REGEX,
                      message: "Le format du lien GitHub est incorrect",
                    },
                  })}
                />
                {errors.gitLink && (
                  <Typography variant="subtitle1" color="error">
                    {errors.gitLink.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="discord-name"> Discord </InputLabel>
                <Input
                  id="discord-name"
                  aria-describedby="discordName"
                  onChange={handleChange}
                  value={discordName}
                  {...register("discordName", {
                    pattern: {
                      value: DISCORD_REGEX,
                      message: "Le format du profil Discord est incorrect",
                    },
                  })}
                  type="text"
                  name="discordName"
                />
                {errors.discordName && (
                  <Typography variant="subtitle1" color="error">
                    {errors.discordName.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="discordLinkedin"> Linkedin </InputLabel>
                <Input
                  id="linkedin-name"
                  aria-describedby="linkedin"
                  onChange={handleChange}
                  value={linkedin}
                  {...register("linkedin", {
                    pattern: {
                      value: LINKEDIN_REGEX,
                      message: "Le format du lien Linkendin est incorrect",
                    },
                  })}
                  type="text"
                  name="linkedin"
                />
                {errors.linkedin && (
                  <Typography variant="subtitle1" color="error">
                    {errors.linkedin.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="select-language">Nom Entreprise </InputLabel>
                <Input
                  id="compagny-name"
                  aria-describedby="CompagnyName"
                  name="compagny"
                  onChange={handleChange}
                  value={compagny}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="select-language">Poste Pourvu </InputLabel>
                <Select
                  id="job"
                  value={job}
                  onChange={handleChange}
                  sx={{ width: 220 }}
                  name="job"
                >
                  {mustJob.map((index) => (
                    <MenuItem key={index} value={index}>
                      {index}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Mettre à jour
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
}
