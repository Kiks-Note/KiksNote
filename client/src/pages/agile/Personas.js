import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Avatar,
} from "@mui/material";
import CardPersona from "../../components/agile/CardPersona";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Rings } from "react-loader-spinner";
import "./personas.css";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepIcon from "../../components/agile/StepIcon";

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
  firstName: yup.string().required("Le prénom est requis"),
  lastName: yup.string().required("Le nom est requis"),
  email: yup
    .string()
    .email("Email invalide")
    .required("Votre persona a besoin d'une adresse mail"),
  avatar: yup.string().required("L'avatar est requis"),
  age: yup
    .number()
    .required("L'âge est requis")
    .min(0, "L'âge doit être supérieur ou égal à 0"),
  adresse: yup.string().required("L'adresse est requise"),
  city: yup.string().required("La ville est requise"),
  country: yup.string().required("Votre persona a besoin d'un pays"),
  intitulePoste: yup.string().required("L'intitulé du poste est requis"),
  objectives: yup.string().required("Les objectifs sont requis"),
  frustrations: yup.string().required("Les frustrations sont requises"),
  responsabilites: yup.string().required("Les responsabilités sont requises"),
  interets: yup
    .string()
    .required("Les centres d’intérêts et passions sont requis"),
  bio: yup.string().required("Votre persona a besoin d'une bio"),
  needs: yup
    .string()
    .required("Votre persona a besoin de spécifier des besoins"),
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
const PersonaForm = () => {
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
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log("Persona à sauvegarder :", formData);
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
          <div>
            <TextField
              placeholder="Entrez un prénom"
              variant="standard"
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
              variant="standard"
            />
            <TextField
              placeholder="Entrez un email"
              value={formData.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              error={Boolean(errors?.email)}
              helperText={errors?.email}
              variant="standard"
            />
            <TextField
              label="Age"
              value={formData.age || 0}
              type="number"
              onChange={(e) => handleFieldChange("age", e.target.value)}
              error={Boolean(errors?.age)}
              helperText={errors?.age}
            />
            <Typography>Sélectionnez un avatar:</Typography>
            <div className="grid-container">
              {avatars.map((avatar) => (
                <Avatar
                  sx={{ height: 100, width: 100 }}
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
          <div>
            <TextField
              variant="standard"
              placeholder="Entrez un adresse"
              value={formData.adresse || ""}
              onChange={(e) => handleFieldChange("adresse", e.target.value)}
              error={Boolean(errors?.adresse)}
              helperText={errors?.adresse}
            />
            <TextField
              variant="standard"
              placeholder="Entrez une ville"
              value={formData.city || ""}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              error={Boolean(errors?.city)}
              helperText={errors?.city}
            />
            <TextField
              variant="standard"
              placeholder="Entrez un pays"
              value={formData.country || ""}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              error={Boolean(errors?.country)}
              helperText={errors?.country}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <TextField
              variant="standard"
              placeholder="Entrez l'intitulé du poste"
              value={formData.intitulePoste || ""}
              onChange={(e) =>
                handleFieldChange("intitulePoste", e.target.value)
              }
              error={Boolean(errors?.intitulePoste)}
              helperText={errors?.intitulePoste}
            />
            <TextField
              variant="standard"
              placeholder="Entrez les responsabilités"
              value={formData.responsabilites || ""}
              onChange={(e) =>
                handleFieldChange("responsabilites", e.target.value)
              }
              error={Boolean(errors?.responsabilites)}
              helperText={errors?.responsabilites}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <TextField
              variant="standard"
              placeholder="Entrez les objectifs"
              value={formData.objectives || ""}
              onChange={(e) => handleFieldChange("objectives", e.target.value)}
              error={Boolean(errors?.objectives)}
              helperText={errors?.objectives}
            />
            <TextField
              variant="standard"
              placeholder="Entrez les frustations"
              value={formData.frustrations || ""}
              onChange={(e) =>
                handleFieldChange("frustrations", e.target.value)
              }
              error={Boolean(errors?.frustrations)}
              helperText={errors?.frustrations}
            />
            <TextField
              variant="standard"
              placeholder="Entrez les besoins qu'éprouve votre persona"
              value={formData.needs || ""}
              onChange={(e) => handleFieldChange("needs", e.target.value)}
              error={Boolean(errors?.needs)}
              helperText={errors?.needs}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <TextField
              variant="standard"
              placeholder="Entrez les centres d'intérêts et passions"
              value={formData.interets || ""}
              onChange={(e) => handleFieldChange("interets", e.target.value)}
              error={Boolean(errors?.interets)}
              helperText={errors?.interets}
            />
            <TextField
              variant="standard"
              placeholder="Entrez une petite description"
              value={formData.bio || ""}
              onChange={(e) => handleFieldChange("bio", e.target.value)}
              error={Boolean(errors?.bio)}
              helperText={errors?.bio}
            />
          </div>
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
        <>
          <div className="container-step-form">
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorlibConnector />}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={StepIcon}>
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep < steps.length ? (
              <div className="description-step">
                <Typography variant="h6">
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

            {activeStep === steps.length ? (
              <div>
                <Typography variant="h5">Récapitulatif :</Typography>
                <CardPersona info={formData} />
                <Button
                  onClick={() => {
                    setActiveStep(0);
                    setFormData({});
                    setSelectedAvatar("");
                  }}
                >
                  Nouveau formulaire
                </Button>
              </div>
            ) : (
              <div>
                {renderStepContent(activeStep)}
                <div className="">
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Retour
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button variant="contained" onClick={savePersona}>
                      Terminer
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNext}>
                      "Suivant"
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonaForm;
