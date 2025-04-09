import {AppShell, Burger, Group, Highlight, NavLink, Stack, Title} from '@mantine/core';
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
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Title order={1}>
                        <Highlight
                            highlight="FGC Statistics"
                            style={{fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit'}}
                            highlightStyles={{
                                backgroundImage:
                                    'linear-gradient(45deg, #92D500, white)',
                                fontWeight: 700,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            FGC Statistics
                        </Highlight>

                    </Title>
                </Group>

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
                    href="/chart/"
                    leftSection={<IconUsers size={16} stroke={1.5}/>}
                    active={location.pathname === '/chart/'}
                />
            </AppShell.Navbar>

            <AppShell.Main>
                <Stack>
                    <Outlet/>
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}