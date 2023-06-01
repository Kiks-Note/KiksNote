const path = require('path');
const fs = require('fs');
const generatePDF = require('./pdfGenerator');


module.exports = (app, db, user, ws) => {

  app.get("/inventory", async (req, res) => {
    const docRef = db.collection("inventory");
    const snapshot = await docRef.orderBy("createdAt").get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    try {
      res.status(200).send(documents);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/inventory/pdfGenerator', async (req, res) => {
    const docRef = db.collection("inventory");
    const snapshot = await docRef.orderBy('createdAt').get();
    console.log('Snapshot:', snapshot);

    const inventoryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Inventory Data:', inventoryData);

    try {
      const outputDir = path.join(__dirname, 'output');
      const outputPath = path.join(outputDir, 'inventory.pdf');

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      fs.access(outputDir, fs.constants.W_OK, (err) => {
        if (err) {
          console.error('Erreur : Le serveur n\'a pas les permissions d\'écriture dans le répertoire de sortie.');
          res.status(500).send('Erreur lors de la génération du PDF');
          return;
        }

        generatePDF(inventoryData, outputPath, res);
      });
    } catch (err) {
      console.error('Erreur lors de la génération du PDF :', err);
      res.status(500).send('Erreur lors de la génération du PDF');
    }
  });

  app.get("/inventory/:deviceId", async (req, res) => {
    const { deviceId } = req.params;

    const docRef = db.collection("inventory").doc(deviceId);
    const doc = await docRef.get();

    res.status(200).send(doc.data());
  });

  app.get("/categories", async (req, res) => {
    const snapshot = await db.collection("inventoryCategories").get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    try {
      res.status(200).send(documents);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post("/addDevice", async (req, res) => {
    const { label, price, acquisitiondate, campus, storage, image, condition, description } = req.body;

    try {
      await db.collection("inventory").doc().set({
        label: label,
        price: price,
        acquisitiondate: acquisitiondate,
        campus: campus,
        storage: storage,
        image: image,
        condition: condition,
        description: description,
        createdAt: new Date(),
        createdBy: user.ref,
      });

      res.send("Document successfully written!");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.put("/inventory/modify/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    const { label, price, acquisitiondate, campus, storage, image, condition, description, lastModifiedBy } =
      req.body;

    console.log(req.body);

    try {
      await db.collection("inventory").doc(deviceId).update({
        label: label,
        price: price,
        acquisitiondate: acquisitiondate,
        campus: campus,
        storage: storage,
        image: image,
        condition: condition,
        description: description,
        lastModifiedBy: lastModifiedBy,
        lastModifiedAt: new Date(),
      });

      res.send("Document successfully updated!");
    } catch (err) {
      res.send(err);
    }
  });

  // app.put("/inventory/edit", async (req, res) => {
  //   try {
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  app.delete("/inventory/delete/:deviceId", async (req, res) => {
    const { deviceId } = req.params;

    try {
      await db.collection("inventory").doc(deviceId).delete();
      res.send("Document successfully deleted!");
    } catch (err) {
      res.send(err);
    }
  });

  app.put("/inventory/edit/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    const { label, price, acquisitiondate, campus, storage, condition, description, lastModifiedBy } = req.body;

    let updatedStatus = status;
    if (status === "Disponible") {
      updatedStatus = "available";
    } else if (status === "Emprunté") {
      updatedStatus = "borrowed";
    } else if (status === "En réparation") {
      updatedStatus = "inrepair";
    } else if (status === "Indisponible") {
      updatedStatus = "unavailable";
    } else if (status === "Demandé") {
      updatedStatus = "requested";
    }

    try {
      await db.collection("inventory").doc(deviceId).update({
        label: label,
        price: price,
        acquisitiondate: acquisitiondate,
        campus: campus,
        storage: storage,
        condition: condition,
        description: description,
        lastModifiedBy: lastModifiedBy,
        lastModifiedAt: new Date(),
      });

      res.send("Document successfully updated!");
    } catch (err) {
      console.log(err);
    }
  });

  // requests

  app.put("/inventory/makerequest/:category/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.body;

    try {
      const deviceRef = await db.collection("inventory").doc(deviceId);
      const requestRef = await db.collection("inventory_requests").doc();

      await deviceRef.update({
        status: "requested",
        lastRequestId: requestRef.id,
      });

      await requestRef.set({
        deviceId: deviceId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
        requester: user.ref,
        reason: new Text(),
        status: "pending",
      });

      res.send("Request successfully made!");
    } catch (err) {
      res.send(err);
    }
  });

  app.get("/inventory/requests/:deviceId", async (req, res) => {
    const { deviceId } = req.params;

    const snapshot = await db
      .collection("inventory_requests")
      .where("deviceId", "==", deviceId)
      .get();

    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).send(documents);
  });

  app.put("/inventory/acceptrequest/:deviceId/:requestId", async (req, res) => {
    const { deviceId, requestId } = req.params;

    try {
      const deviceRef = await db.collection("inventory").doc(deviceId);
      const requestRef = await db
        .collection("inventory_requests")
        .doc(requestId);

      await deviceRef.update({
        status: "borrowed",
        // lastRequestId: null,
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
    const { deviceId, requestId } = req.params;

    try {
      const deviceRef = await db.collection("inventory").doc(deviceId);
      const requestRef = await db
        .collection("inventory_requests")
        .doc(requestId);

      await deviceRef.update({
        status: "available",
        lastRequestId: null,
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
    const { deviceId, requestId } = req.params;

    const doc = await db
      .collection("inventory")
      .doc(deviceId)
      .collection("requests")
      .doc(requestId)
      .get();

    res.status(200).send(doc.data());
  });

  app.get("/inventory/request/:requestId", async (req, res) => {
    const { requestId } = req.params;

    const doc = await db.collection("inventory_requests").doc(requestId).get();
    // console.log(doc.data());
    res.status(200).send({ ...doc.data(), id: doc.id });
  });

  app.put("/inventory/request/:requestId", async (req, res) => {
    const { requestId } = req.params;
    const { returned, returnDate, admin } = req.body;

    try {
      const requestRef = await db
        .collection("inventory_requests")
        .doc(requestId);

      await requestRef.update({
        returned: startDate,
        endDate: endDate,
        admin: admin,
      });
    } catch (err) {
      res.send(err);
    }
  });

  ws.on("request", function (request) {
    const connection = request.accept(null, request.origin);

    connection
      ? console.log("WebSocket admin inventory open")
      : console.log("error");

    db.collection("inventory").onSnapshot(
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        connection.sendUTF(JSON.stringify(documents));
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );

    connection.on("close", function () {
      console.log("WebSocket admin inventory closed");
    });
  });
};