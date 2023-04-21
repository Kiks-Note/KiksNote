module.exports = (
  app,
  db,
  bcrypt,
  saltRounds,
  auth,
  authClient,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
) => {
  app.post("/auth/signup", (req, res) => {
    const {
      userEmail,
      userPassword,
      userFirstName,
      userLastName,
      userBirthDate,
      userStatus,
      userClass,
    } = req.body;

    let salt = bcrypt.genSaltSync(saltRounds);

    createUserWithEmailAndPassword(authClient, userEmail, userPassword)
      .then((userCredential) => {
        if (userClass === "") {
          db.collection("users")
            .doc(userCredential.user.uid)
            .set({
              company: "",
              dateofbirth: new Date(userBirthDate),
              description: "",
              discord: "",
              email: userEmail,
              firstname: userFirstName,
              git: "",
              image: "",
              imagebackground: "",
              job: "",
              lastname: userLastName,
              linkedin: "",
              phone: "",
              password: bcrypt.hashSync(userPassword, salt),
              programmationLanguage: [],
              status: userStatus,
            });
        } else {
          db.collection("users")
            .doc(userCredential.user.uid)
            .set({
              class: userClass,
              company: "",
              dateofbirth: new Date(userBirthDate),
              description: "",
              discord: "",
              email: userEmail,
              firstname: userFirstName,
              git: "",
              image: "",
              imagebackground:"",
              job: "",
              lastname: userLastName,
              linkedin: "",
              phone: "",
              password: bcrypt.hashSync(userPassword, salt),
              programmationLanguage: [],
              status: userStatus,
            });
        }
        return res.status(200).send(userCredential);
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).send(err);
      });
  });

  app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      signInWithEmailAndPassword(authClient, email, password)
        .then((userCredential) => {
          userCredential.user.getIdToken().then(async (idToken) => {
            const decodedToken = await auth.verifyIdToken(idToken);
            const customToken = await auth.createCustomToken(decodedToken.uid);
            const docRef = await db.collection("users");
            const snapshot = await docRef.doc(userCredential.user.uid).get();
            return res.status(200).send({
              token: customToken,
              refreshToken: userCredential.user.stsTokenManager.refreshToken,
              user: snapshot.data(),
              userUid: userCredential.user.uid,
            });
          });
        })
        .catch((error) => {
          return res.status(401).send(error);
        });
    } catch (err) {
      return res.status(401).send(err);
    }
  });
};
