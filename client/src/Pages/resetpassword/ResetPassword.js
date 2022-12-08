import React, { useRef } from 'react'
import "./ResetPassword.scss"
import Divider from '@mui/material/Divider';
import emailjs from '@emailjs/browser';

import { FormControl, Input, InputLabel, Button, Box } from "@mui/material";
function ResetPassword() {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_9qbegx6', 'template_1qevcwq', form.current, 'sAACHC3wqCnTDOF-H')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
    };

    return (
        <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }} className="box-form-reset-with-mail">
                <h1 style={{ margin: 10, fontSize: "2vw" }}>Réinitialiser le mot de passe</h1>
                <Divider variant="middle" style={{ background: "#000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form ref={form} onSubmit={sendEmail} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Email</label>
                    <input placeholder="Mail" required id="my-mail-id" type="email" name="user_email" style={{ backgroundColor: "#fff", width: "80%", marginTop: "10%" }} />
                    <input type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "10%" }} value="Envoyer" />
                </form>
            </Box>
        </div>
    );
}

export default ResetPassword;


