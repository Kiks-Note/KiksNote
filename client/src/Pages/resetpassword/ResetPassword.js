import React, { useRef } from 'react'
import "./ResetPassword.scss"
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { Box } from "@mui/material";


function ResetPassword() {
    const form = useRef();

    const sendPasswords = async () => {
        console.log("front");
        const res = await axios
            .post("http://localhost:5050/sendemail", {
                email: "mail"
            })
    };


    return (
        <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }} className="box-form-reset-with-mail">
                <h1 style={{ margin: 10, fontSize: "2vw" }}> Modification du mot de passe</h1>
                <Divider variant="middle" style={{ background: "#000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form ref={form} onSubmit={sendPasswords} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Email</label>
                    <input placeholder="Mail" required id="my-mail-id" type="email" name="user_email" style={{ backgroundColor: "#fff", width: "80%", marginTop: "1%" }} />
                    <label>Ancien mot de passe</label>
                    <input required id="my-old-pass" type="password" name="user_old_pass" style={{ backgroundColor: "#fff", width: "80%", marginTop: "1%" }} />
                    <label>Nouveau mot de passe</label>
                    <input required id="my-new-pass" type="password" name="user_new_pass" style={{ backgroundColor: "#fff", width: "80%", marginTop: "1%" }} />
                    <input type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "3%" }} value="Envoyer" />
                </form>
            </Box>
        </div>
    );
}

export default ResetPassword;
