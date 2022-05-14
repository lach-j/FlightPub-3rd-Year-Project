import {
    Text,
    Thead, Table, Tr, Th, Tbody, Td,
} from '@chakra-ui/react';
import {
    TriangleDownIcon, TriangleUpIcon,
} from '@chakra-ui/icons';
import React from 'react';

const columns = [
    {accessor: 'DepartureTime', Header: 'Departure Time'},
    {accessor: 'DepartureAirport', Header: 'Departure Airport'},
]

const flights = [
    {
        "AirlineName" : "KLM-Royal Dutch Airlines",
        "FlightNumber" : "KL1601",
        "DepartureAirport" : "Amsterdam",
        "DepartureCode" : "AMS",
        "StopOverAirport" : null,
        "StopOverCode" : null,
        "DestinationAirport" : "Rome-Fiumicino",
        "ArrivalCode" : "FCO",
        "DepartureTime" : "2022-11-07 09:40:00",
        "ArrivalTimeStopOver" : null,
        "DepartureTimeStopOver" : null,
        "ArrivalTime" : "2022-11-07 11:55:00",
        "Price" : 1140.11
    },
    {
        "AirlineName" : "Finnair",
        "FlightNumber" : "AY782",
        "DepartureAirport" : "Rome-Fiumicino",
        "DepartureCode" : "FCO",
        "StopOverAirport" : null,
        "StopOverCode" : null,
        "DestinationAirport" : "Helsinki",
        "ArrivalCode" : "HEL",
        "DepartureTime" : "2022-10-13 11:20:00",
        "ArrivalTimeStopOver" : null,
        "DepartureTimeStopOver" : null,
        "ArrivalTime" : "2022-10-13 15:45:00",
        "Price" : 766.96
    },
    {
        "AirlineName" : "Emirates Airlines",
        "FlightNumber" : "QR31",
        "DepartureAirport" : "Melbourne",
        "DepartureCode" : "MEL",
        "StopOverAirport" : "Doha",
        "StopOverCode" : "DOH",
        "DestinationAirport" : "Madrid",
        "ArrivalCode" : "MAD",
        "DepartureTime" : "2022-08-27 22:55:00",
        "ArrivalTimeStopOver" : "2022-08-28 06:10:00",
        "DepartureTimeStopOver" : "2022-08-28 07:00:00",
        "ArrivalTime" : "2022-08-28 13:55:00",
        "Price" : 5385.81
    },
    {
        "AirlineName" : "Delta Air Lines",
        "FlightNumber" : "DL8",
        "DepartureAirport" : "San Francisco",
        "DepartureCode" : "SFO",
        "StopOverAirport" : "Atlanta",
        "StopOverCode" : "ATL",
        "DestinationAirport" : "Dubai",
        "ArrivalCode" : "DXB",
        "DepartureTime" : "2022-09-23 13:03:00",
        "ArrivalTimeStopOver" : "2022-09-23 20:45:00",
        "DepartureTimeStopOver" : "2022-09-23 21:35:00",
        "ArrivalTime" : "2022-09-24 19:40:00",
        "Price" : 1311.99
    }
]


export function SearchResultsPage() {
    return (
        <Table>
            <Thead>
                <Tr>
                    {columns.map((column) => <Th>{column.Header}</Th>)}
                </Tr>
            </Thead>
            <Tbody>
                {flights.map((result: any) =>
                    <Tr>
                        {columns.map((column) =>
                            <Td>{result[column.accessor]}</Td>
                        )}
                    </Tr>
                )}
            </Tbody>
        </Table>
    )
}