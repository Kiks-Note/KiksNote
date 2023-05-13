const auth = require("./firebase");

function authMiddleware(request, response, next) {
  const {email, password} = request.body;

  auth.getUserByEmail(email).then((user) => {
    if (user) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          user.user.getIdToken().then((token) => {
            response.send({token});
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      response.send({message: "User not found"});
    }
  });
}

module.exports = authMiddleware;
