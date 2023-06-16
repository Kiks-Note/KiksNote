import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepIcon from "./StepIcon";
import { addElevatorPitch } from "./agile";

import Select, { SelectChangeEvent } from "@mui/material/Select";

const steps = [
  {
    label: "Pour ",
    fields: ["forWho"],
  },
  {
    label: "Qui a besoin de",
    fields: ["needed"],
  },
  {
    label: "Le produit",
    fields: ["name", "type"],
  },
  {
    label: "Qui",
    fields: ["who"],
  },
  {
    label: " A la différence de",
    fields: ["alternative"],
  },
  {
    label: "Le produit permet",
    fields: ["difference"],
  },
];

const schema = yup.object().shape({
  name: yup.string().required("Veuillez remplir ce champ"),
  forWho: yup.string().required("Veuillez remplir ce champ"),
  needed: yup.string().required("Veuillez remplir ce champ"),
  type: yup.string().required("Veuillez remplir ce champ"),
  who: yup.string().required("Veuillez remplir ce champ"),
  difference: yup.string().required("Veuillez remplir ce champ"),
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
export default function ElevatorPitch({ dashboardId }) {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  const savePersona = () => {
    console.log(formData);
    addElevatorPitch(dashboardId, formData);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

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
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Pour</InputLabel>
                  <Select
                    label="Type visé"
                    onChange={(e) =>
                      handleFieldChange("forWho", e.target.value)
                    }
                    value={formData.forWho || ""}
                    error={Boolean(errors?.forWho)}
                  >
                    <MenuItem value="Client">Client</MenuItem>
                    <MenuItem value="Utilisateur">Utilisateur</MenuItem>
                    <MenuItem value="Marché">Marché</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Box>
          </div>
        );
      case 1:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <div>
              <form>
                <TextField
                  id="outlined-basic"
                  label="Qui a besoin de"
                  variant="outlined"
                  placeholder="Services à rendre, problèmes à régler"
                  multiline
                  required
                  maxRows={4}
                  onChange={(e) => handleFieldChange("needed", e.target.value)}
                  value={formData.needed || ""}
                  error={Boolean(errors?.needed)}
                />
              </form>
            </div>
          </Box>
        );
      case 2:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <div>
              <form>
                <h2>Nom du produit 💻</h2>
                <TextField
                  id="outlined-basic"
                  label="Nom du produit"
                  variant="outlined"
                  value={formData.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
                <h2>Type du produit 💻</h2>
                <TextField
                  id="outlined-basic"
                  label="Type"
                  variant="outlined"
                  placeholder="Application, site web, etc"
                  multiline
                  maxRows={4}
                  onChange={(e) => handleFieldChange("type", e.target.value)}
                  value={formData.type || ""}
                  error={Boolean(errors?.type)}
                />
              </form>
            </div>
          </Box>
        );
      case 3:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <div>
              <h2>Bénéfices, utilité, raisons pour acheter</h2>
              <form>
                <TextField
                  id="outlined-basic"
                  label="Qui"
                  variant="outlined"
                  multiline
                  maxRows={4}
                  onChange={(e) => handleFieldChange("who", e.target.value)}
                  value={formData.who || ""}
                  error={Boolean(errors?.setWho)}
                />
              </form>
            </div>
          </Box>
        );
      case 4:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <div>
              <form>
                <TextField
                  id="outlined-basic"
                  label="La difference"
                  variant="outlined"
                  multiline
                  maxRows={4}
                  onChange={(e) =>
                    handleFieldChange("alternative", e.target.value)
                  }
                  value={formData.alternative || ""}
                  error={Boolean(errors?.alternative)}
                />
              </form>
            </div>
          </Box>
        );
      case 5:
        return (
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
          >
            <div>
              <h2>Le produit permet</h2>
              <form>
                <TextField
                  id="outlined-basic"
                  label="Différence"
                  variant="outlined"
                  multiline
                  maxRows={4}
                  onChange={(e) =>
                    handleFieldChange("difference", e.target.value)
                  }
                  value={formData.difference || ""}
                  error={Boolean(errors?.difference)}
                />
              </form>
            </div>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-all">
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
    </div>
  );
}
