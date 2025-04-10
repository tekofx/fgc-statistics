import {useState} from 'react';
import {Button, Group, Loader, Select, Table} from '@mantine/core';
import TrainData from "../interface/trainData.ts";
import {useFetch} from "@mantine/hooks";
import config from "../config.ts";


export default function TrainTable() {

    const {data, loading} = useFetch<TrainData[]>(
        `${config.BACKEND_URL}/data`
    );


    const [sortAttribute, setSortAttribute] = useState<keyof TrainData>('id');
    const [filterAttribute, setFilterAttribute] = useState<keyof TrainData | null>(null);
    const [filterValue, setFilterValue] = useState<string | null>(null);

    const handleSort = (a: TrainData, b: TrainData) => {
        if (a[sortAttribute] < b[sortAttribute]) return -1;
        if (a[sortAttribute] > b[sortAttribute]) return 1;
        return 0;
    };

    const handleFilter = (data: TrainData[]) => {
        if (!filterAttribute || !filterValue) return data;
        return data.filter(item => item[filterAttribute!]?.toString().includes(filterValue));
    };

    const sortedData = handleFilter([...(data || [])].sort(handleSort));
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).replace(',', '');
    };

    const rows = sortedData.map((element) => (
        <Table.Tr key={element._id}>
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>{formatDate(element.time)}</Table.Td>
            <Table.Td>{element.line}</Table.Td>
            <Table.Td>{element.origin}</Table.Td>
            <Table.Td>{element.destination}</Table.Td>
            <Table.Td>{element.occupation}</Table.Td>
            <Table.Td>{element.nextStops.toString()}</Table.Td>
        </Table.Tr>
    ));

    const handleSortChange = (value: string | null) => {
        if (value) {
            setSortAttribute(value as keyof TrainData);
        }
    };

    const handleFilterAttributeChange = (value: string | null) => {
        setFilterAttribute(value as keyof TrainData);
    };

    const handleFilterValueChange = (value: string | null) => {
        setFilterValue(value);
    };

    const onClear = () => {
        setFilterValue(null);
        setFilterAttribute(null);
    }

    const uniqueFilterValues = Array.from(new Set((data || [])
        .map(item => filterAttribute ? item[filterAttribute]?.toString() || '' : '')
        .filter(value => value !== '')
    ));


    function Render() {
        if (loading) {
            return <Loader size="xl" variant="dots"/>;
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
                                    data={uniqueFilterValues.map(value => ({value, label: value}))}
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
            )
        }
    }

    return (
        <Render/>
    )
}