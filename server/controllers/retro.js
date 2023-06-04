const { db } = require("../firebase");

console.log("in retro controller");

const addRetro = async (req, res) => {
  // Implementation of adding retro logic
  res.json({ message: "addRetro works!" });

  const tabRetro = {
    dataRetro: req.body.dataRetro,
    idUser: req.body.idUser
  };

  //const tabRetro = [req.body.dataRetro]
  console.log(tabRetro);

  //tabRetro.push(req.body.idUser)

  db.collection("retro").doc().set(tabRetro);

};

const getAll = async (req, res) => {
  const allRetrosQuery = await db.collection("retro").get()

  let allRetros = []
  allRetrosQuery.forEach((doc) => {
    allRetros.push({ ...doc.data() });
  });

  res.send(allRetros)
  console.log(allRetros);

}

const retroRequests = async (connection) => {
  console.log("in retroRequests");
  db.collection("retro").onSnapshot(
    (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      connection.sendUTF(JSON.stringify(documents));
    },
    (err) => {
      console.log(err);
    }
  );
};

const getRetro = async (req, res) => {
  console.log("in getRetro");
  console.log("in get Retro");
  res.json({ message: "getRetro works!" });
};

const editPostit = async (req, res) => {
  let objetRetro = (await db.collection("retro").doc("YfUR5oFc5rtcGJ1ZQvwS").get()).data()
  objetRetro["dataRetro"][req.body.categorie]["items"][req.body.selectedPostItIndex]["content"] = req.body.postItText
  let dba  = await db.collection("retro").doc("YfUR5oFc5rtcGJ1ZQvwS") 


  dba.update({ dataRetro: objetRetro["dataRetro"] })
  .then(() => {
    console.log("Document updated successfully!");
  })
  .catch((error) => {
    console.error("Error updating document:", error);
  });
  
}

const addPostIt = async (req, res) => {
  let objetRetro = (await db.collection("retro").doc("w3IfzowzetYaNFTnwWDx").get()).data()

  const updatedItems = [...objetRetro["dataRetro"][req.body.columnId].items, req.body.newObjPostIt];
  const updatedColumn = {
    ...objetRetro["dataRetro"][req.body.columnId],
    items: updatedItems,
  };

  let dba  = await db.collection("retro").doc("w3IfzowzetYaNFTnwWDx") 

  objetRetro["dataRetro"] = {
    ...objetRetro["dataRetro"],
    [req.body.columnId]: updatedColumn,
  }

  console.log(objetRetro["dataRetro"]);
  console.log(dba);

  dba.update({ dataRetro: objetRetro["dataRetro"] })
  .then(() => {
    console.log("Document updated successfully!!!!!!!!");
  })
  .catch((error) => {
    console.error("Error updating document:", error);
  });


}

module.exports = {
  addRetro,
  retroRequests,
  getRetro,
  getAll,
  editPostit,
  addPostIt
};
