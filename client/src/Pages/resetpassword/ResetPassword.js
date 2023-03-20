import React, { useRef, useState } from 'react'
import "./ResetPassword.scss"
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { Box } from "@mui/material";


function ResetPassword() {
    const form = useRef();

    
    const [newUserPassword, setnNewUserPassword] = useState(''); 
    const [confirmedUserPassword, setConfirmedUserPassword] = useState(''); 

    const resetUserPassword = async (email) => {
        console.log("front");
        localStorage.setItem("dszff", "fefeefefefefe")
        const res = await axios
            .post("http://localhost:5050/resetpass", {
                newPassword: newUserPassword,
                confirmedPassword: confirmedUserPassword
            })
    };


    return (
        <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }} className="box-form-reset-with-mail">
                <h1 style={{ margin: 10, fontSize: "2vw" }}> Modification du mot de passe</h1>
                <Divider variant="middle" style={{ background: "#000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form ref={form} onSubmit={resetUserPassword} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Nouveau mot de passe</label>
                    <input required id="my-new-pass" onInput={(e) => setnNewUserPassword(e.target.value)} type="password" name="user_new_pass" style={{ backgroundColor: "#fff", width: "80%", marginTop: "1%" }} />
                    <label>Confirmer le mot de passe</label>
                    <input required id="my-confirmed-pass" onInput={(e) => setConfirmedUserPassword(e.target.value)} type="password" name="user_confirmed_pass" style={{ backgroundColor: "#fff", width: "80%", marginTop: "1%" }} />
                    <input type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "3%" }} value="Envoyer" />
                </form>
            </Box>
        </div>
    );
}

export default ResetPassword;
