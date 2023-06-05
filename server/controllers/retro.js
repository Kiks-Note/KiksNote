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

  const snapshot = await db.collection('retro').get()

  console.log(req.body.currentRetroIndex);
  let idRetro = req.body.currentRetroIndex == null ? 0 : req.body.currentRetroIndex

  console.log("TTTTTTTT");
  console.log("idRetro", idRetro);
  console.log("TTTTTTTT");

  const idDoc = snapshot.docs[0].id;

  let objetRetro = (await db.collection("retro").doc(idDoc).get()).data()
  objetRetro["dataRetro"][req.body.categorie]["items"][req.body.selectedPostItIndex]["content"] = req.body.postItText
  let dba  = await db.collection("retro").doc(idDoc) 


  dba.update({ dataRetro: objetRetro["dataRetro"] })
  .then(() => {
    console.log("Document updated successfully!");
  })
  .catch((error) => {
    console.error("Error updating document:", error);
  });
  
}

const addPostIt = async (req, res) => {

  const snapshot = await db.collection('retro').get()
  const idDoc = snapshot.docs[0].id;


  let objetRetro = (await db.collection("retro").doc(idDoc).get()).data()

  const updatedItems = [...objetRetro["dataRetro"][req.body.columnId].items, req.body.newObjPostIt];
  const updatedColumn = {
    ...objetRetro["dataRetro"][req.body.columnId],
    items: updatedItems,
  };

  let dba  = await db.collection("retro").doc(idDoc) 

  objetRetro["dataRetro"] = {
    ...objetRetro["dataRetro"],
    [req.body.columnId]: updatedColumn,
  }

  dba.update({ dataRetro: objetRetro["dataRetro"] })
  .then(() => {
    console.log("Document updated successfully!!!!!!!!");
  })
  .catch((error) => {
    console.error("Error updating document:", error);
  });

}

const movePostIt = async (req, res) => {

  const snapshot = await db.collection('retro').get()
  const idDoc = snapshot.docs[0].id;

  let objetRetro = snapshot.docs[0].data()

  let postItContent = objetRetro["dataRetro"][req.body.source["droppableId"]]["items"][req.body.source["index"]];

  if(objetRetro["dataRetro"][req.body.source["droppableId"]]["items"][req.body.source["index"]]) {
    const indexToRemove = req.body.source["index"];
    objetRetro["dataRetro"][req.body.source["droppableId"]]["items"].splice(indexToRemove, 1);
  } else {
    console.log("not defiiined !!!!");
  }

  const lengthItem = objetRetro["dataRetro"][req.body.destination["droppableId"]]["items"].length;

  if (lengthItem <= 0) {
    objetRetro["dataRetro"][req.body.destination["droppableId"]]["items"][0] = postItContent;  
  } else {
    console.log("plesssssssssss");
    objetRetro["dataRetro"][req.body.destination["droppableId"]]["items"][lengthItem] = postItContent;  
  }
  
  let dba  = await db.collection("retro").doc(idDoc) 

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
  addPostIt,
  movePostIt
};
