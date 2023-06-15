import React, { useRef, useState } from 'react';
import "../agile/agile.css";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as yup from "yup";
import ElevatorPitch from '../../components/agile/ElevatorPitch';
import { toast } from 'react-hot-toast';

const steps = [
  {
    label: "Pour",
    fields: ['forWho']
  },
  {
    label: "Qui a besoin de",
    fields: ['needed']
  },
  {
    label: "Le produit",
    fields: ['name', 'type']
  },
  {
    label: "Qui",
    fields: ['who']
  },
  {
    label: "A la différence de",
    fields: ['difference']
  }
];

const schema = yup.object().shape({
  name: yup.string().required("Veuillez remplir ce champ"),
  forWho: yup.string().required("Veuillez remplir ce champ"),
  needed: yup.string().required("Veuillez remplir ce champ"),
  type: yup.string().required("Veuillez remplir ce champ"),
  who: yup.string().required("Veuillez remplir ce champ"),
  difference: yup.string().required("Veuillez remplir ce champ"),
})

export default function ElevatorPitchPage({dashboardId}) {

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    forWho: "",
    needed: "",
    type: "",
    who: "",
    difference: "",
  });

  const handleNext = async () => {
    try{
      const currentStep = steps[activeStep];
      const stepSchema = yup.object().shape(
        currentStep.fields.reduce((acc, field) => {
          acc[field] = schema.fields[field];
          return acc;
        }, {})
      );
        
      await stepSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      setActiveStep((prevStep) => prevStep + 1);
      if(activeStep + 1 === 5){
        setActiveStep(4);
      }
    }catch(error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Box sx={{ width: '100%', paddingLeft: 10, paddingRight: 10}}>
      <h1>Elevator Pitch</h1>
      <ElevatorPitch dashboardId={dashboardId}/>
    </Box>
  )
}
