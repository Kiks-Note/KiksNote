const {db} = require("../firebase");
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
        createdBy: "user.ref",
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

    res.send("Request successfully made!");
  } catch (err) {
    res.send(err);
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

  console.log(doc.data());

  res.status(200).send(doc.data().labels);
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

  // request.on("close", () => {
  //   console.log("Connection closed");
  //   requestsListener();
  // });
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
  todayRequests,
};
