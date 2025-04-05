import type {Config} from "./interface/Config";

let config: Config;


if (import.meta.env.PROD) {
    config = {
        BACKEND_URL: "http://backend:1234",
    };
} else {

    config = {
        BACKEND_URL: "http://localhost:1234",
    };
}

export default config;