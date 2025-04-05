import {useState} from 'react';
import {Select, Table} from '@mantine/core';
import TrainData from "../interface/trainData.ts";

interface Props {
    trainData: TrainData[];
}

export default function TrainTable({trainData}: Props) {
    const [sortAttribute, setSortAttribute] = useState<keyof TrainData>('id');

    const handleSort = (a: TrainData, b: TrainData) => {
        if (a[sortAttribute] < b[sortAttribute]) return -1;
        if (a[sortAttribute] > b[sortAttribute]) return 1;
        return 0;
    };

    const sortedData = [...trainData].sort(handleSort);

    const rows = sortedData.map((element) => (
        <Table.Tr key={element._id}>
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>{element.line}</Table.Td>
            <Table.Td>{element.origin}</Table.Td>
            <Table.Td>{element.destination}</Table.Td>
            <Table.Td>{element.occupation}</Table.Td>
            <Table.Td>{element.nextStops.toString()}</Table.Td>
        </Table.Tr>
    ));

    const handleSelectChange = (value: string | null) => {
        if (value) {
            setSortAttribute(value as keyof TrainData);
        }
    };

    return (
        <>
            <Select
                label="Sort by"
                value={sortAttribute}
                onChange={handleSelectChange}
                data={[
                    {value: 'id', label: 'Id'},
                    {value: 'line', label: 'Line'},
                    {value: 'origin', label: 'Origin'},
                    {value: 'destination', label: 'Destination'},
                    {value: 'occupation', label: 'Occupation'},
                ]}
            />
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Id</Table.Th>
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