import mongoose from "mongoose";
import trainSchema from "./trainSchema";

const trainModel=mongoose.model("Train", trainSchema);

export default trainModel;