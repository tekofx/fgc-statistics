// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import {AppShell, Burger, Button, createTheme, MantineProvider, Stack, Text} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from 'react';
import axiosInstance from "./axiosInstance.ts";
import TrainTable from "./components/TrainTable.tsx";
import {IconChartBar, IconTable} from "@tabler/icons-react";
import TimeChart from "./components/TimeChart.tsx";

const theme = createTheme({
    /** Your theme override here */
});

export default function App() {
    const [opened, {toggle}] = useDisclosure();
    const [data, setData] = useState(null);

    const [modules, setModules] = useState({
        showChart: true,
        showTable: false,
    });
    useEffect(() => {
        axiosInstance.get('/data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const toggleVisibility = (component: keyof typeof modules) => {
        setModules({
            showChart: component === 'showChart',
            showTable: component === 'showTable',
        });
    };

    function showModules() {
        if (!data) {
            return <Text>Loading...</Text>
        }

        if (modules.showChart) {
            return <TimeChart/>
        }
        if (modules.showTable) {
            return (
                <TrainTable/>
            )
        }
    }

    return (<MantineProvider theme={theme} defaultColorScheme="dark">
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {mobile: !opened},
            }}
            padding="md"
        >
            <AppShell.Header>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <div>Logo</div>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Button
                    variant="subtle"
                    leftSection={<IconChartBar/>}
                    disabled={modules.showChart}
                    onClick={() => toggleVisibility('showChart')}
                >
                    Chart
                </Button>
                <Button
                    variant="subtle"
                    leftSection={<IconTable/>}
                    disabled={modules.showTable}
                    onClick={() => toggleVisibility('showTable')}
                >
                    Table
                </Button>

            </AppShell.Navbar>
            <AppShell.Main>
                <Stack align="stretch">


                    {showModules()}
                </Stack>
            </AppShell.Main>
        </AppShell>
    </MantineProvider>)
}

