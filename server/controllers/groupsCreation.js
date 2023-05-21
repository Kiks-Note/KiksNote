const { db } = require("../firebase");
const moment = require("moment");

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
            start_date: moment.unix(Math.floor(new Date(req.body.start_date).valueOf() /1000)).toDate(),
            end_date: moment.unix(Math.floor(new Date(req.body.end_date).valueOf() / 1000)).toDate(),
            students: req.body.students,
            po_id: req.body.po_id,
        });

        res.status(200).send("Groups successfully added!");
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
}


module.exports = { getStudents,sendGroups }