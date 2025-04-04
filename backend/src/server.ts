import express from "express";
import axios from "axios";
import connectDB from "./database";
import trainModel from "./trainModel";
import TrainData from "./interfaces/trainData";
import cors from "cors";
import * as path from "node:path";

const fgcApiUrl = "https://dadesobertes.fgc.cat/api/explore/v2.1/catalog/datasets/posicionament-dels-trens/records?where=lin%20IN%20(%22R5%22%2C%20%22R6%22%2C%20%22S4%22%2C%20%22S8%22)&limit=20"

const app = express();
const port = 1234;

app.use(cors())

connectDB()

app.use(express.static(path.join(__dirname, 'public')));


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


app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const fetchData = async () => {
    try {
        const response = await axios.get(fgcApiUrl);
        const results: Array<TrainData> = response.data.results;

        // Filter out records older than 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const nextStops = result.properes_parades.split(';').map(item => JSON.parse(item));

            const existingRecord = await trainModel.findOne({
                line: result.lin,
                origin: result.origen,
                destination: result.desti,
                nextStops: nextStops,
                time: {$gte: thirtyMinutesAgo}
            });

            if (!existingRecord) {
                await trainModel.create({
                    id: result.id,
                    line: result.lin,
                    origin: result.origen,
                    destination: result.desti,
                    nextStops: nextStops,
                    time: new Date(),
                    occupation: result.ocupacio_mi_percent / 100
                });
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

fetchData()

// Set interval to run the fetchData function every 5 minutes (300000 milliseconds)
setInterval(fetchData, 300000);