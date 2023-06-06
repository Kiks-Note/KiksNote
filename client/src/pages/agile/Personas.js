import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  TextareaAutosize,
  Grid,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CardPersona from "../../components/agile/CardPersona";

const schema = yup.object().shape({
  gender: yup
    .string()
    .oneOf(["Masculin", "Féminin"])
    .required("Veuillez sélectionner un genre"),
  firstName: yup.string().required("Votre persona a besoin d'un prénom"),
  lastName: yup.string().required("Votre persona a besoin d'un nom"),
  email: yup
    .string()
    .email("Email invalide")
    .required("Votre persona a besoin d'une adresse mail"),
  age: yup.number().integer().required("Votre persona a besoin d'un âge"),
  city: yup
    .string()
    .required("Votre persona a besoin d'une ville de résidence"),
  country: yup.string().required("Votre persona a besoin d'un pays"),
  bio: yup.string().required("Votre persona a besoin d'une bio"),
  objectives: yup.string().required("Votre persona a besoin d'objectifs"),
  frustrations: yup.string().required("Votre persona a besoin de frustrations"),
  needs: yup
    .string()
    .required("Votre persona a besoin de spécifier des besoins"),
});

export default function PersonaBuilder() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://randomuser.me/api/?results=1");
      const data = await response.json();
      const { name, picture, gender, email, dob, location } = data.results[0];
      const defineSexe = gender === "male" ? "Masculin" : "Féminin";
      const newFormData = {
        firstName: name.first,
        lastName: name.last,
        picture: picture.large,
        gender: defineSexe,
        email,
        age: dob.age,
        city: location.city,
        country: location.country,
        bio: "",
        objectives: "",
        frustrations: "",
        needs: "",
      };
      reset();
      setFormData(newFormData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching personas:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const savePersona = (data) => {
    console.log("Persona à sauvegarder :", data);
  };

  return (
    <div>
      <Typography variant="h1">Persona Builder</Typography>
      {loading ? (
        <Typography variant="body1">Loading persona...</Typography>
      ) : (
        <>
          <Button variant="contained" onClick={fetchPersonas}>
            Générer un persona
          </Button>
          {formData && (
            <>
              <CardPersona info={formData} />
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                component="form"
                encType="multipart/form-data"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(savePersona)}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <InputLabel id="gender-label">Sexe</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender-select"
                      value={formData.gender}
                      name="gender"
                      label="Sexe"
                      {...register("gender")} // Enregistrer le champ avec react-hook-form
                      error={!!errors.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    >
                      <MenuItem value="Masculin">Masculin</MenuItem>
                      <MenuItem value="Féminin">Féminin</MenuItem>
                    </Select>
                    {errors.gender && (
                      <Typography variant="body2" color="error">
                        {errors.gender.message}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Prénom"
                      name="firstName"
                      {...register("firstName")}
                      defaultValue={formData.firstName}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Nom"
                      name="lastName"
                      {...register("lastName")}
                      defaultValue={formData.lastName}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Email"
                      name="email"
                      {...register("email")}
                      defaultValue={formData.email}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Âge"
                      name="age"
                      {...register("age")}
                      type="number"
                      defaultValue={formData.age}
                      error={!!errors.age}
                      helperText={errors.age?.message}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Ville"
                      name="city"
                      {...register("city")}
                      defaultValue={formData.city}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Pays"
                      name="country"
                      {...register("country")}
                      defaultValue={formData.country}
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel id="bio">Bio *</InputLabel>
                    <TextareaAutosize
                      name="bio"
                      {...register("bio")}
                      minRows={2}
                      maxRows={4}
                      defaultValue={formData.bio}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: errors.bio ? "1px solid red" : "1px solid",
                        borderRadius: "10px",
                      }}
                      onChange={(e) => {
                        handleInputChange("bio", e.target.value);
                        clearErrors("bio"); // Efface les erreurs lors de la modification du champ
                      }}
                    />
                    {errors.bio && (
                      <span style={{ color: "red" }}>{errors.bio.message}</span>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel id="objectives">Objectifs *</InputLabel>
                    <TextareaAutosize
                      name="objectives"
                      {...register("objectives")}
                      minRows={2}
                      maxRows={4}
                      defaultValue={formData.objectives}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: errors.objectives
                          ? "1px solid red"
                          : "1px solid",
                        borderRadius: "10px",
                      }}
                      onChange={(e) => {
                        handleInputChange("objectives", e.target.value);
                        clearErrors("objectives"); // Efface les erreurs lors de la modification du champ
                      }}
                    />
                    {errors.objectives && (
                      <span style={{ color: "red" }}>
                        {errors.objectives.message}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel id="frustrations">Frustrations *</InputLabel>
                    <TextareaAutosize
                      name="frustrations"
                      {...register("frustrations")}
                      minRows={2}
                      maxRows={4}
                      defaultValue={formData.frustrations}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: errors.frustrations
                          ? "1px solid red"
                          : "1px solid",
                        borderRadius: "10px",
                      }}
                      onChange={(e) => {
                        handleInputChange("frustrations", e.target.value);
                        clearErrors("frustrations");
                      }}
                    />
                    {errors.frustrations && (
                      <span style={{ color: "red" }}>
                        {errors.frustrations.message}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel id="besoins">Besoins *</InputLabel>
                    <TextareaAutosize
                      name="needs"
                      {...register("needs")}
                      minRows={2}
                      maxRows={4}
                      defaultValue={formData.needs}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: errors.needs ? "1px solid red" : "1px solid",
                        borderRadius: "10px",
                      }}
                      onChange={(e) => {
                        handleInputChange("needs", e.target.value);
                        clearErrors("needs");
                      }}
                    />
                    {errors.needs && (
                      <span style={{ color: "red" }}>
                        {errors.needs.message}
                      </span>
                    )}
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
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Sauvegarder
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </>
      )}
    </div>
  );
};

