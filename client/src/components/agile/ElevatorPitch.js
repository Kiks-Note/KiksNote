import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { toast } from 'react-hot-toast';

export default function ElevatorPitch({ index, isClicked, clicked }) {

    // const [isClicked, setIsClicked] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleChange = (e) => {
        if (!name || !description) {
            toast.error("Veuillez remplir tous les champs!");
        }
        const formValues = {
            name,
            description,
        }
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
                    width: isClicked ? '70%' : '50%',
                    height: isClicked ? '70%' : '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#7CB9E8',
                    borderRadius: '20px',
                    transition: 'width 0.3s, height 0.3s',
                }}
                onClick={clicked}
                >
                    {index === 0 && (
                        <form>
                            <div>
                                {!isClicked && (
                                    <div>
                                        <Typography variant='h2'>Salut 👋 ! Clique ici pour remplir ton Élévator pitch</Typography>
                                        <Typography variant='body1'>Remplir chaque champs</Typography>
                                    </div>
                                )}
                                {isClicked && (
                                    <div>
                                        <h2>Le nom de ton projet ? 📚</h2>
                                        <TextField
                                            id="outlined-basic"
                                            label="Prénom"
                                            variant="outlined"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                {isClicked && (
                                    <div>
                                        <Typography variant='h2'>La description de ton projet ? 💻</Typography>
                                        <Typography variant='body1'>
                                            <em>appuyez sur entré pour avoir un saut de ligne*</em>
                                        </Typography>
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            multiline
                                            maxRows={4}
                                            label="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                    {index === 1 && (
                        <div className='clickable_div'>
                            <form>
                                <div>
                                    <h2>La description de ton projet ? 📚</h2>

                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tu dois faire tout ton code ici selon l'index et pas creer plusieurs component */}
                </div>
            </Box>
        </div>
    )
}
