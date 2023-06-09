import { TextField } from '@mui/material';
import React, { useState } from 'react'
import { Button } from 'react-day-picker';
import { toast } from 'react-hot-toast';

export default function EPDesc() {

    const [isClicked, setIsClicked] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        
    }

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
        }} >
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }} >
                <div className='clickable_div' style={{
                    width: '70%',
                    height: '70%',
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
                            <h2></h2>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
