import {AppShell, Burger, Button, Stack} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {IconChartBar, IconTable} from "@tabler/icons-react";
import {Outlet} from "react-router";


export default function Layout() {
    const [opened, {toggle}] = useDisclosure();
    return (
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
                >
                    Chart
                </Button>
                <Button
                    variant="subtle"
                    leftSection={<IconTable/>}
                >
                    Table
                </Button>
            </AppShell.Navbar>

            <AppShell.Main>
                <Stack align="stretch">
                    <Outlet/>
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}