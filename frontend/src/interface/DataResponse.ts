import TrainData from "./trainData";

export default interface DataResponse {
    data: TrainData[];
    filters: {
        id: string[];
        time: string[];
        line: string[];
        origin: string[];
        destination: string[];
        occupation: string[];
    };
}