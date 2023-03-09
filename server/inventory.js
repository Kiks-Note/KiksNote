module.exports = (app, db, user) => {
  app.get("/inventory", async (req, res) => {
    const docRef = db.collection("inventory");
    const snapshot = await docRef.orderBy("createdAt").get();
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
        createdAt: new Date(),
        createdBy: user.ref,
      });

      res.send("Document successfully written!");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.put("/inventory/modify/:deviceId", async (req, res) => {
    const {deviceId} = req.params;
    const {label, reference, category, campus, status, image, lastModifiedBy} =
      req.body;

    console.log(req.body);

    try {
      await db.collection("inventory").doc(deviceId).update({
        label: label,
        ref: reference,
        category: category,
        campus: campus,
        status: status,
        image: image,
        lastModifiedBy: lastModifiedBy,
        lastModifiedAt: new Date(),
      });

      res.send("Document successfully updated!");
    } catch (err) {
      res.send(err);
    }
  });

  app.delete("/inventory/delete/:deviceId", async (req, res) => {
    const {deviceId} = req.params;

    try {
      await db.collection("inventory").doc(deviceId).delete();
      res.send("Document successfully deleted!");
    } catch (err) {
      res.send(err);
    }
  });

  // requests

  app.put("/inventory/makerequest/:category/:deviceId", async (req, res) => {
    const {deviceId, category} = req.params;
    const {startDate, endDate, createdAt} = req.body;

    try {
      const docRef = await db
        .collection("inventory")
        .doc(deviceId)
        .collection("requests")
        .doc();

      await docRef.set({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(createdAt),
        user: user.ref,
      });

      await db.collection("inventory").doc(deviceId).update({
        status: "requested",
        lastRequestId: docRef.id,
      });
    } catch (err) {
      res.send(err);
    }
  });

  app.put("/inventory/acceptrequest/:deviceId/:requestId", async (req, res) => {
    const {deviceId, requestId} = req.params;

    try {
      const requestRef = await db
        .collection("inventory")
        .doc(deviceId)
        .collection("requests")
        .doc(requestId);

      const deviceRef = await db.collection("inventory").doc(deviceId);

      await deviceRef.update({
        status: "borrowed",
        lastRequestId: requestId,
      });

      await requestRef.update({
        status: "accepted",
        acceptedAt: new Date(),
      });

      res.send("Request accepted");
    } catch (err) {
      res.send(err);
    }
  });

  app.put("/inventory/refuserequest/:deviceId/:requestId", async (req, res) => {
    const {deviceId, requestId} = req.params;

    try {
      const deviceRef = await db.collection("inventory").doc(deviceId);
      const requestRef = await db
        .collection("inventory")
        .doc(deviceId)
        .collection("requests")
        .doc(requestId);

      await deviceRef.update({
        status: "available",
        lastRequestId: requestId,
      });

      await requestRef.update({
        status: "refused",
        refusedAt: new Date(),
      });

      res.send("Request refused");
    } catch (err) {
      res.send(err);
    }
  });

  app.get("/inventory/request/:deviceId/:requestId", async (req, res) => {
    const {deviceId, requestId} = req.params;

    const doc = await db
      .collection("inventory")
      .doc(deviceId)
      .collection("requests")
      .doc(requestId)
      .get();

    res.status(200).send(doc.data());
  });
};
