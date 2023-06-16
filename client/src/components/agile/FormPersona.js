import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Avatar,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import { Rings } from "react-loader-spinner";
import axios from "axios";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepIcon from "./StepIcon";
import "./personas.css";

const steps = [
  {
    label: "Aspect personnel ",
    fields: ["firstName", "lastName", "age", "email", "avatar"],
    description:
      "Les données personnelles fournissent des informations de base sur la personne, telles que son prénom, nom et avatar. Ces informations aident à identifier et différencier chaque persona.",
  },
  {
    label: "Aspect démographiques",
    fields: ["adresse", "city", "country"],
    description:
      "Les données démographiques fournissent des informations sur l'âge, l'adresse et la ville de la personne. Ces informations aident à comprendre le contexte socio-géographique du persona.",
  },
  {
    label: "Aspect profesionnel ",
    fields: ["intitulePoste", "responsabilites"],
    description:
      "Les données relatives à la carrière fournissent des informations sur l'intitulé du poste et les responsabilités professionnelles de la personne. Cela permet de mieux comprendre son domaine d'activité et son rôle professionnel.",
  },
  {
    label: "Aspect social",
    fields: ["objectives", "frustrations", "needs"],
    description:
      "Les données sur l'aspect social fournissent des informations sur les objectifs et les frustrations de la personne. Cela aide à saisir ses motivations, ses besoins et les défis auxquels elle est confrontée.",
  },
  {
    label: "Aspect culturel et personnel",
    fields: ["interets", "bio"],
    description:
      "La vie sociale du persona se concentre sur ses centres d'intérêts et ses passions. Cela permet de comprendre ses activités sociales, ses hobbies et ses préférences personnelles.",
  },
];

