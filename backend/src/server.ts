import express from "express";
import axios from "axios";
import connectDB from "./database";
import trainModel from "./trainModel";
import TrainData from "./interfaces/trainData";
import cors from "cors";

const fgcApiUrl="https://dadesobertes.fgc.cat/api/explore/v2.1/catalog/datasets/posicionament-dels-trens/records?select=id%2C%20lin%2C%20origen%2C%20desti%2C%20ocupacio_mi_percent&where=lin%20IN%20(%22R5%22%2C%20%22R6%22%2C%20%22S4%22%2C%20%22S8%22)&limit=20"

const app = express();
const port = 1234;

app.use(cors())

connectDB()


app.get('/', async (req, res) => {
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


app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Function to be executed every 5 minutes
const fetchData = async () => {
    try {
        const response = await axios.get(fgcApiUrl);
        const results:Array<TrainData> = response.data.results;
        for (let i = 0; i < results.length; i++) {
            const result = results[i]
            await trainModel.create({
                id: result.id,
                line: result.lin,
                origin: result.origen,
                destination: result.desti,
                time: new Date(),
                occupation: result.ocupacio_mi_percent/100
            })
        }

        console.log('Data fetched:', results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Set interval to run the fetchData function every 5 minutes (300000 milliseconds)
setInterval(fetchData, 300000);