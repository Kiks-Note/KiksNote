const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");

console.log("in retro controller");

const addRetro = async (req, res) => {
  try {
    // Implementation of adding retro logic

    const tabRetro = {
      idRetro: uuidv4(),
      titleRetro: req.body.titleRetro,
      courseRetro: req.body.courseRetro,
      dataRetro: req.body.dataRetro,
      idUser: req.body.idUser,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      creationDate: new Date().toISOString()
    };

//    await db.collection("retro").doc().set(tabRetro);

    await db.collection("retro").doc().set(tabRetro)
    .then(() => {
     
      //const message = JSON.stringify({ type: 'retroAdded' });
      //connection.sendUTF(message);
      res.json({ success: true });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ success: false, error: 'Failed to add retro' });
    });

    
    //res.status(200).json({ message: "Retro added successfully" });
  } catch (error) {
    
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAll = async (req, res) => {
  const allRetrosQuery = await db.collection("retro").get()

  let allRetros = []
  allRetrosQuery.forEach((doc) => {
    allRetros.push({ ...doc.data() });
  });

  res.send(allRetros)
  //console.log(allRetros);

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
      console.log("change db");
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

const getRetrosByUser = async (req, res) => {
  let retros = [];
  let colRetro = await db.collection("retro");
  colRetro.onSnapshot((snapshot) => {
    snapshot.docs.map((doc) =>  {
      if (doc.data().idUser == req.params.idUser) {
        retros.push(doc.data())
      }
    });
    res.send(retros)
  });
}

const editPostit = async (req, res) => {

  const snapshot = await db.collection('retro').get()

  console.log(req.body.currentRetroIndex);
  let idRetro = req.body.currentRetroIndex == null ? 0 : req.body.currentRetroIndex

  const idDoc = snapshot.docs[idRetro].id;

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
  // let idRetro = req.body.currentRetroIndex == null ? 0 : req.body.currentRetroIndex
  let currentIdRetro = req.body.idCurrentRetro;

  console.log("id retro = " + currentIdRetro);

  let currentRetro = [];

  try {
    const snapshot = await db.collection("retro").where("idRetro", "==", currentIdRetro).get();
    currentRetro = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));

  
    console.log("Retrieved retroo data:");
    console.log(currentRetro);
  } catch (err) {
    console.error(err);
  }

  console.log(currentRetro);




   const idDocCurrentRetro = currentRetro[0]["id"]

   console.log(idDocCurrentRetro);


  let objetRetro = (await db.collection("retro").doc(idDocCurrentRetro).get()).data()

  const updatedItems = [...objetRetro["dataRetro"][req.body.columnId].items, req.body.newObjPostIt];
  const updatedColumn = {
    ...objetRetro["dataRetro"][req.body.columnId],
    items: updatedItems,
  };

  let currentRetroDb  = await db.collection("retro").doc(idDocCurrentRetro) 

  objetRetro["dataRetro"] = {
    ...objetRetro["dataRetro"],
    [req.body.columnId]: updatedColumn,
  }

  currentRetroDb.update({ dataRetro: objetRetro["dataRetro"] })
  .then(() => {
    console.log("Document updated successfully!!!!!!!!");
  })
  .catch((error) => {
    console.error("Error updating document:", error);
  });

}

const movePostIt = async (req, res) => {

  const snapshot = await db.collection('retro').get()
  let idRetro = req.body.currentRetroIndex == null ? 0 : req.body.currentRetroIndex

  
  const idDoc = snapshot.docs[idRetro].id;

  let objetRetro = snapshot.docs[idRetro].data()

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
  getRetrosByUser,
  getAll,
  editPostit,
  addPostIt,
  movePostIt
};
