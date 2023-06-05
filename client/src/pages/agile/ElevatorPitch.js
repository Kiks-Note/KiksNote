import React from 'react';
import TextField from '@mui/material/TextField';

export default function ElevatorPitch() {

    return (
      <div style={{
        textAlign: 'center',
      }}>
        <h1>Elevator Pitch</h1>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            <div className="clickable_div" style={{
                width: '50%',
                height: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'lightblue',
                borderRadius: '20px',
            }}>
                <div>
                    <p>Hi 👋 What's your name?</p>
                    <p>First Name</p>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </div>
            </div>
        </div>
      </div>
    )
}
