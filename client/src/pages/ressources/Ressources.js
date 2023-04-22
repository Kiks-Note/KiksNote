import React, { useEffect, useState } from 'react';
import AddIcon from "@mui/icons-material/Add";
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation } from 'react-router-dom';

export default function Ressources(props) {

    const { data } = props;

    let navigate = useNavigate();
    const createCardRoute = () =>{ 
        let path = "/createCard"; 
        navigate(path);
    }

    if(!data) {
        return <div>Aucune carte à afficher</div>;
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

            <div>
                <h2>{data.title}</h2>
                <p>{data.desc}</p>
                <p>{data.po}</p>
                <p>{data.date}</p>
            </div>
        </div>
    );
}