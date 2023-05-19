import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
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

const PersonaBuilder = () => {
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
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
      const persona = {
        firstName: name.first,
        lastName: name.last,
        picture: picture.large,
        gender,
        email,
        age: dob.age,
        city: location.city,
        country: location.country,
        bio: "",
        objectives: "",
        frustrations: "",
        needs: "",
      };
      console.log(persona);
      setPersona(persona);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching personas:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPersona((prevPersona) => ({
      ...prevPersona,
      //   name: {
      //     ...prevPersona.name,
      //     [field]: value,
      //   },
    }));
  };

  const savePersona = (data) => {
    console.log("Persona sauvegardé :", data);
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
          {persona && (
            <form onSubmit={handleSubmit(savePersona)}>
              <div>
                <Typography variant="h2">
                  {persona.firstName} {persona.lastName}
                </Typography>
                <img src={persona.picture} alt="Avatar" />
                <Typography variant="body1">Sexe: {persona.gender}</Typography>
                <Typography variant="body1">Email: {persona.email}</Typography>
                <Typography variant="body1">Age: {persona.age}</Typography>
                <Typography variant="body1">
                  Ville: {`${persona.city}, ${persona.country}`}
                </Typography>
                <Typography variant="body1">Bio: {persona.bio}</Typography>
                <Typography variant="body1">
                  Frustrations: {persona.frustrations}
                </Typography>
                <Typography variant="body1">
                  Objectifs: {persona.objectives}
                </Typography>
                <Typography variant="body1">
                  Besoins: {persona.needs}
                </Typography>
              </div>
              <div style={{ marginTop: 40 }}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue={persona.firstName}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Prénom"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue={persona.lastName}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nom"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue={persona.email}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="age"
                  control={control}
                  defaultValue={persona.age}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Âge"
                      type="number"
                      error={!!errors.age}
                      helperText={errors.age?.message}
                    />
                  )}
                />
                <Controller
                  name="city"
                  control={control}
                  defaultValue={persona.city}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Ville"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  defaultValue={persona.country}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Pays"
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
                  )}
                />
                <Controller
                  name="bio"
                  control={control}
                  defaultValue={persona.bio}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Bio"
                      error={!!errors.bio}
                      helperText={errors.bio?.message}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                  )}
                />
                <Controller
                  name="objectives"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Objectifs"
                      error={!!errors.objectives}
                      helperText={errors.objectives?.message}
                    />
                  )}
                />
                <Controller
                  name="frustrations"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Frustrations"
                      error={!!errors.frustrations}
                      helperText={errors.frustrations?.message}
                    />
                  )}
                />
                <Controller
                  name="needs"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Besoins"
                      error={!!errors.needs}
                      helperText={errors.needs?.message}
                    />
                  )}
                />
              </div>
              <Button type="submit" variant="contained">
                Sauvegarder
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default PersonaBuilder;
