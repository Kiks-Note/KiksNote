module.exports = (app, db, bcrypt, auth, authClient, sendPasswordResetEmail) => {

    app.post("/sendemail", (req, res) => {

        try {
            const { email } = req.body;

            // var actionCodeSettings = {
            //     url: `https://www.example.com/?email=${email}`,
            //     iOS: {
            //         bundleId: 'com.example.ios'
            //     },
            //     android: {
            //         packageName: 'com.example.android',
            //         installApp: true,
            //         minimumVersion: '12'
            //     },
            //     handleCodeInApp: true
            // };

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


    // app.post("/auth/resetpassword", async (req, res) => {

    //     const password = req.body.password;
    //     const confirmPassword = req.body.confirmPassword;
    //     const token = req.body.token;

    //     const docRef = await db.collection("users");
    //     const snapshot = await docRef.get();
    //     const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //     let userid = "";


    //     // Verify that in the query there is a Token
    //     if (!token) {
    //         return res.status(401).send("Token non renseigné, merci de bien cliquer sur le lien dans votre boite mail.");
    //     }

    //     // Verify if token is good, then get the e-mail
    //     let emailToken;
    //     try {
    //         jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
    //             emailToken = decoded.email
    //         });
    //     } catch (err) {
    //         return res.status(401).send("Token incorrect, merci de bien cliquer sur le lien dans votre boite mail.");
    //     }
    //     var emailDatabase = "";
    //     var emailfoundinDatabase = false;
    //     users.forEach((user) => {
    //         emailDatabase = user.email;
    //         if (emailToken == emailDatabase) {
    //             emailfoundinDatabase = true;
    //             userid = user.id
    //         }
    //     });

    //     if (!emailfoundinDatabase) {
    //         return res.status(401).send("Email incorrect, merci de bien cliquer sur le lien dans votre boite mail.");
    //     }

    //     // Verify if password is correct
    //     if (password !== confirmPassword) {
    //         return res.status(401).send({ error: "Les mots de passe ne correspondent pas." });
    //     }

    //     // Mettre à jour le mot de passe de l'utilisateur en base de données
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     await db.collection("users").doc(userid).update({ hashed_password: hashedPassword });

    //     return res.status(200).send("Mot de passe modifié correctement modifié.");
    // });


    // app.post("/resetpass", (req, res) => {
    //     const newPassword = req.body.newPassword;
    //     const confirmedPassword = req.body.confirmedPassword;
    //     const tokenResetPass = req.body.token
    //     newPasswordHash = bcrypt.hashSync(newPassword, saltRounds);

    // })


    // const email = req.body.email;
    // var nodemailer = require('nodemailer');
    // let isValidEmail = false;

    // db.collection("users")
    //   .get()
    //   .then((snapshot) => {
    //     const data = [];
    //     snapshot.forEach((doc) => {
    //       data.push(doc.data()["email"]);
    //       const str = doc.data()["email"];
    //       if (doc.data()["email"].replace(/\s+/g, '') == email.replace(/\s+/g, '')) {
    //         isValidEmail = true
    //       }
    //     });
    //   }).then(
    //     () => {
    //       if (isValidEmail == true) {
    //         res.send("mail there");
    //         var transporter = nodemailer.createTransport({
    //           service: 'gmail',
    //           auth: {
    //             user: 'services.kiksnote.noreply@gmail.com',
    //             pass: "njujpddhfbazaifo"
    //           }
    //         });

    //         // Generate a token to be send by email
    //         const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "15m" });

    //         var mailOptions = {
    //           from: 'services.kiksnote.noreply@gmail.com',
    //           to: email,
    //           subject: 'Récupération du mot de passe',
    //           text: `http://localhost:3000/resetpass?token=${token}`
    //         };

    //         transporter.sendMail(mailOptions, function (error, info) {
    //           if (error) {
    //             console.log(error);
    //           } else {
    //             console.log('Email sent: ' + info.response);
    //           }
    //         });
    //       } else {
    //         res.send("mail not there");
    //       }
    //     }
    //   )
    //   .catch((err) => {
    //     console.error(err);
    //   });

}