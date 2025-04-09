import {AppShell, Burger, NavLink, Stack} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";
import {IconBorderAll, IconUsers} from "@tabler/icons-react";
import {Outlet, useLocation} from "react-router";


export default function Layout() {
    const [opened, {toggle}] = useDisclosure();
    const location = useLocation()
    console.log(location)
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
                <NavLink
                    label="All data table"
                    href="/"
                    leftSection={<IconBorderAll size={16} stroke={1.5}/>}
                    active={location.pathname === '/'}
                />
                <NavLink
                    label="Occupation Chart"
                    href="/chart"
                    leftSection={<IconUsers size={16} stroke={1.5}/>}
                    active={location.pathname === '/chart'}
                />
            </AppShell.Navbar>

            <AppShell.Main>
                <Stack align="stretch">
                    <Outlet/>
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}