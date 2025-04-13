import {useEffect, useState} from 'react';
import {ActionIcon, Button, Group, Loader, Select, Table, Text} from '@mantine/core';
import {IconArrowDown, IconArrowUp, IconFilter, IconSwitchVertical} from '@tabler/icons-react';
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

    const headerItem = (attribute: string) => {
        return (
            <Group justify="flex-start" wrap="nowrap" gap="xs" style={{cursor: 'pointer'}}>
                <Text>
                    {attribute}
                </Text>
                <ActionIcon variant="subtle" onClick={() => handleSort(attribute)}>
                    {sortAttribute === attribute ? (
                        sortDirection === 1 ? <IconArrowUp size={16}/> : <IconArrowDown size={16}/>
                    ) : (
                        <IconSwitchVertical size={16}/>
                    )}
                </ActionIcon>
                <ActionIcon variant="subtle" onClick={() => handleSort(attribute)}>
                    <IconFilter size={16}/>
                </ActionIcon>
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
                    <Table style={{width: '100%'}}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    {headerItem('id')}
                                </Table.Th>
                                <Table.Th style={{whiteSpace: 'nowrap', textAlign: 'left'}}>
                                    {headerItem('time')}
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