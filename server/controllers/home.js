const { db } = require("../firebase");

const saveWidget = async (req, res) => {
  const userId = req.params.userId;
  const layouts = req.body;

  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({ widgets: layouts });

    res.status(200).json({ message: "Widget saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to save widget." });
  }
};

const getWidget = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ error: "User not found." });
    } else {
      const userData = userDoc.data();
      const widgets = userData.widgets;
      res.status(200).json({ widgets });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve widget." });
  }
};

module.exports = {
  saveWidget,
  getWidget,
};
