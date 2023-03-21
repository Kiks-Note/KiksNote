module.exports = (app, db, jwt, bcrypt) => {
  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    });
  }

  function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  }

  app.post("/auth/login", async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const docRef = await db.collection("users");
    const snapshot = await docRef.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    var lastname = "";
    var firstname = "";
    var emailDatabase = "";
    var hashed_password = "";

    users.forEach((user) => {
      lastname = user.lastname;
      firstname = user.firstname;
      hashed_password = user.hashed_password;
      emailDatabase = user.email;
    });

    const user = {
      lastname: lastname,
      firstname: firstname,
      email: userEmail,
      password: userPassword,
    };

    if (!userEmail || !userPassword) {
      return res.status(401).send("Email and password is required to login");
    }

    if (userEmail != emailDatabase) {
      return res.status(401).send("Email is not found to login");
    }

    if (!(await bcrypt.compare(userPassword, hashed_password))) {
      return res.status(401).send({ error: "Wrong password" });
    } else {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return res.status(200).send({
        message: "Vous êtes bien connecté",
        access_token: accessToken,
        refreshToken: refreshToken,
      });
    }
  });

  app.post("/auth/refreshToken", async (req, res) => {
    
    const authHeader = req.headers["authorization"];
    const refreshTokenPosted = authHeader && authHeader.split(" ")[1];

    if (!refreshTokenPosted) {
      return res.sendStatus(401).send("Refresh token is missing");
    }

    jwt.verify(refreshTokenPosted, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

      console.log(user)
      if (err) {
        return res.status(401).send("Refresh token is not valid");
      }
      delete user.iat;
      delete user.exp;
      const refreshedToken = generateAccessToken(user);
      return res.status(200).send({
        accessToken: refreshedToken,
      });
    });
  });

  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
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
  
  app.get('/auth/me', authenticateToken, (req, res) => {
    return res.status(200).send(req.user);
  });

  app.get("/auth/users", async (req,res) => {
    const docRef = await db.collection("users");
    const snapshot = await docRef.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).send(users);
  }) 
};
