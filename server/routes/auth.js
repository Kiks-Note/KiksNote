module.exports = (
  app,
  db,
  auth,
  authClient,
  signInWithEmailAndPassword
) => {
  app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      signInWithEmailAndPassword(authClient, email, password).then(
        (userCredential) => {
          userCredential.user.getIdToken().then(async (idToken) => {
            const decodedToken = await auth.verifyIdToken(idToken);
            const customToken = await auth.createCustomToken(decodedToken.uid);
            const docRef = await db.collection("users");
            const snapshot = await docRef.doc(userCredential.user.uid).get();
            return res.status(200).send({ token: customToken, refreshToken: userCredential.user.stsTokenManager.refreshToken, user: snapshot.data() });
          });
        }
      ).catch((error) => {
        return res.status(401).send(error);
      });
    } catch (err) {
      return res.status(401).send(err);
    }
  });
};
