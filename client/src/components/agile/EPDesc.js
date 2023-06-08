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
        // <div className="clickable_div" style={{
        //     width: isClicked ? '70%' : '50%',
        //     height: isClicked ? '70%' : '50%',
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     background: '#7CB9E8',
        //     borderRadius: '20px',
        //     position: 'relative',
        //     transition: 'width 0.3s, height 0.3s',
        // }}
        // onClick={handleClick}
        // >
        //     <form onSubmit={handleSubmit}>
        //         <div style={{
        //             width: '100%',
        //             height: '100%',
        //             marginTop: '40px',
        //             position: 'absolute',
        //             top: '0',
        //             left: '0',
        //             opacity: '0.7',
        //         }}>
        //             {!isClicked && (
        //                 <div>
        //                     <h3>Salut 👋 ! Clique ici pour remplir ton Élévator pitch</h3>
        //                     <p>Rempli chaque champs</p>
        //                 </div>
        //             )}
        //             {isClicked && (
        //                 <div>
        //                     <h2>Le nom de ton projet ? 📚</h2>
        //                     <TextField
        //                         id="outlined-basic"
        //                         label="Prénom"
        //                         variant="outlined"
        //                         value={name}
        //                         onChange={(e) => setName(e.target.value)}
        //                     />
        //                 </div>
        //             )}
        //         </div>
                // <br/>
                // <div style={{
                //     marginTop: '20%',
                //     marginLeft: '1%'
                // }}>
                //     {isClicked && (
                //         <div>
                //             <h2>La description de ton projet ? 💻</h2>
                //             <p><em>appuyez sur entré pour avoir un saut de ligne*</em></p>
                //             <TextField
                //                 id="outlined-multiline-flexible"
                //                 multiline
                //                 maxRows={4}
                //                 label="Description"
                //                 value={description}
                //                 onChange={(e) => setDescription(e.target.value)}
                //             />
                //             <br/>
                //             <Button variant="contained" style={{
                //                 marginTop: '10%',
                //             }} type='submit' >
                //                 Valider
                //             </Button>
                //         </div>
                //     )}
                // </div>
        //     </form>
        // </div>
        <div className='clickable_div'>
            <form>
                <div>
                    <h2>La description de ton projet ? 📚</h2>
                    
                </div>
            </form>
        </div>
    )
}
