const fs = require('fs');

//express
const express = require('express');
const app = express();

//bodyparser
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongoose
const mongoose = require('mongoose');
const db = require('./database')

mongoose.connect(db.DB, () => {
    console.log("DB Connected")
}, e => console.error(e)
)

//bring in routes
const ip_routes = require('./routes/iproutes');

//apiDocs routing
app.get('/', (req, res) => {
    fs.readFile('apidocs/apiDoc.json', (err, data) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        };
        const docs = JSON.parse(data);
        res.json(docs);
    })
})

//middleware
app.use("/", ip_routes)

const port = 8080;
app.listen(port, () => {console.log(`Server started on port ${port}`)});