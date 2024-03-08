const {db, FieldValue} = require("../firebase");
const {parse} = require("url");
const moment = require("moment");
const generatePDF = require("./pdfGenerator");
const path = require("path");

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

const getInventoryStatistics = async (req, res) => {
  const docRef = db.collection("inventory");
  const snapshot = await docRef.orderBy("createdAt").limit(5).get();
  const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

  try {
    res.status(200).json(documents);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Une erreur est survenue lors de la récupération des données.");
  }
};

const getInventoryRequestsStatistics = async (req, res) => {
  const docRef = db.collection("inventory_requests");
  const snapshot = await docRef.orderBy("deviceId").get();
  const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

  try {
    res.status(200).json(documents);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Une erreur est survenue lors de la récupération des données.");
  }
};

const getPdfGenerator = async (req, res) => {
  const docRef = db.collection("inventory");
  const snapshot = await docRef.orderBy("createdAt").get();
  console.log("Snapshot:", snapshot);

  const inventoryData = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  try {
    // if (inventoryData.length === 0) {
    //   return res.status(400).send("Aucun matériel n'a été trouvé");
    // } else {
    generatePDF(inventoryData, res);
    // }
  } catch (err) {
    console.error("Erreur lors de la génération du PDF:", err);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
};

const getPdfGeneratorCampus = async (req, res) => {
  const {campus} = req.params;

  const docRef = db.collection("inventory").where("campus", "==", campus);
  const snapshot = await docRef.orderBy("createdAt").get();

  const inventoryData = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log("Inventory Data:", inventoryData.length);

  try {
    if (inventoryData.length <= 0) {
      return res
        .status(400)
        .send("Aucun matériel n'a été trouvé pour ce campus");
    } else {
      generatePDF(inventoryData, res);
    }
  } catch (err) {
    console.error("Erreur lors de la génération du PDF:", err);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
};

const inventoryLength = async (req, res) => {
  try {
    const docRef = db.collection("inventory");
    const snapshot = await docRef.get();
    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    res.status(200).send({length: documents.length});
  } catch (err) {}
};

const inventoryDeviceId = async (req, res) => {
  try {
    const {deviceId} = req.params;

    const docRef = db.collection("inventory").doc(deviceId);
    const doc = await docRef.get();

    res.status(200).send({...doc.data(), id: doc.id});
  } catch (err) {
    res.status(500).send(err);
  }
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
  const {startDate, endDate, requestReason, persons, requesterId, category} =
    req.body;

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
      createdAt: new Date(),
      requesterId: requesterId,
      reason: requestReason,
      group: persons,
      status: "pending",
      deviceCategory: category,
    });

    await Promise.all([d, r]);

    res.status(200).send("Request successfully made!");
  } catch (err) {
    res.status(500).send(err);
  }
};

const makePreRequest = async (req, res) => {
  const {deviceId} = req.params;

  try {
    const deviceRef = db.collection("inventory").doc(deviceId);
    const requestRef = db.collection("inventory_requests").doc();

    const d = deviceRef.update({
      status: "requested",
      lastRequestId: requestRef.id,
    });

    const r = requestRef.set({
      deviceId: deviceId,
      createdAt: new Date(),
      requesterId: null,
      status: "pending",
    });

    await Promise.all([d, r]);

    res.status(200).send("Request successfully made!");
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
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
  const {admin} = req.body;

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
      accepedBy: admin,
    });

    res.send("Request accepted");
  } catch (err) {
    res.send(err);
  }
};

const rejectRequest = async (req, res) => {
  const {deviceId, requestId} = req.params;
  const {admin} = req.body;

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
      refusedBy: admin,
    });

    res.send("Request refused");
  } catch (err) {
    res.send(err);
  }
};

