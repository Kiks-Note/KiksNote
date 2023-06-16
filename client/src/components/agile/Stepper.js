import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Page 1', 'Page 2', 'Page 3'];

const Stepper = ({ activeStep }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default Stepper;
