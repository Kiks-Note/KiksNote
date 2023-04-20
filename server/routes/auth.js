module.exports = (app, db, auth, authClient, signInWithEmailAndPassword) => {
  // app.post("/auth/login", async (req, res) => {
  //   const {email, password} = req.body;
  //   try {
  //     signInWithEmailAndPassword(authClient, email, password)
  //       .then((userCredential) => {
  //         userCredential.user.getIdToken().then(async (idToken) => {
  //           const decodedToken = await auth.verifyIdToken(idToken);
  //           const customToken = await auth.createCustomToken(decodedToken.uid);
  //           const docRef = await db.collection("users");
  //           const snapshot = await docRef.doc(userCredential.user.uid).get();
  //           return res.status(200).send({
  //             token: customToken,
  //             refreshToken: userCredential.user.stsTokenManager.refreshToken,
  //             user: snapshot.data(),
  //             userUid: userCredential.user.uid,
  //           });
  //         });
  //       })
  //       .catch((error) => {
  //         return res.status(401).send(error);
  //       });
  //   } catch (err) {
  //     return res.status(401).send(err);
  //   }
  // });
  // app.get("/auth/user", async (req, res) => {
  //   if (authClient.currentUser) {
  //     authClient.onAuthStateChanged((user) => {
  //       if (user) {
  //         authClient.currentUser.getIdToken().then(async (idToken) => {
  //           const decodedToken = await auth.verifyIdToken(idToken);
  //           const docRef = await db.collection("users");
  //           const snapshot = await docRef.doc(decodedToken.uid).get();
  //           return res.status(200).send({
  //             id: snapshot.id,
  //             ...snapshot.data(),
  //           });
  //         });
  //       } else {
  //         return res.send("No user logged in");
  //       }
  //     });
  //   } else {
  //     return res.send("No user logged in");
  //   }
  // });
  // app.post("/auth/logout", async (req, res) => {
  //   authClient.signOut();
  //   return res.status(200).send("User logged out");
  // });
};
