import axios from "axios";
import config from "./config.ts";


const axiosInstance = axios.create({
    baseURL: config.BACKEND_URL
})

export default axiosInstance;