const { db } = require("../firebase");

const getStudents = async (req, res) => {
    const { classStudents } = req.params;
    const snapshot = await db.collection("users").where('class', '==', classStudents).get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(documents);

}

const sendGroups = async (req, res) => {
    try {
        const newGroupRef = db.collection("groups").doc();
        await newGroupRef.set({
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            students: req.body.students,
            po_id: req.body.po_id,
        });

        res.status(200).send("Groups successfully added!");
    } catch (error) {
        res.status(500).send(error);
    }
}


module.exports = { getStudents,sendGroups }