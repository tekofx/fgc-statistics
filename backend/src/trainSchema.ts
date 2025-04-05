import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
    parada: {
        type: String,
        required: true,
    },
});

const trainSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    line: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    nextStops: [
        {
            type: stopSchema,
            required: true,
        }
    ],
    occupation:{
        type: Number,
        required: true,
    }

})

export default trainSchema;