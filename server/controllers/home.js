const { db } = require("../firebase");

const saveWidget = async (req, res) => {
  console.log("yess");
  const userId = req.params.userId;
  const layout = req.body.layout;

  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({ layout });

    res.status(200).json({ message: "Layout saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to save layout." });
  }
};

module.exports = {
  saveWidget
};
