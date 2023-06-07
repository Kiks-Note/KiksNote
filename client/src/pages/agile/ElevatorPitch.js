import React, { useState } from 'react';
import "../agile/agile.css";
import Stepper from '@mui/material/Stepper';
import EPName from '../../components/agile/EPName';
import EPDesc from '../../components/agile/EPDesc';
import Button from '@mui/material/Button';

export default function ElevatorPitch() {

    const [activeStep, setActiveStep] = useState(0);
    const [isClicked, setIsClicked] = useState(false);

    const handleNext = () => {
      setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevStep) => prevStep - 1);
    };

    const steps = [
      'Nom et Description du projet',
      'Create an ad group',
      'Create an ad',
    ];

    return (
      <div style={{
        textAlign: 'center',
        color: '#000',
      }}>
        <h1>Elevator Pitch</h1>
        
          <div>
            <Stepper activeStep={activeStep} >
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                left: '70px',
                padding: '50px',
              }} >
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      style={{
                          marginTop: '10%',
                      }}
                      type='button'
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={activeStep === steps.length - 1}
                      style={{
                          marginTop: '10%',
                          marginLeft: '20%',
                      }}
                      type='button'
                    >
                      Suivant
                    </Button>
                  </div>
              </div>
            </Stepper>

            {activeStep === 0 && <EPName />}
            {activeStep === 1 && <EPDesc />}
            {activeStep === 2 && <EPName />}

          </div>

      </div>
    )
}
