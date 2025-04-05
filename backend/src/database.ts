import mongoose from "mongoose";
import config from "./config";
import axios from "axios";
import TrainData from "./interfaces/trainData";
import trainModel from "./trainModel";

const fgcApiUrl = "https://dadesobertes.fgc.cat/api/explore/v2.1/catalog/datasets/posicionament-dels-trens/records?where=lin%20IN%20(%22R5%22%2C%20%22R6%22%2C%20%22S4%22%2C%20%22S8%22)&limit=20"

const connectDB = async () => {
    try {
        await mongoose.connect(`${config.MONGODB_URI}/app`, {});
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

const fetchData = async () => {
    try {
        const response = await axios.get(fgcApiUrl);
        const results: Array<TrainData> = response.data.results;

        // Filter out records older than 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const nextStops = result.properes_parades.split(';').map(item => JSON.parse(item)).map(item => item.parada);

            const existingRecord = await trainModel.findOne({
                line: result.lin,
                origin: result.origen,
                destination: result.desti,
                nextStops: nextStops,
                time: {$gte: thirtyMinutesAgo}
            });

            if (!existingRecord) {
                console.log(`Saving ${result.id} ${result.lin} ${result.origen} ${result.desti} ${nextStops} ${result.ocupacio_mi_percent / 100}`);
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

export {connectDB, fetchData};