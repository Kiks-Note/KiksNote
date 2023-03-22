module.exports = (
  app,
  db,
  jwt,
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
            console.log(decodedToken);
            const customToken = await auth.createCustomToken(decodedToken.uid);
            console.log("custom : ", customToken);
            res.status(200).send({ token: customToken , refreshToken : userCredential.user.stsTokenManager.refreshToken });
          });
        }
      );
    } catch (err) {
      res.status(401).send(err);
    }
  });

  app.post("/auth/refreshToken", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const refreshTokenPosted = authHeader && authHeader.split(" ")[1];

    if (!refreshTokenPosted) {
      return res.sendStatus(401).send("Refresh token is missing");
    }

    jwt.verify(
      refreshTokenPosted,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        console.log(user);
        if (err) {
          return res.status(401).send("Refresh token is not valid");
        }
        delete user.iat;
        delete user.exp;
        const refreshedToken = generateAccessToken(user);
        return res.status(200).send({
          accessToken: refreshedToken,
        });
      }
    );
  });

  function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    });
  }

  app.get("/auth/me", authenticateToken, (req, res) => {
    return res.status(200).send(req.user);
  });

  app.get("/auth/users", async (req, res) => {
    const docRef = await db.collection("users");
    const snapshot = await docRef.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).send(users);
  });
};
