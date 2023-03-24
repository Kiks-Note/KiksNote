module.exports = (app, db, user, ws, parse, fs, moment) => {
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
    const {
      label,
      price,
      acquisitiondate,
      campus,
      storage,
      image,
      condition,
      description,
    } = req.body;

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
    const {deviceId} = req.params;
    const {
      label,
      price,
      acquisitiondate,
      campus,
      storage,
      image,
      condition,
      description,
      lastModifiedBy,
    } = req.body;

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
    const {deviceId} = req.params;

    try {
      await db.collection("inventory").doc(deviceId).delete();
      res.send("Document successfully deleted!");
    } catch (err) {
      res.send(err);
    }
  });

  app.put("/inventory/edit/:deviceId", async (req, res) => {
    const {deviceId} = req.params;
    const {
      label,
      price,
      acquisitiondate,
      campus,
      storage,
      condition,
      description,
      lastModifiedBy,
    } = req.body;

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
    const {deviceId} = req.params;
    const {startDate, endDate} = req.body;

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
        status: "pending",
      });

      res.send("Request successfully made!");
    } catch (err) {
      res.send(err);
    }
  });

  app.get("/inventory/requests/:deviceId", async (req, res) => {
    const {deviceId} = req.params;

    const snapshot = await db
      .collection("inventory_requests")
      .where("deviceId", "==", deviceId)
      .get();

    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    res.status(200).send(documents);
  });

  app.put("/inventory/acceptrequest/:deviceId/:requestId", async (req, res) => {
    const {deviceId, requestId} = req.params;

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
    const {deviceId, requestId} = req.params;

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
    const {deviceId, requestId} = req.params;

    const doc = await db
      .collection("inventory")
      .doc(deviceId)
      .collection("requests")
      .doc(requestId)
      .get();

    res.status(200).send(doc.data());
  });

  app.get("/inventory/request/:requestId", async (req, res) => {
    const {requestId} = req.params;

    const doc = await db.collection("inventory_requests").doc(requestId).get();
    // console.log(doc.data());
    res.status(200).send({...doc.data(), id: doc.id});
  });

  app.put("/inventory/request/:requestId", async (req, res) => {
    const {requestId} = req.params;
    const {returned, returnDate, admin} = req.body;

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

  app.post("/write-to-file", (req, res) => {
    const data = require("./categories.json");
    const {label, value} = req.body;

    const updatedData = [
      ...data,
      {
        id: data[data.length - 1].id + 1,
        label: label,
        value: value,
      },
    ];

    fs.writeFile("./categories.json", JSON.stringify(updatedData), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Successfully Written to File.");
    });
    res.json({message: "Successfully Written to File."});
  });

  app.post("/modify-file", (req, res) => {
    const data = require("./categories.json");
    const {id, label, value} = req.body;

    const updatedData = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          label: label,
          value: value,
        };
      }
      return item;
    });

    fs.writeFile("./categories.json", JSON.stringify(updatedData), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Successfully Written to File.");
    });
    res.json({message: "Successfully Written to File."});
  });

  app.delete("/delete-from-file/:id", (req, res) => {
    const data = require("./categories.json");
    const {id} = req.params;

    const findIndex = data.findIndex((item) => item.id === parseInt(id));

    if (findIndex !== -1) {
      data.splice(findIndex, 1);

      fs.writeFile("./categories.json", JSON.stringify(data), (err) => {
        if (err) {
          console.log(err);
        }
        console.log("Successfully Written to File.");
      });
    }
  });

  ws.on("request", function (request) {
    const connection = request.accept(null, request.origin);
    const {pathname} = parse(request.httpRequest.url);

    console.log(pathname);

    connection ? console.log("WebSocket admin open") : console.log("error");

    if (pathname === "/adminInventory") {
      db.collection("inventory")
        .orderBy("createdAt", "desc")
        .onSnapshot(
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
    }

    if (pathname === "/todayRequests") {
      db.collection("inventory_requests")
        .where("createdAt", "<=", new Date())
        .where("status", "==", "pending")
        .onSnapshot(
          (snapshot) => {
            const request = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            db.collection("inventory").onSnapshot((snapshot) => {
              const borrowed = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

              const todayRequests = request.map((req) => {
                const device = borrowed.find(
                  (device) => device.id === req.deviceId
                );
                return {request: req, device: device};
              });

              connection.sendUTF(JSON.stringify(todayRequests));
            });
          },
          (err) => {
            console.log(`Encountered error: ${err}`);
          }
        );
    }

    if (pathname === "/adminBorrowedList") {
      db.collection("inventory")
        .where("status", "==", "borrowed")
        .onSnapshot(
          (snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            db.collection("inventory_requests")
              .where("status", "==", "accepted")
              .onSnapshot(
                (snapshot) => {
                  const requests = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));

                  const borrowedWithRequests = documents.map((doc) => {
                    const request = requests.find(
                      (request) => request.deviceId === doc.id
                    );
                    return {device: doc, request: request};
                  });

                  connection.sendUTF(JSON.stringify(borrowedWithRequests));
                },
                (err) => {
                  console.log(`Encountered error: ${err}`);
                }
              );
          },
          (err) => {
            console.log(`Encountered error: ${err}`);
          }
        );
    }
    if (pathname === "/categories") {
      const data = require("./categories.json");
      connection.sendUTF(JSON.stringify(data));
    }

    connection.on("close", function () {
      console.log("WebSocket admin closed");
    });
  });
};
