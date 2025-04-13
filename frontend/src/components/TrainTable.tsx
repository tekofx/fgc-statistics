import {useEffect, useState} from 'react';
import {ActionIcon, Group, Loader, Menu, Table, Text} from '@mantine/core';
import {IconArrowDown, IconArrowUp, IconFilter, IconSwitchVertical} from '@tabler/icons-react';
import {useFetch} from "@mantine/hooks";
import config from "../config.ts";
import DataResponse from "../interface/DataResponse.ts";

type FilterKeys = 'line' | 'origin' | 'destination' | 'occupation';


export default function TrainTable() {
    const [sortAttribute, setSortAttribute] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<1 | -1>(1);
    const [filterAttribute, setFilterAttribute] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState<string | null>(null);
    const [url, setUrl] = useState(`${config.BACKEND_URL}/data`);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filterAttribute && filterValue) {
            params.append('filter', `${filterAttribute}=${filterValue}`);
        }
        if (sortAttribute) {
            params.append('sort', `${sortAttribute}:${sortDirection}`);
        }

        setUrl(`${config.BACKEND_URL}/data?${params.toString()}`);
        console.log(`${config.BACKEND_URL}/data?${params.toString()}`)

    }, [filterAttribute, filterValue, sortAttribute, sortDirection]);

    const {data, loading, error, refetch} = useFetch<DataResponse>(url);

    const rows = (data?.data || []).map((element) => (
        <Table.Tr key={element._id}>
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>{element.time}</Table.Td>
            <Table.Td>{element.line}</Table.Td>
            <Table.Td>{element.origin}</Table.Td>
            <Table.Td>{element.destination}</Table.Td>
            <Table.Td>{element.occupation}</Table.Td>
            <Table.Td>{element.nextStops}</Table.Td>
        </Table.Tr>
    ));

    const handleSort = async (attribute: FilterKeys) => {
        if (sortAttribute === attribute) {
            setSortDirection((prev) => (prev === 1 ? -1 : 1));
        } else {
            setSortAttribute(attribute);
            setSortDirection(1);
        }


        await refetch()
    };

    function capitalize(str: string): string {
        if (!str) return str; // Handle empty strings
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const headerItem = (attribute: FilterKeys) => {
        return (
            <Group justify="flex-start" wrap="nowrap" gap="xs" style={{cursor: 'pointer'}}>
                <Text>
                    {capitalize(attribute)}
                </Text>
                <ActionIcon variant="subtle" onClick={() => handleSort(attribute)}>
                    {sortAttribute === attribute ? (
                        sortDirection === 1 ? <IconArrowUp size={16}/> : <IconArrowDown size={16}/>
                    ) : (
                        <IconSwitchVertical size={16}/>
                    )}
                </ActionIcon>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant={filterAttribute === attribute ? 'filled' : 'subtle'}>
                            <IconFilter size={16}/>
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Filter</Menu.Label>
                        {
                            data?.filters[attribute] && data.filters[attribute].length > 0 ? (
                                data.filters[attribute].map((option) => (
                                    <Menu.Item
                                        key={option}
                                        disabled={filterValue === option}
                                        onClick={() => {
                                            setFilterValue(option);
                                            setFilterAttribute(attribute);
                                        }}>
                                        <Text>{option}</Text>
                                    </Menu.Item>
                                ))
                            ) : (
                                <Menu.Item disabled>No options available</Menu.Item>
                            )}
                    </Menu.Dropdown>
                </Menu>
            </Group>
        );
    };

    function Render() {
        if (loading) {
            return <Loader size="xl" variant="dots"/>;
        } else if (error) {
            return <div>Error loading data: {error.message}</div>;
        } else {
            return (
                <>
                    <Table style={{width: '100%'}}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    Id
                                </Table.Th>
                                <Table.Th style={{whiteSpace: 'nowrap', textAlign: 'left'}}>
                                    Time
                                </Table.Th>
                                <Table.Th style={{whiteSpace: 'nowrap', textAlign: 'left'}}>
                                    {headerItem('line')}
                                </Table.Th>
                                <Table.Th>
                                    {headerItem('origin')}
                                </Table.Th>
                                <Table.Th>
                                    {headerItem('destination')}
                                </Table.Th>
                                <Table.Th>
                                    {headerItem('occupation')}
                                </Table.Th>
                                <Table.Th>Next Stops</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </>
            );
        }
    }

    return <Render/>;
}