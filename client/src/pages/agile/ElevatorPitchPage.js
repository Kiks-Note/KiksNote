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
  const [isClicked, setIsClicked] = React.useState(false);
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const clicked = () =>{
    setIsClicked(true);
  }
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    if(activeStep - 1 === 0){
      setIsClicked(false);
    }
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const steps = [
    'Nom et Description du projet',
    'Create an ad group',
    'Create an ad',
  ];

  return (
    // <div style={{
    //   textAlign: 'center',
    //   color: '#000',
    // }} onClick={() => checkIsClicked()}>
    //   <h1>Elevator Pitch</h1>

    //   <div>

    //     {isClicked && (
    //       <Stepper activeStep={activeStep} >
    //         <div style={{
    //           position: 'absolute',
    //           bottom: '0',
    //           right: '0',
    //           left: '70px',
    //           padding: '50px',
    //         }} >
    //           <div>
    //             <Button
    //               variant="contained"
    //               onClick={handleBack}
    //               disabled={activeStep === 0}
    //               style={{
    //                 marginTop: '10%',
    //               }}
    //               type='button'
    //             >
    //               Back
    //             </Button>
    //             <Button
    //               variant="contained"
    //               onClick={handleNext}
    //               disabled={activeStep === steps.length - 1}
    //               style={{
    //                 marginTop: '10%',
    //                 marginLeft: '20%',
    //               }}
    //               type='button'
    //             >
    //               Suivant
    //             </Button>
    //           </div>
    //         </div>
    //       </Stepper>

    //     )}

    //     {activeStep === 0 && <EPName />}
    //     {activeStep === 1 && <EPDesc />}
    //     {activeStep === 2 && <EPName />}

    //   </div>

    // </div>
    <Box sx={{ width: '100%', paddingLeft: 10, paddingRight: 10}}>
      <ElevatorPitch index={activeStep} isClicked={isClicked} clicked={clicked}/>
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
