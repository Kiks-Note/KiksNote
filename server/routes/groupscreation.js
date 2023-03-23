module.exports = () => {
    app.get("/users", (res) => {
        db.collection("users")
            .get()
            .then((snapshot) => {
                let item = {};
                const data = [];
                snapshot.forEach((doc) => {
                    item = doc.data();
                    item["id"] = doc.id;
                    data.push(item);
                });
                res.send(data);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}


