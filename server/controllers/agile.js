const { auth, db } = require("../firebase");


const addImpactMapping = async (req, res) => {
    if (!req.body || !req.body.actors || !req.body.deliverables || !req.body.goals || !req.body.impacts) {
        res.status(400).send({ message: "Missing required fields" });
        return;
    }
    console.log(req.params.dashboardId);
    try {
        await db
            .collection("dashboard")
            .doc(req.params.dashboardId)
            .collection("agile")
            .doc("impact_mapping")
            .update({
                actors: req.body.actors,
                deliverables: req.body.deliverables,
                goals: req.body.goals,
                impacts: req.body.goals
            });
        res.status(200).send({ message: "Impact mapping added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
};

const getImpactMapping = async () => {
    try {
        const data = await db
            .collection("dashboard")
            .doc(req.params.dashboardId)
            .collection("agile")
            .doc("impact_mapping")
            .get();
        if (data.exists) {
            return data.data();
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Server error for impact mapping" });
    }

}
module.exports = {
    addImpactMapping,
    getImpactMapping
};