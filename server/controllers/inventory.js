const {db, FieldValue} = require("../firebase");
const {parse} = require("url");
const moment = require("moment");

const inventory = async (req, res) => {
  const docRef = db.collection("inventory");
  const snapshot = await docRef.orderBy("createdAt").get();
  const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

  try {
    res.status(200).send(documents);
  } catch (err) {
    res.status(500).send(err);
  }
};

const inventoryDeviceId = async (req, res) => {
  const {deviceId} = req.params;

  const docRef = db.collection("inventory").doc(deviceId);
  const doc = await docRef.get();

  res.status(200).send(doc.data());
};

const addDevice = async (req, res) => {
  const {
    label,
    price,
    acquisitiondate,
    campus,
    storage,
    image,
    condition,
    description,
    reference,
    category,
    createdBy,
  } = req.body;

  try {
    await db
      .collection("inventory")
      .doc()
      .set({
        label: label,
        price: parseFloat(price),
        acquisitiondate: new Date(acquisitiondate),
        campus: campus,
        storage: storage,
        image: image,
        condition: condition,
        description: description,
        createdAt: new Date(),
        category: category,
        reference: reference,
        createdBy: createdBy,
        status: "available",
      });

    res.send("Document successfully written!");
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateDevice = async (req, res) => {
  const {deviceId} = req.params;
  const {
    label,
    price,
    // acquisitiondate,
    campus,
    storage,
    image,
    condition,
    description,
    reference,
    category,
    status,
    lastModifiedBy,
  } = req.body;

  // console.log(req.body);

  try {
    await db.collection("inventory").doc(deviceId).update({
      label: label,
      price: price,
      // acquisitiondate: new Date(acquisitiondate),
      campus: campus,
      storage: storage,
      image: image,
      condition: condition,
      description: description,
      reference: reference,
      category: category,
      status: status,
      lastModifiedBy: lastModifiedBy,
      lastModifiedAt: new Date(),
    });

    res.send("Document successfully updated!");
  } catch (err) {
    res.send(err);
  }
};

const deleteDevice = async (req, res) => {
  const {deviceId} = req.params;

  try {
    await db.collection("inventory").doc(deviceId).delete();
    res.send("Document successfully deleted!");
  } catch (err) {
    res.send(err);
  }
};

const makeRequest = async (req, res) => {
  const {deviceId} = req.params;
  const {startDate, endDate, requestReason, persons, requesterId} = req.body;
  console.log(requesterId);

  if (requesterId === undefined) {
    return res.status(500).send("You must be logged in to make a request");
  }

  try {
    const deviceRef = db.collection("inventory").doc(deviceId);
    const requestRef = db.collection("inventory_requests").doc();

    const d = deviceRef.update({
      status: "requested",
      lastRequestId: requestRef.id,
    });

    const r = requestRef.set({
      deviceId: deviceId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdAt: moment().format("DD/MM/YYYY"),
      requesterId: requesterId,
      reason: requestReason,
      group: persons,
      status: "pending",
    });

    await Promise.all([d, r]);

    res.status(200).send("Request successfully made!");
  } catch (err) {
    res.status(500).send(err);
  }
};

const deviceRequests = async (req, res) => {
  const {deviceId} = req.params;

  const snapshot = await db
    .collection("inventory_requests")
    .where("deviceId", "==", deviceId)
    .get();

  const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

  res.status(200).send(documents);
};

const acceptRequest = async (req, res) => {
  const {deviceId, requestId} = req.params;

  try {
    const deviceRef = await db.collection("inventory").doc(deviceId);
    const requestRef = await db.collection("inventory_requests").doc(requestId);

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
};

const rejectRequest = async (req, res) => {
  const {deviceId, requestId} = req.params;

  try {
    const deviceRef = await db.collection("inventory").doc(deviceId);
    const requestRef = await db.collection("inventory_requests").doc(requestId);

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
};

const getRequests = async (req, res) => {
  const {requestId} = req.params;
  const doc = await db.collection("inventory_requests").doc(requestId).get();
  res.status(200).send({...doc.data(), id: doc.id});
};

const updateRequest = async (req, res) => {
  const {requestId} = req.params;
  const {returned, returnDate, admin} = req.body;

  try {
    const requestRef = db.collection("inventory_requests").doc(requestId);

    await requestRef.update({
      returned: startDate,
      endDate: endDate,
      admin: admin,
    });
  } catch (err) {
    res.send(err);
  }
};

const getCategories = async (req, res) => {
  const doc = await db
    .collection("inventoryCategories")
    .doc("7UKjabIg2uFyz1504U2K")
    .get();

  res.status(200).send(doc.data().labels);
};

const addCategory = async (req, res) => {
  const {category} = req.body;

  const doc = await db
    .collection("inventoryCategories")
    .doc("7UKjabIg2uFyz1504U2K")
    .get();

  if (!category) return res.status(400).send("Veuillez entrer une catégorie");
  if (doc.data().labels.includes(category))
    return res.status(400).send("Cette catégorie existe déjà");

  try {
    const docRef = db
      .collection("inventoryCategories")
      .doc("7UKjabIg2uFyz1504U2K");

    await docRef.update({
      labels: FieldValue.arrayUnion(category),
    });

    res.status(200).send("Categorie ajoutée avec succès");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const deleteCategory = async (req, res) => {
  const {category} = req.params;

  if (!category) return res.status(400).send("Veuillez entrer une catégorie");

  try {
    const docRef = db
      .collection("inventoryCategories")
      .doc("7UKjabIg2uFyz1504U2K");

    await docRef.update({
      labels: FieldValue.arrayRemove(category),
    });

    res.status(200).send("Categorie supprimée avec succès");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const updateCategory = async (req, res) => {
  const {oldCategory} = req.params;
  const {newCategory} = req.body;

  console.log(oldCategory, newCategory);

  if (!oldCategory || !newCategory)
    return res.status(400).send("Veuillez entrer une catégorie");

  if (oldCategory === newCategory)
    return res.status(400).send("Veuillez entrer une catégorie différente");

  try {
    const docRef = db
      .collection("inventoryCategories")
      .doc("7UKjabIg2uFyz1504U2K");

    await docRef.update({
      labels: FieldValue.arrayRemove(oldCategory),
    });

    await docRef.update({
      labels: FieldValue.arrayUnion(newCategory),
    });

    res.status(200).send("Categorie modifiée avec succès");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const liveCategories = async (request, connection) => {
  db.collection("inventoryCategories")
    .doc("7UKjabIg2uFyz1504U2K")
    .onSnapshot((snapshot) => {
      connection.sendUTF(JSON.stringify(snapshot.data()));
    });
};

const todayRequests = async (request, connection) => {
  db.collection("inventory_requests")
    .where("createdAt", "<=", moment().format("DD/MM/YYYY"))
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
};

const liveInventory = async (request, connection) => {
  db.collection("inventory").onSnapshot((snapshot) => {
    const inventory = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    connection.sendUTF(JSON.stringify(inventory));
  });
};

const borrowedList = async (request, connection) => {
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
};

module.exports = {
  inventory,
  inventoryDeviceId,
  addDevice,
  updateDevice,
  deleteDevice,
  makeRequest,
  deviceRequests,
  acceptRequest,
  rejectRequest,
  getRequests,
  updateRequest,
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  todayRequests,
  liveCategories,
  liveInventory,
  borrowedList,
};
