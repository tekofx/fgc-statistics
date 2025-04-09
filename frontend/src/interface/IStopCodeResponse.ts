interface IStopCode {
    linia: string;
    nom_linia: string;
    ordre: number;
    estacio: number;
    inicials: string;
    nom_estacio: string;
}


interface IStopCodeResponse {
    total_count: number;
    results: IStopCode[];
}

export type {IStopCodeResponse, IStopCode}