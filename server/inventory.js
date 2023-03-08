module.exports = (app, db, user) => {
  app.get("/inventory", async (req, res) => {
    const docRef = db.collection("inventory");
    const snapshot = await docRef.get();
    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    try {
      res.status(200).send(documents);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/inventory/:deviceId", async (req, res) => {
    const {deviceId} = req.params;

    const docRef = db.collection("inventory").doc(deviceId);
    const doc = await docRef.get();

    res.status(200).send(doc.data());
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
      await db.collection("inventory").doc().set({
        label: label,
        ref: reference,
        category: category,
        campus: campus,
        status: status,
        image: image,
      });

      res.send("Document successfully written!");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.put("/inventory/makerequest/:category/:deviceId", async (req, res) => {
    const {deviceId, category} = req.params;
    const {startDate, endDate, createdAt} = req.body;

    try {
      await db
        .collection("inventory")
        .doc(deviceId)
        .collection("requests")
        .doc()
        .set({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          createdAt: new Date(createdAt),
          user: user.ref,
        });

      await db.collection("inventory").doc(deviceId).update({
        status: "requested",
      });

      res.send("Request sent");
    } catch (err) {
      res.send(err);
    }
  });
};
