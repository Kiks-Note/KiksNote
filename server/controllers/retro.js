const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");

console.log("in retro controller");

const addRetro = async (req, res) => {
  try {
    // Implementation of adding retro logic

    let tabRetro = {}
    if (req.body.status == "etudiant") {
      tabRetro = {
        idRetro: uuidv4(),
        titleRetro: req.body.titleRetro,
        choosenTeamMates: req.body.choosenTeamMates,
        dataRetro: req.body.dataRetro,
        idUser: req.body.idUser,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        creationDate: new Date().toISOString()
      };
    } else {
      tabRetro = {
        idRetro: uuidv4(),
        titleRetro: req.body.titleRetro,
        courseRetro: req.body.courseRetro,
        dataRetro: req.body.dataRetro,
        idUser: req.body.idUser,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        creationDate: new Date().toISOString()
      };
    }
    
    await db.collection("retro").doc().set(tabRetro)
    .then(() => {
     
      res.json({ success: true });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ success: false, error: 'Failed to add retro' });
    });

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

const getRetroForStudent = async (req,res) => {

  const snapshot = await db.collection('retro').get()


  
  let userInfo = req.params;
  let name  = userInfo["userName"];
  let studentClass = userInfo["userClass"]

  let allRetros = []

  snapshot.forEach((doc) => {
    if (doc.data().choosenTeamMates) {
      doc.data().choosenTeamMates.forEach(
        el => {
          if (name == el.data.firstname + " " + el.data.lastname) {
            allRetros.push(doc.data())
          }
        }
      )      
    } else {
      if (doc.data().courseRetro.courseClass.name.replace(/\s+/g, '').toLowerCase() == studentClass.replace(/\s+/g, '').toLowerCase()) {
        allRetros.push(doc.data())
      }
    }
  });

  res.send(allRetros)
  
}

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

const getTeamMates = async (req, res) => {
  const snapshot = await db.collection('users').get()

  let listTeamMates = [];

  let currentUserPromo = req.params.studentClass.substring(0,2)
  snapshot.forEach((doc) => {
    if (doc.data().status == "etudiant" && typeof doc.data().class == "string" && currentUserPromo == doc.data().class.substring(0,2)) {
      console.log(doc.data().class);
      listTeamMates.push(doc.data())
    }
    

  })

  res.send(listTeamMates)

  
}

const addPostIt = async (req, res) => {

  const snapshot = await db.collection('retro').get()
  let idRetro = req.body.currentRetroIndex == null ? 0 : req.body.currentRetroIndex

  const idDoc = snapshot.docs[idRetro].id;


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
  movePostIt,
  getTeamMates,
  getRetroForStudent
};
