import {useEffect, useState} from 'react';
import {ActionIcon, Button, Group, Loader, Select, Table} from '@mantine/core';
import {IconArrowDown, IconArrowUp, IconSwitchVertical} from '@tabler/icons-react';
import TrainData from "../interface/trainData.ts";
import {useFetch} from "@mantine/hooks";
import config from "../config.ts";

export default function TrainTable() {
    const [sortAttribute, setSortAttribute] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<1 | -1>(1);
    const [filterAttribute, setFilterAttribute] = useState<string | null>(null);
    const [filterOptions, setFilterOptions] = useState<string[]>([]);
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

    const {data, loading, error, refetch} = useFetch<TrainData[]>(url);

    const rows = (data || []).map((element) => (
        <Table.Tr key={element._id}>
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>{element.time.toLocaleString()}</Table.Td>
            <Table.Td>{element.line}</Table.Td>
            <Table.Td>{element.origin}</Table.Td>
            <Table.Td>{element.destination}</Table.Td>
            <Table.Td>{element.occupation}</Table.Td>
            <Table.Td>{element.nextStops.toString()}</Table.Td>
        </Table.Tr>
    ));

    const handleSort = async (attribute: string) => {
        if (sortAttribute === attribute) {
            setSortDirection((prev) => (prev === 1 ? -1 : 1));
        } else {
            setSortAttribute(attribute);
            setSortDirection(1);
        }


        await refetch()
    };

    const renderSortIcon = (attribute: string) => {
        if (sortAttribute === attribute) {
            return (
                <ActionIcon onClick={() => handleSort(attribute)}>
                    {sortDirection === 1 ? <IconArrowUp size={16}/> : <IconArrowDown size={16}/>}
                </ActionIcon>

            )
        }
        return (
            <ActionIcon onClick={() => handleSort(attribute)}>
                <IconSwitchVertical size={16}/>
            </ActionIcon>

        )
    };

    function Render() {
        if (loading) {
            return <Loader size="xl" variant="dots"/>;
        } else if (error) {
            return <div>Error loading data: {error.message}</div>;
        } else {
            return (
                <>
                    <Group grow align="end">
                        <Select
                            label="Filter by"
                            value={filterAttribute}
                            onChange={(value) => setFilterAttribute(value)}
                            data={[
                                {value: 'id', label: 'Id'},
                                {value: 'time', label: 'Time'},
                                {value: 'line', label: 'Line'},
                                {value: 'origin', label: 'Origin'},
                                {value: 'destination', label: 'Destination'},
                                {value: 'occupation', label: 'Occupation'},
                            ]}
                        />
                        {filterAttribute && (
                            <>
                                <Select
                                    label="Filter value"
                                    value={filterValue}
                                    onChange={(value) => setFilterValue(value)}
                                    data={filterOptions.map((option) => ({value: option, label: option}))}
                                    searchable
                                    clearable
                                />
                                <Button onClick={() => setFilterValue(null)}>Clear</Button>
                            </>
                        )}
                    </Group>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Group>
                                        Id
                                        {renderSortIcon('id')}
                                    </Group>
                                </Table.Th>
                                <Table.Th>
                                    <Group>
                                        Time
                                        {renderSortIcon('time')}
                                    </Group>
                                </Table.Th>
                                <Table.Th>
                                    <Group>
                                        Line
                                        {renderSortIcon('line')}
                                    </Group>
                                </Table.Th>
                                <Table.Th>
                                    <Group>
                                        Origin
                                        {renderSortIcon('origin')}
                                    </Group>
                                </Table.Th>
                                <Table.Th>
                                    <Group>
                                        Destination
                                        {renderSortIcon('destination')}
                                    </Group>
                                </Table.Th>
                                <Table.Th>
                                    <Group>
                                        Occupation
                                        {renderSortIcon('occupation')}
                                    </Group>
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