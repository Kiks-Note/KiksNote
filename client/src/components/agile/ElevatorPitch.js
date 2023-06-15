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
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import { Rings } from "react-loader-spinner";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepIcon from "./StepIcon";
import { addElevatorPitch } from './agile';
import { w3cwebsocket } from "websocket";
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
    label: "A la différence de",
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
export default function ElevatorPitch({dashboardId}) {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  const savePersona = () => {
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

  const getElevatorPitch = async () =>{
    const wsComments = new w3cwebsocket(`ws://localhost:5050/elevator`);
        wsComments.onopen = () => {
            console.log("Connected to server");
            console.log(dashboardId);
            wsComments.send(JSON.stringify({ dashboardId: dashboardId }));
        };
        wsComments.onmessage = (message) => {
            const data = JSON.parse(message.data);
            console.log(data);
            setLoading(false);
        }
    };

    useEffect(()=>{
        getElevatorPitch();
    },[]);
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
                
              <div className='clickable_div'>
                <div>
                    <h2>Pour ?</h2>
                    <p>Type visé*</p>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Pour</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            label="pour"
                            onChange={(e) => handleFieldChange("forWho", e.target.value)}
                            value={formData.forWho || ""}
                            error={Boolean(errors?.forWho)}
                            required
                        >
                            <MenuItem value="Client">Client</MenuItem>
                            <MenuItem value="Utilisateur">Utilisateur</MenuItem>
                            <MenuItem value="Marché">Marché</MenuItem>
                        </Select>
                    </FormControl>
                </div>
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
            <div className='clickable_div'>
                <div>
                    <h2>Qui a besoin de</h2>
                    <p>Services à rendre, problèmes à régler*</p>
                    <form>
                        <TextField
                            id="outlined-basic"
                            label="Besoin de"
                            variant="outlined"
                            multiline
                            required
                            maxRows={4}
                            onChange={(e) => handleFieldChange("needed", e.target.value)}
                            value={formData.needed || ""}
                            error={Boolean(errors?.needed)}
                        />
                    </form>
                </div>
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
            <div className='clickable_div'>
                <div>
                    <h2>Le produit</h2>
                    <p>Nom*</p>
                    <form>
                        <TextField
                            id="outlined-basic"
                            label="Prénom"
                            variant="outlined"
                            value={formData.name || ""}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                        />
                        <h2>Type du produit 💻</h2>
                        <p>Application, site web, etc*</p>
                        <TextField
                            id="outlined-basic"
                            label="Type"
                            variant="outlined"
                            multiline
                            maxRows={4}
                            onChange={(e) => handleFieldChange("type", e.target.value)}
                            value={formData.type || ""}
                            error={Boolean(errors?.type)}
                        />
                    </form>
                </div>
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
            <div className='clickable_div'>
                <div>
                    <h2>Qui ?</h2>
                    <p>bénéfices, utilité, raisons pour acheter*</p>
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
            <div className='clickable_div'>
                <div>
                    <h2>A la différence de</h2>
                    <p>alternative de la concurrence*</p>
                    <form>
                        <TextField
                            id="outlined-basic"
                            label="Différence"
                            variant="outlined"
                            multiline
                            maxRows={4}
                            onChange={(e) => handleFieldChange("difference", e.target.value)}
                            value={formData.difference || ""}
                            error={Boolean(errors?.difference)}
                        />
                    </form>
                </div>
            </div>
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

