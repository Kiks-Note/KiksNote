import React, { useEffect, useState } from 'react';
import AddIcon from "@mui/icons-material/Add";
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Ressources() {

    const [ressources, setRessources] = useState([]);

    useEffect(() => {
        (async () => {
    
            try{
                axios.get("http://localhost:5050/ressources")
                .then((res) => setRessources(res.data));
            }catch(error){
                console.log(error);
            }
          
        })();
      }, []);


    let navigate = useNavigate();
    const createCardRoute = () =>{ 
        let path = "/createCard"; 
        navigate(path);
    }

    if(!ressources) {
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
                {ressources.map((resource) => (
                    <div key={resource.id}>
                    <h2>{resource.title}</h2>
                    <p>{resource.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}