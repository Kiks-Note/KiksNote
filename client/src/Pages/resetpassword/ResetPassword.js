import React, { useRef, useState } from 'react'
import "./ResetPassword.scss"
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { Box } from "@mui/material";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

function ResetPassword() {
    const form = useRef();
    const [newUserPassword, setnNewUserPassword] = useState('');
    const [confirmedUserPassword, setConfirmedUserPassword] = useState('');
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const resetUserPassword = async () => {
        await axios
            .post("http://localhost:5050/auth/resetpassword", {
                password: newUserPassword,
                confirmPassword: confirmedUserPassword,
                token: token
            })
    };


    function handleSubmitPassword(e) {
        resetUserPassword();
        e.preventDefault();
        if (newUserPassword === confirmedUserPassword) {
            form.current.reset();
            toastSuccess("Mot de passe modifié")
        } else {
            toastFail("Mot de passe différent");
        }

    }


    return (
        <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }} className="box-form-reset-with-mail">
                <h1 style={{ margin: 10, fontSize: "2vw" }}> Modification du mot de passe</h1>
                <Divider variant="middle" style={{ background: "#000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form ref={form} onSubmit={handleSubmitPassword} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Nouveau mot de passe</label>
                    <input required id="my-new-pass" onInput={(e) => setnNewUserPassword(e.target.value)} type="password" name="user_new_pass" style={{ backgroundColor: "#fff", width: "80%", marginTop: "1%" }} />
                    <label>Confirmer le mot de passe</label>
                    <input required id="my-confirmed-pass" onInput={(e) => setConfirmedUserPassword(e.target.value)} type="password" name="user_confirmed_pass" style={{ backgroundColor: "#fff", width: "80%", marginTop: "1%" }} />
                    <input type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "3%" }} value="Envoyer" />
                </form>
            </Box>
            <ToastContainer></ToastContainer>

        </div>
    );
}

export default ResetPassword;
