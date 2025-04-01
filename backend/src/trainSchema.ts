import mongoose from "mongoose";

const trainSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
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
    occupation:{
        type: Number,
        required: true,
    }

})

export default trainSchema;