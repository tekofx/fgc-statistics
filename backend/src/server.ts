import express from "express";
import {connectDB, fetchData} from "./database";
import trainModel from "./trainModel";
import cors from "cors";
import * as path from "node:path";
import cron from "node-cron";

const app = express();
const port = 1234;


// Middleware
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.get('/data', async (req, res) => {
    await trainModel.find({}).then((data) => {
        res.json(data);
    })
})

app.get("/fetch", async (req, res) => {
    await fetchData();
    await trainModel.find({}).then((data) => {
        res.json(data);
    })
})


// Serve the index.html file in production
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

fetchData()


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    cron.schedule("*/2 * * * *", async () => {
        await fetchData();
    })
})

