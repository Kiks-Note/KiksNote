import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { toast } from 'react-hot-toast';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, InputLabel } from '@mui/material';
import { addElevatorPitch } from './agile';


export default function ElevatorPitch({ index}) {

    const [name, setName] = useState("");
    const [forWho, setForWho] = useState("");
    const [needed, setNeeded] = useState("");
    const [type, setType] = useState("");
    const [who, setWho] = useState("");
    const [difference, setDifference] = useState("");
    const [invis, setInvis] = useState(false);

    const handleChange = (e) => {
        if (!name || !forWho || !needed || !type || !who || !difference) {
            toast.error("Veuillez remplir tous les champs!");
        }
        const formValues = {
            name,
            forWho,
            needed,
            type,
            who,
            difference,
        }

        addElevatorPitch(formValues);
        setInvis(true);

        console.log(formValues);
    }

    return (
        <div style={{
            textAlign: 'center',
            color: '#000',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
            }}
            >
                <div className='clickable_div' style={{
                    width: '70%',
                    height:  '70%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#7CB9E8',
                    borderRadius: '20px',
                    transition: 'width 0.3s, height 0.3s',
                }}
                >

                    {index === 0 && (
                        <div className='clickable_div'>
                            <div>
                                <h2>Pour ?</h2>
                                <p>Type visé*</p>
                                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                    <InputLabel id="demo-select-small-label">Pour</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        label="pour"
                                        value={forWho}
                                        onChange={(e) => setForWho(e.target.value)}
                                        required
                                    >
                                        <MenuItem value="Client">Client</MenuItem>
                                        <MenuItem value="Utilisateur">Utilisateur</MenuItem>
                                        <MenuItem value="Marché">Marché</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    )}
                    {index === 1 && (
                        <div className='clickable_div'>
                            <div>
                                <h2>Qui a besoin de</h2>
                                <p>Services à rendre, problèmes à régler*</p>
                                <form>
                                    <TextField
                                        id="outlined-basic"
                                        label="Besoin de"
                                        variant="outlined"
                                        multiline
                                        maxRows={4}
                                        value={needed}
                                        onChange={(e) => setNeeded(e.target.value)}
                                    />
                                </form>
                            </div>
                        </div>
                    )}
                    {index === 2 && (
                        <div className='clickable_div'>
                            <div>
                                <h2>Le produit</h2>
                                <p>Nom*</p>
                                <form>
                                    <TextField
                                        id="outlined-basic"
                                        label="Prénom"
                                        variant="outlined"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <h2>Type du produit 💻</h2>
                                    <p>Application, site web, etc*</p>
                                    <TextField
                                        id="outlined-basic"
                                        label="Type"
                                        variant="outlined"
                                        multiline
                                        maxRows={4}
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    />
                                </form>
                            </div>
                        </div>
                    )}
                    {index === 3 && (
                        <div className='clickable_div'>
                            <div>
                                <h2>Qui ?</h2>
                                <p>bénéfices, utilité, raisons pour acheter*</p>
                                <form>
                                    <TextField
                                        id="outlined-basic"
                                        label="Qui"
                                        variant="outlined"
                                        multiline
                                        maxRows={4}
                                        value={who}
                                        onChange={(e) => setWho(e.target.value)}
                                    />
                                </form>
                            </div>
                        </div>
                    )}
                    {index === 4 && (
                        <div className='clickable_div'>
                            <div>
                                <h2>A la différence de</h2>
                                <p>alternative de la concurrence*</p>
                                <form>
                                    <TextField
                                        id="outlined-basic"
                                        label="Différence"
                                        variant="outlined"
                                        multiline
                                        maxRows={4}
                                        value={difference}
                                        onChange={(e) => setDifference(e.target.value)}
                                    />
                                </form>
                                <Button variant="outlined" onClick={handleChange} >Outlined</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Box>
            {invis && (
                <div>
                    <h2>Voici votre pitch:</h2>
                    <p>Pour: {forWho}, Qui a besoin de: {needed}, Le produit: {name} - {type}, Qui: {who}, À la différence de: {difference}. </p>
                </div>
            )}
        </div>
    )
}
