const { db } = require("../firebase");

// add new Retro
const addNewRetro = async (req, res) => {
    const { title, cours, type, po } = req.body;

    if(title == null || title == "") {
        return res.status(400).send("Title is required");
    }
    if(cours == null || cours == ""){
        return res.status(400).send("Cours is required");
    }
    if(type == null || type == ""){
        return res.status(400).send("Type is required");
    }
    if(po == null || po == ""){
        return res.status(400).send("PO is required");
    }

    try {
        await db.collection("retro").doc().set({
            title: title,
            cours: cours,
            type: type,
            po: po,
        })
        res.send("Document successfully written!");
    }catch(error){
        res.status(500).send(error); 
    }
}

const getRetro = async (req, res) => {
    // const retro = await db.collection("retro").get();
    // res.send(retro.docs.map((doc) => doc.data()));
    console.log("azeaeza");
}

module.exports = {
    addNewRetro,
    getRetro,
};
