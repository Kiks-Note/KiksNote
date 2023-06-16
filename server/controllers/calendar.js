const { db } = require("../firebase");

const calendarRequest = async (connection) => {
  connection.on("message", async (message) => {
    const userInfo = JSON.parse(message.utf8Data);
    const { class: classId, status, id: userId } = userInfo;

    try {
      let querySnapshot;

      if (status == "etudiant" || status == "pedago") {
       querySnapshot = await db
         .collection("cours")
         .where("courseClass", "array-contains", { id: classId })
         .get();

      } else if (status == "po") {
        querySnapshot = await db.collection("cours").get();
      }

      const data = [];
      querySnapshot.forEach((doc) => {
        if (status === "etudiant" || status == "pedago") {
          data.push({ ...doc.data(), id: doc.id });
        } else if (status === "po" && doc.data().owner.id === userId) {
          data.push({ id: doc.id, ...doc.data() });
        }
      });

      connection.sendUTF(JSON.stringify(data));
    } catch (error) {
      console.log(`Encountered error: ${error}`);
    }
  });
};

const calendarPedago = async (connection) => {
  connection.on("message", async (message) => {
    try {
      const querySnapshot = await db.collection("class").get();

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      connection.sendUTF(JSON.stringify(data));
    } catch (error) {
      console.log(`Encountered error: ${error}`);
    }
  });
};
module.exports = {
  calendarRequest,
  calendarPedago,
};
