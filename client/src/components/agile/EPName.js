import { TextField } from '@mui/material';
import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { toast } from 'react-hot-toast';

export default function EPName() {

    const [isClicked, setIsClicked] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleClick = () => {
        setIsClicked(true);
    }

    const handleChange = (e) => {
        if(!name || !description){
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
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
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
                onClick={handleClick}
                >
                    <form>
                        <div>
                            {!isClicked && (
                                <div>
                                    <h2>Salut 👋 ! Clique ici pour remplir ton Élévator pitch</h2>
                                    <p>Remplir chaque champs</p>
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
                        <br/>
                        <div>
                            {isClicked && (
                                <div>
                                    <h2>La description de ton projet ? 💻</h2>
                                    <p><em>appuyez sur entré pour avoir un saut de ligne*</em></p>
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
                </div>
            </div>
        </div>
    )
}
