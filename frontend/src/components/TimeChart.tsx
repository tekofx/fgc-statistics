import {BarChart} from "@mantine/charts";
import {useFetch, useViewportSize} from "@mantine/hooks";
import config from "../config.ts";
import {Alert, Autocomplete, Button, Group} from "@mantine/core";
import {IconAlertTriangle, IconReload} from "@tabler/icons-react";
import TimeData from "../interface/timeData.ts";
import {useState,useEffect} from "react";
import {IStopCodeResponse} from "../interface/IStopCodeResponse.ts";
import {DateInput} from "@mantine/dates";

const BASE_URL = `${config.BACKEND_URL}/occupation`;

export default function TimeChart() {
    const {width} = useViewportSize()

    const [stopCode, setStopCode] = useState<string>('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [url, setUrl] = useState<string>(BASE_URL);


    useEffect(() => {
        const params = new URLSearchParams();

        if (stopCode) {
            params.append("nextStop", stopCode);
        }
        if (fromDate) {
            params.append("from", fromDate.toISOString());
        }
        if (toDate) {
            params.append("to", toDate.toISOString());
        }

        setUrl(`${BASE_URL}?${params.toString()}`);
    }, [stopCode, fromDate, toDate]);
    const {
        data: occupationData,
        loading: loadingOccupation,
        error: errorOccupation,
        refetch
    } = useFetch<TimeData[]>(url);

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

    const handleDateChange = async (date: Date | null, type: 'from' | 'to') => {
        if (type === 'from') {
            setFromDate(date);
        } else {
            setToDate(date);
        }
        console.log(date)
        await refetch();
    }


    return (
        <>
            {!loadingStopCodes && !errorStopCodes && (
                <Group grow>
                    {/*TODO: Remove value and label and only set an array of nom_estacio.
                    Warning: Monistrol de Montserrat is duplicated and gives an error*/}

                    <Autocomplete
                        label="Next Stop"
                        onChange={handleStopCodeChange}
                        data={stopCodeResponse?.results.map((stopCode) => ({
                            value: stopCode.inicials,
                            label: stopCode.nom_estacio, // Add the label property
                        }))}
                    />

                    <DateInput
                        value={fromDate}
                        onChange={(date) => handleDateChange(date, 'from')}
                        label="From"
                    />

                    {
                        fromDate && (
                            <DateInput
                                value={toDate}
                                onChange={(date) => handleDateChange(date, 'to')}
                                label="To"
                            />
                        )
                    }
                </Group>
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