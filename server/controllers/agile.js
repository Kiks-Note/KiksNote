const { auth, db } = require("../firebase");


const addImpactMapping = async (req, res) => {
    if (!req) {
        res.send({ messages: "There is nothing to update" });
        return;
    }
    try {
        await db
            .collection("dashboard")
            .doc(req.params.dashboardId)
            .collection("agile")
            .collection("impact_mapping")
            .update({
                actors: req.body.actors,
                deliverables: req.body.deliverables,
                goals: req.body.goals,
                impacts: req.body.goals
            });
    } catch (e) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    addImpactMapping
};