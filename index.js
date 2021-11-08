const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// midware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5p7yt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('doctorSpiral');
        const appointmentsCollection = database.collection('appointments');

        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor  = appointmentsCollection.find(query);
            const appointment = await cursor.toArray();
            res.json(appointment);
        })

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Doctors Spiral");
})


app.listen(port, () => {
    console.log("listening port", port);
})