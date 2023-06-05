
import React, { useRef, useState } from 'react'
import "./AskResetPassword.scss"
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { Box, TextField, Button } from "@mui/material";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    useTheme,
} from "@mui/material";


const options = {
    autoClose: 2000,
    className: '',
    position: toast.POSITION.TOP_RIGHT,
};

export const toastSuccess = message => {
    toast.success(message, options);
}

export const toastFail = message => {
    toast.error(message, options);
}

function AskResetPassword() {

    const theme = useTheme();
    const [mail, setMail] = useState('');

    const sendEmailFromFront = async () => {
        try {
            await axios.post("http://localhost:5050/auth/sendemail", {
                email: mail
            }).then((response) => {
                console.log(response.data)
                if (response.status === 200) {
                    toastSuccess("Mail envoyé");
                } else {
                    toastFail("Mail non valide");
                }
            }).catch((err) => {
                console.log(err);
            });
        } catch (error) {
            console.log(error)
        }
    };

    const form = useRef();

    function handleSubmit(e) {
        sendEmailFromFront();
        e.preventDefault();
        form.current.reset();
    }

    return (

        <div className="form-reset-with-mail-container" style={{ backgroundColor: theme.palette.background.paper }}>
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px", backgroundColor: theme.palette.background.container }} className="box-form-reset-with-mail" >
                <h1 style={{ margin: 10, fontSize: "2vw" }}>Réinitialiser le mot de passe</h1>
                <Divider variant="middle" style={{ background: "#FFF000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form className='form-ask-reset' ref={form} onSubmit={(e) => handleSubmit(e)} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Email</label>
                    <TextField placeholder="Mail" required id="my-mail-id" type="email" name="user_email" onInput={e => setMail(e.target.value)} sx={{
                        input: { color: 'text.primary' }
                    }} />
                    <Button id='submit-email' type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "10%" }}>Envoyer</Button>
                </form>
            </Box>
            <ToastContainer></ToastContainer>
        </div>

    );
}
export default AskResetPassword; 