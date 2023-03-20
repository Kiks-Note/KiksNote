module.exports = (app, db) => {


//getting users' info from db
  app.get("/profile/getUser", (req, res) => {
    db.collection("users")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.put("/profile/user", (req, res) => {
    db.collection("users")
    .put()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(req.body)
  })

  

 

  
};
