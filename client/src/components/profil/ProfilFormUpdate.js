import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import {
  InputLabel,
  Input,
  Button,
  IconButton,
  Avatar,
  Box,
  Grid,
  Chip,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
function ProfilFormUpdate({onClose, user}) {
  const [image, setImage] = useState(user.image);
  const [pictureToUpload, setPictureToUpload] = useState(null);
  const [dateBirthday, setDateBirthday] = useState(new Date(user.dateBirthday));
  const [job, setJob] = useState(user.job);
  const [linkedin, setLinkedin] = useState(user.linkedin);
  const [gitLink, setGitLink] = useState(user.git);
  const [company, setCompany] = useState(user.company);
  const [description, setDescription] = useState(user.description);
  const [classe, setClasse] = useState(user.class);
  const [programmationLanguage, setProgrammationLanguage] = useState();
  const [programmationLanguages, setProgrammationLanguages] = useState(user.programmationLanguage);

  const [discordName, setDiscordName] = useState(user.discord);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

  /// VALIDATION && REGEX FORM
  const PHONE_NUMBER_REGEX = /^\d{10}$/;
  const GITHUB_LINK_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+$/;

  const LINKEDIN_REGEX = /^https:\/\/www.linkedin.com\/in\/[a-zA-Z0-9_-]+\/?$/;

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm({
    mode: "onTouched",
  });

  const handleDateChange = (event) => {
    console.log(event.target.value);
    setDateBirthday(event.target.value);
  };

  const sendData = async (data) => {
    const formData = new FormData();
    formData.append("dateofbirth", data.dateBirthday);
    formData.append("job", data.job);
    formData.append("linkedin", data.linkedin);
    formData.append("git", data.gitLink);
    formData.append("company", data.company);
    if (user.statut == "etudiant") {
      formData.append("class", data.class);
    }
    formData.append("programmationLanguage", programmationLanguages);
    formData.append("discord", data.discordName);
    formData.append("phone", data.phoneNumber);
    formData.append("image", pictureToUpload);
    formData.append("description", data.description);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_API}/profil/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  const handleButtonClick = () => {
    if (typeof programmationLanguage === "string" && programmationLanguage.trim() !== "") {
      if (
        !programmationLanguages.some(
          (language) => typeof language === "string" && language.toLowerCase() === programmationLanguage.toLowerCase()
        ) &&
        programmationLanguages.length < 5
      ) {
        setProgrammationLanguages([...programmationLanguages, programmationLanguage]);
        setProgrammationLanguage("");
      }
    }
  };

  const handleDelete = (languageToDelete) => {
    setProgrammationLanguages(programmationLanguages.filter((language) => language !== languageToDelete));
  };

  const handleOnChange = async (event) => {
    const newImage = event.target?.files?.[0];
    if (newImage) {
      setImage(URL.createObjectURL(newImage));
      setPictureToUpload(newImage);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
        component="form"
        encType="multipart/form-data"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit((data) => sendData(data))}
      >
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
                <IconButton color="indefined" aria-label="upload picture" component="label">
                  <input hidden type="file" onChange={handleOnChange} name="image" accept="image/png,image/jpeg" />
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
                <IconButton color="indefined" aria-label="upload picture" component="label">
                  <input
                    hidden
                    {...register("image", {
                      validate: {
                        lessThan10MB: (file) => file[0]?.size < 10000000 || "Max 10MB",
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
                <Typography variant="subtitle1" color="error" align="center">
                  {"Choisissez une photo"}
                </Typography>
              )}
            </Box>
          </Grid>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ miWwidth: "50%" }}>
                <Grid item xs={12}>
                  <InputLabel id="description">Description *</InputLabel>
                  <TextareaAutosize
                    id="description"
                    aria-describedby="description"
                    name="description"
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={2}
                    maxRows={4}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "1px solid",
                      borderRadius: "10px",
                    }}
                    {...register("description", {
                      value: description,
                      required: true,
                    })}
                  />
                </Grid>
              </Box>
              <Box>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="phonenumber"> Numéro de téléphone * </InputLabel>
                  <Input
                    id="phonenumber"
                    aria-describedby="phoneNumber"
                    name="phoneNumber"
                    {...register("phoneNumber", {
                      required: true,
                      value: phoneNumber,
                      pattern: {
                        value: PHONE_NUMBER_REGEX,
                        message: "Le format du numéro est incorrect",
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
                  <InputLabel id="ProgrammationLanguage-name">Langage de Programmation Favori</InputLabel>
                  <TextField
                    id="ProgrammationLanguage-name"
                    aria-describedby="ProgrammationLanguage"
                    name="ProgrammationLanguage"
                    value={programmationLanguage}
                    onChange={(e) => setProgrammationLanguage(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!programmationLanguage}
                    onClick={handleButtonClick}
                  >
                    Ajouter
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {programmationLanguages.map((language) => (
                      <Chip
                        key={language}
                        label={language}
                        onDelete={() => handleDelete(language)}
                        style={{ margin: "2px" }}
                      />
                    ))}
                  </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel id="github-link"> Lien GitHub </InputLabel>
                  <Input
                    id="github-link"
                    type="text"
                    name="gitLink"
                    onChange={(e) => setGitLink(e.target.value)}
                    {...register("gitLink", {
                      value: gitLink,
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
                    type="text"
                    name="discordName"
                    aria-describedby="discordName"
                    onChange={(e) => setDiscordName(e.target.value)}
                    {...register("discordName", {
                      value: discordName,
                    })}
                  />
                  {errors.discordName && (
                    <Typography variant="subtitle1" color="error">
                      {errors.discordName.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="linkedin-name"> Linkedin </InputLabel>
                  <Input
                    id="linkedin-name"
                    aria-describedby="linkedin"
                    onChange={(e) => setLinkedin(e.target.value)}
                    type="text"
                    name="linkedin"
                    {...register("linkedin", {
                      value: linkedin,
                      pattern: {
                        value: LINKEDIN_REGEX,
                        message: "Le format du lien linkedin est incorrect",
                      },
                    })}
                  />
                  {errors.linkedin && (
                    <Typography variant="subtitle1" color="error">
                      {errors.linkedin.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="compagny-name">Nom Entreprise </InputLabel>
                  <Input
                    id="compagny-name"
                    aria-describedby="CompagnyName"
                    name="company"
                    onChange={(e) => setCompany(e.target.value)}
                    {...register("company", {
                      value: company,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="job">Poste Pourvu </InputLabel>
                  <Input
                    id="job"
                    aria-describedby="job"
                    name="job"
                    onChange={(e) => setJob(e.target.value)}
                    {...register("job", {
                      value: job,
                    })}
                  />
                </Grid>
              </Box>
            </Box>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row ",
                  justifyContent: "space-evenly",
                }}
              >
                <Button variant="contained" color="success" type="submit" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
                  Mettre à jour
                </Button>
                <Button variant="contained" color="error" sx={{ mt: 3, mb: 2 }} type="button" onClick={onClose}>
                  Annuler
                </Button>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
export default ProfilFormUpdate;
