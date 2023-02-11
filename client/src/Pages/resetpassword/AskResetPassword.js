import React, { useRef } from 'react'
import "./AskResetPassword.scss"
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { Box } from "@mui/material";


function makeid(nickname) {
    const length = 64;
    const linktoresetpage = `http://localhost:3000/askresetpass`;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var result = [];
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    var token = result.join('');
    console.log(`${linktoresetpage}/?token=${token}&nickname=${nickname}`);
    return token;
    // }

}


function ResetPassword() {
    const form = useRef();
    // const addCall = async () => {
    //     const res = await axios
    //       .post("http://localhost:4000/callAdd", {
    //         id_lesson: "",
    //         qrcode: "",
    //         student_scan: [],
    //         chats: [],
    //       })
    //       .then(() => {
    //         getCall();
    //       });
    //   };

    const sendEmailFromFront = async () => {
        console.log("front");
        const res = await axios
            .post("http://localhost:5050/sendemail", {
                email: "mail"
            })
    };

    // const sendEmailFromFront = async () => {

    //     const res = await axios.post("http://localhost:4000/sendemail", {
    //         email: "email"
    //     });
    //     console.log(res);

    // };
    // const sendEmail = (e) => {
    //     e.preventDefault();

    //     emailjs.sendForm('service_9qbegx6', 'template_1qevcwq', form.current, 'sAACHC3wqCnTDOF-H')
    //         .then((result) => {
    //             console.log(result.text);
    //         }, (error) => {
    //             console.log(error.text);
    //         });
    //     // generateLinkResetPass()
    // };

    // const generateLinkResetPass = async () => {
    //     const res = await axios.post("http://localhost:5000/callAdd", {
    //       name: name,
    //       quantity: quantity,
    //     });
    //     console.log(res);
    // };


    //(document.getElementById("my-mail-id").value
    return (
        <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }} className="box-form-reset-with-mail">
                <h1 style={{ margin: 10, fontSize: "2vw" }}>Réinitialiser le mot de passe</h1>
                <Divider variant="middle" style={{ background: "#000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form ref={form} onSubmit={sendEmailFromFront} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Email</label>
                    <input placeholder="Mail" required id="my-mail-id" type="email" name="user_email" style={{ backgroundColor: "#fff", width: "80%", marginTop: "10%" }} />
                    <input type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "10%" }} value="Envoyer" />
                </form>
                <button style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "10%" }} onClick={() => { makeid("Killian"); }}>lalalaa</button>
            </Box>
        </div>
    );
}

export default ResetPassword;
