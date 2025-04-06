import type {Config} from "./interface/Config";

let config: Config;


if (import.meta.env.PROD) {
    config = {
        BACKEND_URL: "/api",
    };
} else {

    config = {
        BACKEND_URL: "http://localhost:1234/api",
    };
}

export default config;