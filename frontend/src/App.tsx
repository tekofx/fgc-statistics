// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import {AppShell, Burger, createTheme, MantineProvider, Text} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from 'react';
import axios from 'axios';
import {BarChart} from "@mantine/charts";

const theme = createTheme({
    /** Your theme override here */
});

export default function App() {
    const [opened, {toggle}] = useDisclosure();
    const [data, setData] = useState(null);
    useEffect(() => {
        axios.get('http://localhost:1234')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    return <MantineProvider theme={theme}>
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

            <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

            <AppShell.Main>
                {data ? (
                    <>
                        <Text>{JSON.stringify(data)}</Text>
                        <BarChart h={300} data={data} dataKey="time" series={[
                            {name: 'occupation', color: 'violet.6'},
                        ]}/>
                    </>
                ) : (
                    <Text>Loading...</Text>
                )}
            </AppShell.Main>
        </AppShell>
    </MantineProvider>;
}