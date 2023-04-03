import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  InputLabel,
  Input,
  Button,
  IconButton,
  Avatar,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
export default function ProfilFormStudent({ onClose, user }) {
  const [image, setImage] = useState(user.imageprofil);
  const [pictureToUpload, setPictureToUpload] = useState(null);
  const [dateBirthday, setDateBirthday] = useState(user.dateBirthday);
  const [job, setJob] = useState(user.job);
  const [linkedin, setLinkedin] = useState(user.linkedin);
  const [gitLink, setGitLink] = useState(user.git);
  const [company, setCompany] = useState(user.company);
  const [classe, setClasse] = useState(user.class);
  const [programmationLanguage, setProgrammationLanguage] = useState(
    user.programmationLanguage
  );
  const [discordName, setDiscordName] = useState(user.discord);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const mustClass = ["L1-Alt-cergy", "L1-Alt-paris", "L2", "L3"];

  /// VALIDATION && REGEX FORM
  const PHONE_NUMBER_REGEX = /^\d{10}$/;
  const GITHUB_LINK_REGEX =
    /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+$/;

  const LINKEDIN_REGEX = /^https:\/\/www.linkedin.com\/in\/[a-zA-Z0-9_-]+\/?$/;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
  });

  const userUid = localStorage.getItem("userUid");

  const sendData = async (data) => {
    console.log(phoneNumber);
    const formData = new FormData();
    // formData.append("dateBirthday", data.dateBirthday);
    // formData.append("job", data.job);
    // formData.append("linkedin", data.linkedin);
    // formData.append("gitLink", data.gitLink);
    // formData.append("compagny", data.compagny);
    // formData.append("classe", data.classe);
    // formData.append("programmationLanguage", data.programmationLanguage);
    // formData.append("discordName", data.discordName);
    // formData.append("phoneNumber", data.phoneNumber);
    // formData.append("image", pictureToUpload);

    try {
      const response = await axios.put(
        `http://localhost:5050/profile/${userUid}/editUser/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
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

  const handleOnChange = async (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
      const base64 = await convertToBase64(newImage);
      setPictureToUpload(base64);
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
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(() => sendData())}
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
                <Typography variant="subtitle1" color="error" align="center">
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
              onChange={(e) => setDateBirthday(e.target.value)}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              {...register("dateBirthday", {
                required: true, // Change required to true
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
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              {...register("phoneNumber", {
                pattern: {
                  value: PHONE_NUMBER_REGEX,
                  message: "Le format du numéro  est incorrecte",
                },
              })}
            />

            {errors.phoneNumber && (
              <Typography variant="subtitle1" color="error">
                {errors.phoneNumber.message}
              </Typography>
            )}
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <InputLabel id="select-class">Classe</InputLabel>
            <Select
              name="classe"
              id="class"
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              sx={{ width: 320 }}
            >
              {mustClass.map((index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              ))}
            </Select>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <InputLabel id="select-language">
              Langage de Programmation Favori{" "}
            </InputLabel>
            <Input
              id="ProgrammationLanguage-name"
              aria-describedby="ProgrammationLanguage"
              name="ProgrammationLanguage"
              onChange={(e) => setProgrammationLanguage(e.target.value)}
              value={programmationLanguage}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel id="github-link"> Lien GitHub </InputLabel>
            <Input
              id="github-link"
              type="text"
              name="gitLink"
              onChange={(e) => setGitLink(e.target.value)}
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
              onChange={(e) => setDiscordName(e.target.value)}
              value={discordName}
              {...register("discordName")}
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
            <InputLabel id="linkedin-name"> Linkedin </InputLabel>
            <Input
              id="linkedin-name"
              aria-describedby="linkedin"
              onChange={(e) => setLinkedin(e.target.value)}
              value={linkedin}
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
            <InputLabel id="compagny-name">Nom Entreprise </InputLabel>
            <Input
              id="compagny-name"
              aria-describedby="CompagnyName"
              name="company"
              onChange={(e) => setCompany(e.target.value)}
              value={company}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel id="select-language">Poste Pourvu </InputLabel>
            <Input
              id="job"
              aria-describedby="job"
              name="job"
              onChange={(e) => setJob(e.target.value)}
              value={job}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row ",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Mettre à jour
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 3, mb: 2 }}
                type="button"
                onClick={onClose}
              >
                Annuler
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