const schema = yup.object().shape({
  firstName: yup.string().required("Votre persona a besoin d'un prénom"),
  lastName: yup.string().required("Votre persona a besoin d'un nom"),
  email: yup
    .string()
    .email("Email invalide")
    .required("Votre persona a besoin d'une adresse mail valide"),
  avatar: yup.string().required("Votre persona a besoin d'un avatar"),
  age: yup
    .number()
    .required("Votre persona a besoin d'un age")
    .min(0, "L'âge doit être supérieur ou égal à 0"),
  adresse: yup.string().required("Votre persona a besoin d'une adresse"),
  city: yup.string().required("Votre persona a besoin d'une ville"),
  country: yup.string().required("Votre persona a besoin d'un pays"),
  intitulePoste: yup.string().required("Votre persona a besoin d'un poste"),
  objectives: yup.string().required("Votre persona a besoin d'objectifs"),
  frustrations: yup.string().required("Votre persona a besoin de frustrations"),
  responsabilites: yup
    .string()
    .required("Définissez les responsabilités de votre persona"),
  interets: yup
    .string()
    .required("Définissez les centres d’intérêts et passions de votre persona"),
  bio: yup.string().required("Rédigez une courte bio pour le persona "),
  needs: yup
    .string()
    .required("Définissez les besoins dont a besoin votre persona"),
});

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(90deg, rgba(82,253,45,1) 20%,  rgba(34,193,195,1) 70%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "rgba(82,253,45,1)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));
export default function FormPersona({ dashboardId, actorId }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [avatars, setAvatars] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const reset = () => {
    setFormData({});
  };
  const savePersona = () => {
    axios.post(
      "http://localhost:5050/agile/" +
        dashboardId +
        "/persona/" +
        actorId +
        "/create",
      formData
    );
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const generateRandomAvatars = async () => {
    try {
      const response = await fetch(
        "https://randomuser.me/api/?results=20&inc=gender,picture"
      );

      const data = await response.json();
      const results = data.results;

      const avatarsSet = new Set();

      results.forEach((result) => {
        const avatar = result.picture.thumbnail;
        avatarsSet.add(avatar);
      });

      const avatars = Array.from(avatarsSet);

      setAvatars(avatars.slice(0, 9)); // Utiliser les 9 premiers avatars
      setLoading(false);
    } catch (error) {
      console.error("Error fetching avatars:", error);
    }
  };

  useEffect(() => {
    generateRandomAvatars();
  }, []);
  const handleNext = async () => {
    try {
      const currentStep = steps[activeStep];
      const stepSchema = yup.object().shape(
        currentStep.fields.reduce((fieldsSchema, field) => {
          fieldsSchema[field] = schema.fields[field];
          return fieldsSchema;
        }, {})
      );

      await stepSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFieldChange = (field, value) => {
    if (field === "avatar") {
      setSelectedAvatar(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="form_persona_step1">
            <Box
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
            >
              <TextField
                placeholder="Entrez un prénom"
                variant="outlined"
                value={formData.firstName || ""}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                error={Boolean(errors?.firstName)}
                helperText={errors?.firstName}
              />
              <TextField
                placeholder="Entrez un nom"
                value={formData.lastName || ""}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                error={Boolean(errors?.lastName)}
                helperText={errors?.lastName}
                variant="outlined"
              />
              <TextField
                placeholder="Entrez un email"
                value={formData.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                error={Boolean(errors?.email)}
                helperText={errors?.email}
                variant="outlined"
              />
              <TextField
                label="Age"
                value={formData.age || 0}
                type="number"
                onChange={(e) => handleFieldChange("age", e.target.value)}
                error={Boolean(errors?.age)}
                helperText={errors?.age}
              />
            </Box>

            <Typography>Sélectionnez un avatar:</Typography>
            <div className="grid_container_persona">
              {avatars.map((avatar) => (
                <Avatar
                  sx={{ height: 70, width: 70 }}
                  key={avatar}
                  alt="Avatar"
                  src={avatar}
                  className={
                    avatar === selectedAvatar
                      ? "selected-avatar grid-item"
                      : "grid-item"
                  }
                  onClick={() => handleFieldChange("avatar", avatar)}
                />
              ))}
              {errors.avatar && (
                <Typography variant="subtitle1" color="error">
                  {errors?.avatar}
                </Typography>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Entrez une adresse "
              value={formData.adresse || ""}
              onChange={(e) => handleFieldChange("adresse", e.target.value)}
              error={Boolean(errors?.adresse)}
              helperText={errors?.adresse}
            />
            <TextField
              variant="outlined"
              placeholder="Entrez une ville"
              value={formData.city || ""}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              error={Boolean(errors?.city)}
              helperText={errors?.city}
            />
            <TextField
              variant="outlined"
              placeholder="Entrez un pays"
              value={formData.country || ""}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              error={Boolean(errors?.country)}
              helperText={errors?.country}
            />
          </Box>
        );
      case 2:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Entrez l'intitulé du poste"
              value={formData.intitulePoste || ""}
              onChange={(e) =>
                handleFieldChange("intitulePoste", e.target.value)
              }
              error={Boolean(errors?.intitulePoste)}
              helperText={errors?.intitulePoste}
            />
            <TextField
              variant="outlined"
              placeholder="Entrez les responsabilités"
              value={formData.responsabilites || ""}
              onChange={(e) =>
                handleFieldChange("responsabilites", e.target.value)
              }
              error={Boolean(errors?.responsabilites)}
              helperText={errors?.responsabilites}
            />
          </Box>
        );
      case 3:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Entrez les objectifs"
              value={formData.objectives || ""}
              onChange={(e) => handleFieldChange("objectives", e.target.value)}
              error={Boolean(errors?.objectives)}
              helperText={errors?.objectives}
            />
            <TextField
              variant="outlined"
              placeholder="Entrez les frustations"
              value={formData.frustrations || ""}
              onChange={(e) =>
                handleFieldChange("frustrations", e.target.value)
              }
              error={Boolean(errors?.frustrations)}
              helperText={errors?.frustrations}
            />
            <TextField
              variant="outlined"
              placeholder="Entrez les besoins qu'éprouve votre persona"
              value={formData.needs || ""}
              onChange={(e) => handleFieldChange("needs", e.target.value)}
              error={Boolean(errors?.needs)}
              helperText={errors?.needs}
            />
          </Box>
        );
      case 4:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Entrez les centres d'intérêts et passions"
              value={formData.interets || ""}
              onChange={(e) => handleFieldChange("interets", e.target.value)}
              error={Boolean(errors?.interets)}
              helperText={errors?.interets}
            />
            <TextField
              variant="outlined"
              placeholder="Entrez une petite description"
              value={formData.bio || ""}
              onChange={(e) => handleFieldChange("bio", e.target.value)}
              error={Boolean(errors?.bio)}
              helperText={errors?.bio}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-all">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div className="container-step-form">
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ColorlibConnector />}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel StepIconComponent={StepIcon}>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="container_form_persona">
            {activeStep < steps.length ? (
              <div className="description-step">
                <Typography variant="h4">
                  Pourquoi cette étape est-elle importante ?
                </Typography>
                <Typography variant="body1">
                  {activeStep < steps.length
                    ? steps[activeStep].description
                    : ""}
                </Typography>
              </div>
            ) : (
              <></>
            )}

            <div className="form_persona">
              {renderStepContent(activeStep)}
              <div className="form_persona_button">
                {activeStep !== 0 && (
                  <button
                    onClick={handleBack}
                    className="btn_persona_cancel custom-btn"
                  >
                    Retour
                  </button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    className="btn_persona_next custom-btn"
                    onClick={savePersona}
                  >
                    Terminer
                  </Button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="btn_persona_next custom-btn"
                  >
                    Suivant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
