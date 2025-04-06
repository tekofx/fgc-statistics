import {BarChart} from "@mantine/charts";
import {useFetch, useViewportSize} from "@mantine/hooks";
import TrainData from "../interface/trainData.ts";
import config from "../config.ts";
import {Alert, Button} from "@mantine/core";
import {IconAlertTriangle, IconReload} from "@tabler/icons-react";

export default function TimeChart() {
    const {width} = useViewportSize()

    const {data, loading, error, refetch} = useFetch<TrainData[]>(
        `${config.BACKEND_URL}/data`
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
                data={data || []}
                dataKey="time"
                series={[
                    {name: 'occupation', color: 'violet.6'},
                ]}/>
        </>
    )

}