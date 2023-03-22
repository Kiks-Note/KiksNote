module.exports = (app, db, jwt, bcrypt) => {

    app.post("/auth/resetpassword", async (req, res) => {

        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const token = req.body.token;

        const docRef = await db.collection("users");
        const snapshot = await docRef.get();
        const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        let userid = "";


        // Verify that in the query there is a Token
        if (!token) {
            return res.status(401).send("Token non renseigné, merci de bien cliquer sur le lien dans votre boite mail.");
        }

        // Verify if token is good, then get the e-mail
        let emailToken;
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
                emailToken = decoded.email
            });
        } catch (err) {
            return res.status(401).send("Token incorrect, merci de bien cliquer sur le lien dans votre boite mail.");
        }
        var emailDatabase = "";
        var emailfoundinDatabase = false;
        users.forEach((user) => {
            emailDatabase = user.email;
            if (emailToken == emailDatabase) {
                emailfoundinDatabase = true;
                userid = user.id
            }
        });

        if (!emailfoundinDatabase) {
            return res.status(401).send("Email incorrect, merci de bien cliquer sur le lien dans votre boite mail.");
        }

        // Verify if password is correct
        if (password !== confirmPassword) {
            return res.status(401).send({ error: "Les mots de passe ne correspondent pas." });
        }

        // Mettre à jour le mot de passe de l'utilisateur en base de données
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").doc(userid).update({ hashed_password: hashedPassword });

        return res.status(200).send("Mot de passe modifié correctement modifié.");
    });
}