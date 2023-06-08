module.exports = (app, db, bcrypt, auth, authClient, sendPasswordResetEmail) => {

    app.post("/sendemail", (req, res) => {

        try {
            const { email } = req.body;
            
            console.log(email)
            sendPasswordResetEmail(authClient, email)
                .then(
                    res.status(200).send("Email sent successfully")
                )
                .catch(function (error) {
                    res.status(401).send(error)
                    console.log(error)
                });
        } catch (error) {
            res.status(404).send(error)
            console.log(error)
        }

    });
    
}