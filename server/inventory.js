module.exports = (app, db, user) => {
  app.get("/inventory", async (req, res) => {
    const docRef = db.collection("inventory2");
    const snapshot = await docRef.get();
    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    try {
      res.status(200).send(documents);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/categories", async (req, res) => {
    const snapshot = await db.collection("inventoryCategories").get();
    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    try {
      res.status(200).send(documents);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post("/addDevice", async (req, res) => {
    const {label, reference, category, campus, status, image} = req.body;

    try {
      await db.collection("inventory2").doc().set({
        label: label,
        reference: reference,
        category: category,
        campus: campus,
        status: status,
        image: image,
      });

      res.send("Document successfully written!");
    } catch (err) {
      res.status(500).send(err);
    }

    // const docRef = db.collection("inventory").doc("devices");
    // const collectionRef = docRef.collection(category);
    // const newRef = reference.replaceAll(" ", "_");
    // if (!collectionRef) {
    //   // create collection if it doesn't exist
    //   await docRef.createCollection(category);

    //   await collectionRef.doc(newRef).set({
    //     label: label,
    //     reference: reference,
    //     category: category,
    //     campus: campus,
    //     status: status,
    //     image: image,
    //   });
    // } else {
    //   // if dont doc exists, create it else return error
    //   const doc = await collectionRef.doc(newRef).get();
    //   if (!doc.exists) {
    //     await collectionRef.doc(newRef).set({
    //       label: label,
    //       reference: reference,
    //       category: category,
    //       campus: campus,
    //       status: status,
    //       image: image,
    //     });
    //     console.log("Document successfully written!");
    //     return res.send("Document successfully written!");
    //   } else {
    //     console.log("Document already exists!");
    //     return;
    //   }
    // }
  });

  app.put("/inventory/makerequest/:category/:deviceId", async (req, res) => {
    const {deviceId, category} = req.params;
    const {data} = req.body;

    try {
      await db
        .collection("inventory2")
        .doc(deviceId)
        .collection("requests")
        .doc()
        .set({
          status: "data.status",
          userId: user.mail,
        });

      res.send("Request sent");
    } catch (err) {
      res.send(err);
    }
  });
};
