import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function CreateCard() {

    const [textValue, setTextValue] = useState('');

    const handleInputChange = (event) => {
        setTextValue(event.target.value);
      };

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
        {/* Titre
            Date
            Image
            Description
            Po */}
      <TextField id="standard-basic" label="Titre du cours" variant="standard" value={textValue} onChange={handleInputChange}/>
      <p>The value of the text field is: {textValue}</p>
      <TextField id="standard-basic" label="Date de création" variant="standard" />
      <TextField id="standard-basic" label="Image du cours" variant="standard" />
      <TextField id="standard-basic" label="Description du cours" variant="standard" />
      <TextField id="standard-basic" label="PO" variant="standard" />
    </Box>
  );
}