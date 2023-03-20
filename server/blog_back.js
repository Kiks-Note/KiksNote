module.exports = (app, db) => {
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


    // get all tutos
    app.get("/tutos", async (req, res) => {
        const snapshot = await db.collection('blog_tutos').get();
        res.send(snapshot.docs.map(doc => doc.data()));
        // return snapshot.docs.map(doc => doc.data());
    });

    //get all tutos id
    app.get("/tutos/id", async (req, res) => {
        const snapshot = await db.collection('blog_tutos').get();
        res.send(snapshot.docs.map(doc => doc.id));
        // return snapshot.docs.map(doc => doc.data());
    });


    // get tutos by id
    app.get("/tuto/:id", async (req, res) => {
        const snapshot = await db.collection('blog_tutos').doc(req.params.id).get();
        res.send(snapshot.data());
    });

    // get all comments by tutos id
    app.get("/tuto/:id/comments", async (req, res) => {
        const snapshot = await db.collection('blog_tutos').doc(req.params.id).collection("comment").get();
        res.send(snapshot.docs.map(doc => doc.data()));
    });

    // app.post("/blog/:id/comments", async (req, res) => {
    //     const snapshot = await db.collection('blog_tutos').doc(req.params.id).collection("comment").add(req.body);
    //     res.send(snapshot.data());
    // });

}