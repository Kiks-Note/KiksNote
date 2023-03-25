import * as React from 'react';
import AddIcon from "@mui/icons-material/Add";
import IconButton from '@mui/material/IconButton';
import Card from '../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Ressources() {

    let navigate = useNavigate();
    const createCardRoute = () =>{ 
        let path = "/createCard"; 
        navigate(path);
    }

  return (
    <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker />
        </LocalizationProvider>
        <br />
        <IconButton color="primary" aria-label="add" onClick={createCardRoute}>
            <AddIcon />
        </IconButton>

        <Card />
        <br />
        <Card /> 
    </div>
  );
}