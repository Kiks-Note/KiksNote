module.exports = (app, db) => {


//API for getting users' info from db
  app.get("/profile/getUser", (req, res) => {
    db.collection("users")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.put("/profile/updateUser", (req, res) => {
    db.collection("users")
    .put()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(req.body)
  })

  

 

  
};
