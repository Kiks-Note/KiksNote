import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Jpo(){

    const [events, setEvent] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            const response = await axios.get("http://localhost:5050/jpo")
                .then((response) => {
                    setEvent(response.data);
                });
        };
        fetchEvent();
    }, []);

    return (
        <div>
            <h1>JPO</h1>
            <Button variant="contained" disableElevation sx={{
                marginLeft: "80%",
            }}>
                Soumettre un projet
            </Button>
            <div className="grid grid-rows-3 grid-flow-col gap-4" style={{ width: "100%", height: "100%" }}>
                <div className="row-span-3 ..." 
                    style={{
                        backgroundColor: "#DFCFBE", 
                        color: "black",
                        border: "1px solid #DFCFBE",
                        height: "100%",
                        width: "100%",
                        padding: "4em",
                        borderRadius: "25px",
                        marginLeft: "1em",
                    }}>
                    <h2>Évenements JPO :</h2>
                    <br/>
                    {events.map((event) => (
                        <div
                            key={event.id} 
                            className="grid grid-rows-2 grid-flow-col" 
                            style={{
                                backgroundColor: "#c9b6a1",
                                border: "1px solid black",
                                borderRadius: "25px",
                                padding: "1em",
                                marginBottom: "1em",
                                cursor: "pointer",
                                overflow: "scroll",
                        }}>
                            {event.title} <br/>
                            {/* {event.creation_date}<br/> */}
                            date/heure <br/>
                            {event.description} 
                        </div>
                    ))}                      
                </div>

                <div className="col-span-2 ..." 
                    style={{
                        backgroundColor: "#98B4D4",
                        color: "black",
                        border: "1px solid black",
                        height: "100%",
                        width: "90%",
                        padding: "3em",
                        borderRadius: "25px",
                        marginLeft: "1em",
                    }}>
                    <h2>Explications JPO</h2>
                    <p>Une journée portes ouvertes (JPO) est un événement durant lequel des monuments ou des lieux (historiques, industriels, …) d'accès généralement interdits au public sont exceptionnellement ouverts à la visite.
                        Cette idée a reçu un écho durable avec la naissance, en France, en 1984, des « Journées portes ouvertes dans les monuments historiques », qui s'est ensuite développée dans l'ensemble de l'Europe pour en devenir les Journées européennes du patrimoine.
                        Des journées portes ouvertes existent également dans d'autres contextes, par exemple pour visiter une école avant de s'y inscrire (participations à des cours, etc.) et pour mieux vendre ses produits dans le cadre d'une entreprise.
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-4" style={{
                    width: "100%",
                    marginLeft: "1em",
                }}>
                    <div style={{
                        backgroundColor: "#939597",
                        color: "black",
                        border: "1px solid black",
                        height: "100%",
                        width: "250%",
                        borderRadius: "25px",
                        padding: "1em",
                        cursor: "pointer"
                    }} >
                        <p>Projets qui peuvent être sélectionné pour être présenté en jpo</p>
                    </div>
                </div>
            </div>
        </div>
    )
}