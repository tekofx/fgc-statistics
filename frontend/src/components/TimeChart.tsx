import {BarChart} from "@mantine/charts";
import {useFetch, useViewportSize} from "@mantine/hooks";
import config from "../config.ts";
import {Alert, Button} from "@mantine/core";
import {IconAlertTriangle, IconReload} from "@tabler/icons-react";
import TimeData from "../interface/timeData.ts";

export default function TimeChart() {
    const {width} = useViewportSize()

    const {data, loading, error, refetch} = useFetch<TimeData[]>(
        `${config.BACKEND_URL}/time`
    );

    return (
        <>
            <Button loaderProps={{type: "dots"}} loading={loading} leftSection={<IconReload/>}
                    onClick={refetch}>Reload</Button>
            {
                error != null && error.message && !loading ? (
                    <Alert title="Error" color="red" icon={<IconAlertTriangle/>}>
                        {error.message}
                    </Alert>
                ) : null
            }
            <BarChart
                h={300}
                w={width - 350}
                unit="%"
                yAxisProps={{domain: [0, 100]}}
                yMax={100}
                data={data || []}
                dataKey="hour"
                series={[
                    {name: 'averageOccupation', color: 'violet.6'},
                ]}/>
        </>
    )

}