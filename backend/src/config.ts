import {configDotenv} from "dotenv";

export interface Config {
    MONGODB_URI: string;
}

let config: Config;

// Load environment variables from .env file
configDotenv();

config = {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017"
};

export default config;