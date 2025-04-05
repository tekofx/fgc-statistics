export default interface TrainData {
    _id: string;
    id: string,
    line: string;
    origin: string;
    destination: string;
    occupation: number;
    nextStops: Array<string>;
    time: Date
}