import {BarChart} from "@mantine/charts";
import {useFetch, useViewportSize} from "@mantine/hooks";
import config from "../config.ts";
import {Alert, Autocomplete, Button} from "@mantine/core";
import {IconAlertTriangle, IconReload} from "@tabler/icons-react";
import TimeData from "../interface/timeData.ts";
import {useState} from "react";
import {IStopCodeResponse} from "../interface/IStopCodeResponse.ts";

export default function TimeChart() {
    const {width} = useViewportSize()
    const [stopCode, setStopCode] = useState<string>('');

    const {data: occupationData, loading: loadingOccupation, error: errorOccupation, refetch} = useFetch<TimeData[]>(
        stopCode !== ''
            ? `${config.BACKEND_URL}/occupation?nextStop=${stopCode}`
            : `${config.BACKEND_URL}/occupation`
    );

    const {data: stopCodeResponse, loading: loadingStopCodes, error: errorStopCodes} = useFetch<IStopCodeResponse>(
        'https://dadesobertes.fgc.cat/api/explore/v2.1/catalog/datasets/codigo-estaciones/records?order_by=nom_estacio&limit=-1'
    );

    const handleStopCodeChange = async (value: string) => {
        const selectedStop = stopCodeResponse?.results.find((stopCode) => stopCode.nom_estacio === value);

        if (selectedStop) {
            setStopCode(selectedStop.inicials);
            await refetch();
        }
    };


    return (
        <>
            {!loadingStopCodes && !errorStopCodes && (

                /*TODO: Remove value and label and only set an array of nom_estacio.
                   Warning: Monistrol de Montserrat is duplicated and gives an error
                * */
                <Autocomplete
                    label="Next Stop"
                    onChange={handleStopCodeChange}
                    data={stopCodeResponse?.results.map((stopCode) => ({
                        value: stopCode.inicials,
                        label: stopCode.nom_estacio, // Add the label property
                    }))}
                />
            )}
            <Button loaderProps={{type: "dots"}} loading={loadingOccupation} leftSection={<IconReload/>}
                    onClick={refetch}>Reload</Button>
            {
                errorOccupation != null && errorOccupation.message && !loadingOccupation ? (
                    <Alert title="Error" color="red" icon={<IconAlertTriangle/>}>
                        {errorOccupation.message}
                    </Alert>
                ) : null
            }
            <BarChart
                h={300}
                w={width - 350}
                unit="%"
                yAxisProps={{domain: [0, 100]}}
                data={occupationData || []}
                dataKey="hour"
                series={[
                    {name: 'averageOccupation', color: 'violet.6'},
                ]}/>
        </>
    )

}