const returnedRequest = async (req, res) => {
  const {deviceId, requestId} = req.params;
  const {admin} = req.body;

  try {
    const deviceRef = await db.collection("inventory").doc(deviceId);
    const requestRef = await db.collection("inventory_requests").doc(requestId);

    await deviceRef.update({
      status: "available",
      lastRequestId: null,
    });

    await requestRef.update({
      status: "returned",
      returnedAt: new Date(),
      returnedTo: admin,
    });

    res.send("Request returned");
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

const getDeviceRequests = async (req, res) => {
  try {
    const {deviceId} = req.params;

    const snapshot = await db
      .collection("inventory_requests")
      .where("deviceId", "==", deviceId)
      .get();

    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    res.status(200).send(documents);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createIdea = async (req, res) => {
  const {name, url, imageURL, price, description, reason, createdBy} = req.body;

  if (!name || !url || !imageURL || !price || !reason || !createdBy) {
    return res.status(400).send("Veuillez remplir tous les champs");
  }

  // verify url
  // const regex = new RegExp(
  //   "^(https?://)?(www.)?([a-z0-9]+(-[a-z0-9]+)*.)+[a-z]{2,}$"
  // );

  // if (!regex.test(url)) {
  //   return res.status(400).send("Veuillez entrer une url valide");
  // }

  // verify price
  if (isNaN(price)) {
    return res.status(400).send("Veuillez entrer un prix valide");
  } else if (parseFloat(price) <= 0) {
    return res.status(400).send("Veuillez entrer un prix valide");
  }

  try {
    const docRef = db.collection("inventory-ideas").doc();

    await docRef.set({
      url: url,
      imageURL: imageURL,
      name: name,
      price: parseFloat(price.replace(",", ".")),
      description: description,
      reason: reason,
      createdBy: createdBy,
      createdAt: new Date(),
      status: "pending",
    });

    res.status(200).send("Idée d'achat envoyée. Merci ! 😁");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const getNotTreatedIdeas = async (req, res) => {
  try {
    const snapshot = await db
      .collection("inventory-ideas")
      .where("status", "==", "pending")
      .get();

    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    res.status(200).send(documents);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getIdeas = async (req, res) => {
  try {
    const snapshot = await db.collection("inventory-ideas").get();

    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    res.status(200).send(documents);
  } catch (error) {
    res.status(500).send(error);
  }
};

const acceptIdea = async (req, res) => {
  const {id} = req.params;

  try {
    const docRef = db.collection("inventory-ideas").doc(id);

    await docRef.update({status: "accepted"});

    res.status(200).send("Idée acceptée avec succès");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const refuseIdea = async (req, res) => {
  const {id} = req.params;
  console.log(id);

  try {
    const docRef = db.collection("inventory-ideas").doc(id);

    await docRef.update({status: "refused"});

    res.status(200).send("Idée refusée avec succès");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const deleteIdea = async (req, res) => {
  const {id} = req.params;

  try {
    await db.collection("inventory-ideas").doc(id).delete();

    res.status(200).send("Idée supprimée avec succès");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const getIdeaByUser = async (req, res) => {
  try {
    const {userId} = req.params;

    const snapshot = await db
      .collection("inventory-ideas")
      .where("createdBy", "==", userId)
      .get();

    const documents = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    res.status(200).send(documents);
  } catch (error) {
    res.status(500).send("Une erreur est survenue");
  }
};

const makeIdeaComment = async (req, res) => {
  try {
    const {ideaId} = req.params;
    const {comment, userId} = req.body;

    const docRef = db.collection("inventory-ideas").doc(ideaId);

    await docRef.update({
      comments: FieldValue.arrayUnion({
        comment: comment,
        userId: userId,
        createdAt: new Date(),
      }),
    });

    res.status(200).send("Commentaire ajouté avec succès");
  } catch (err) {
    res.status(500).send("Une erreur est survenue");
    console.log(err);
  }
};

const getIdea = async (req, res) => {
  try {
    const {ideaId} = req.params;

    if (!ideaId) {
      return res.status(400).send("Veuillez entrer un id");
    }

    const snapshot = await db.collection("inventory-ideas").doc(ideaId).get();

    res.status(200).send(snapshot.data());
  } catch (error) {
    res.status(500).send("Une erreur est survenue");
  }
};

const liveCategories = async (connection) => {
  db.collection("inventoryCategories")
    .doc("7UKjabIg2uFyz1504U2K")
    .onSnapshot((snapshot) => {
      connection.sendUTF(JSON.stringify(snapshot.data()));
    });
};

const pendingRequests = async (connection) => {
  db.collection("inventory_requests")
    .where("status", "==", "pending")
    .orderBy("createdAt", "desc")
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

const liveInventory = async (connection) => {
  db.collection("inventory").onSnapshot((snapshot) => {
    const inventory = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    connection.sendUTF(JSON.stringify(inventory));
  });
};

const borrowedList = async (connection) => {
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

const getIdeaComments = async (connection) => {
  connection.on("message", (message) => {
    const value = JSON.parse(message.utf8Data).value; // Parse the received message

    try {
      db.collection("inventory-ideas")
        .doc(value)
        .onSnapshot((snapshot) => {
          const idea = snapshot.data();
          connection.sendUTF(JSON.stringify(idea.comments || []));
        });
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  inventory,
  inventoryLength,
  inventoryDeviceId,
  addDevice,
  updateDevice,
  deleteDevice,
  makeRequest,
  makePreRequest,
  makeIdeaComment,
  deviceRequests,
  acceptRequest,
  rejectRequest,
  returnedRequest,
  getRequests,
  updateRequest,
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getDeviceRequests,
  createIdea,
  getNotTreatedIdeas,
  getIdeas,
  acceptIdea,
  refuseIdea,
  deleteIdea,
  getIdeaByUser,
  getIdea,
  pendingRequests,
  getIdeaComments,
  getInventoryStatistics,
  getInventoryRequestsStatistics,
  getPdfGenerator,
  getPdfGeneratorCampus,
  liveCategories,
  liveInventory,
  borrowedList,
};
