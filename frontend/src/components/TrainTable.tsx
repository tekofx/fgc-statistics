import {useEffect, useState} from 'react';
import {Button, Group, Loader, Select, Table} from '@mantine/core';
import TrainData from "../interface/trainData.ts";
import {useFetch} from "@mantine/hooks";
import config from "../config.ts";

export default function TrainTable() {
    const [sortAttribute, setSortAttribute] = useState<string | null>(null);
    const [filterAttribute, setFilterAttribute] = useState<string | null>(null);
    const [filterOptions, setFilterOptions] = useState<string[]>([]);
    const [filterValue, setFilterValue] = useState<string | null>(null);
    const [url, setUrl] = useState(`${config.BACKEND_URL}/data`);

    // Update the URL whenever filter or sort changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (filterAttribute && filterValue) {
            params.append('filter', `${filterAttribute}=${filterValue}`);
        }
        if (sortAttribute) {
            params.append('sort', sortAttribute);
        }
        setUrl(`${config.BACKEND_URL}/data?${params.toString()}`);
    }, [filterAttribute, filterValue, sortAttribute]);

    const {data, loading, error} = useFetch<TrainData[]>(url);

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

    const handleSortChange = (value: string | null) => {
        setSortAttribute(value);
    };

    const handleFilterAttributeChange = (value: string | null) => {
        setFilterAttribute(value);
        if (value && data) {
            // Extract unique values for the selected attribute
            const uniqueValues = Array.from(new Set(data.map((item) => item[value as keyof TrainData]?.toString() || '')));
            setFilterOptions(uniqueValues);
        } else {
            setFilterOptions([]);
        }
    };

    const handleFilterValueChange = (value: string | null) => {
        setFilterValue(value);
    };

    const onClear = () => {
        setFilterValue(null);
        setFilterAttribute(null);
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
                            label="Sort by"
                            value={sortAttribute}
                            onChange={handleSortChange}
                            data={[
                                {value: 'id', label: 'Id'},
                                {value: 'time', label: 'Time'},
                                {value: 'line', label: 'Line'},
                                {value: 'origin', label: 'Origin'},
                                {value: 'destination', label: 'Destination'},
                                {value: 'occupation', label: 'Occupation'},
                            ]}
                        />
                        <Select
                            label="Filter by"
                            value={filterAttribute}
                            onChange={handleFilterAttributeChange}
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
                                    onChange={handleFilterValueChange}
                                    data={filterOptions.map((option) => ({value: option, label: option}))}
                                    searchable
                                    clearable
                                />
                                <Button onClick={onClear}>Clear</Button>
                            </>
                        )}
                    </Group>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Id</Table.Th>
                                <Table.Th>Time</Table.Th>
                                <Table.Th>Line</Table.Th>
                                <Table.Th>Origin</Table.Th>
                                <Table.Th>Destination</Table.Th>
                                <Table.Th>Occupation</Table.Th>
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