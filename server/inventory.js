module.exports = (app, db) => {
  app.get("/inventory", async (req, res) => {
    const docRef = db.collection("inventory").doc("devices");
    const collections = await docRef.listCollections();
    const inventory = [];

    for (const collection of collections) {
      const docs = await collection.get();
      docs.forEach((doc) => {
        inventory.push(doc.data());
      });
    }
    res.send(inventory);
  });

  app.get("/categories", async (req, res) => {
    const docRef = db.collection("inventory").doc("devices_categories");
    const data = await docRef.get();
    // get array of categories
    const categories = data.data().devices_labels;
    res.send(categories);
  });

  app.post("/addDevice", async (req, res) => {
    const { label, reference, category, campus, status, image } = req.body;
    const docRef = db.collection("inventory").doc("devices");
    const collectionRef = docRef.collection(category);
    const newRef = reference.replaceAll(" ", "_");

    if (!collectionRef) {
      // create collection if it doesn't exist
      await docRef.createCollection(category);

      await collectionRef.doc(newRef).set({
        label: label,
        reference: reference,
        category: category,
        campus: campus,
        status: status,
        image: image,
      });
    } else {
      // if dont doc exists, create it else return error
      const doc = await collectionRef.doc(newRef).get();
      if (!doc.exists) {
        await collectionRef.doc(newRef).set({
          label: label,
          reference: reference,
          category: category,
          campus: campus,
          status: status,
          image: image,
        });
        console.log("Document successfully written!");
        return res.send("Document successfully written!");
      } else {
        console.log("Document already exists!");
        return;
      }
    }
  });
};
