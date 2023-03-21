module.exports = (app, db, ws) => {
    // app.get("/blogs", (req, res) => {
    //     const docs = [];
    //     const comments = [];
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     db.collection("blog_tutos").get().then((snapshot) => {
    //         snapshot.forEach((doc) => {
    //             docs.push(doc.data());
    //             res.send(docs);
    //             doc.ref.collection("comment").get().then((snap) => {
    //                 snap.forEach((com) => {
    //                     comments.push(com.data());
    //                     // res.send(comments);
    //                     // console.log(comments);
    //                 })
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         })
    //     })
    // })

    ws.on("request", (request) => {
        const connection = request.accept(null, request.origin);

        connection
            ? console.log("connection ok")
            : console.log("connection failed");

        db.collection("blog_tutos").onSnapshot(
            (snapshot) => {
                const documents = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                connection.sendUTF(JSON.stringify(documents));
            },
            (err) => {
                console.log(err);
            }
        );
    });

    // get all tutos
    // app.get("/tutos", async (req, res) => {
    //   const snapshot = await db.collection("blog_tutos").get();
    //   res.send(snapshot.docs.map((doc) => doc.data()));
    //   // return snapshot.docs.map(doc => doc.data());
    // });

    //get all tutos id
    app.get("/tutos/id", async (req, res) => {
        const snapshot = await db.collection("blog_tutos").get();
        res.send(snapshot.docs.map((doc) => doc.id));
        // return snapshot.docs.map(doc => doc.data());
    });

    // get tutos by id
    app.get("/tuto/:id", async (req, res) => {
        const snapshot = await db.collection("blog_tutos").doc(req.params.id).get();
        res.send(snapshot.data());
    });

    // get all comments by tutos id
    app.get("/tuto/:id/comments", async (req, res) => {
        const snapshot = await db
            .collection("blog_tutos")
            .doc(req.params.id)
            .collection("comment")
            .get();
        res.send(snapshot.docs.map((doc) => doc.data()));
    });

    //post a new comment on a tutorial
    app.post("/blog/:id/comments", async (req) => {
        await db.collection('blog_tutos').doc(req.params.id).collection('comment').add({
            'content': req.body.message,
            'date': new Date(),
            'user_id': 12,
            'user_status': 'etudiant'
        });
    });

    app.post("/tutos/newtutos", async (req, res) => {
        const { title, description, photo } = req.body;


        if (title == null || title == "") {
            return res.status(400).send("Title is required");
        }
        if (description == null || description == "") {
            return res.status(400).send("Description is required");
        }
        if (photo == null || photo == "") {
            return res.status(400).send("Photo is required");
        }


        try {
            await db.collection("blog_tutos").doc().set({

                title: title,
                description: description,
                photo: photo,

            });
            res.send("Document successfully written!");

        } catch (err) {
            res.status(500).send(err);
        }
    });
};
