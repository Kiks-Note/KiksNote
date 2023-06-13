import React, { useState } from 'react';
import "../agile/agile.css";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import ElevatorPitch from '../../components/agile/ElevatorPitch';

export default function ElevatorPitchPage() {

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
    if(activeStep + 1 === 5){
      setActiveStep(4);
    }
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const steps = [
    'Pour',
    'Qui a besoin de',
    'Le produit',
    'Qui',
    'A la différence de',
  ];

  return (
    <Box sx={{ width: '100%', paddingLeft: 10, paddingRight: 10}}>
      <h1>Elevator Pitch</h1>
      <ElevatorPitch index={activeStep} />
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
            Step {activeStep + 1}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} sx={{ mr: 1 }}>
              Next
            </Button>
          </Box>
        </React.Fragment>
      </div>
    </Box>
  )
}
