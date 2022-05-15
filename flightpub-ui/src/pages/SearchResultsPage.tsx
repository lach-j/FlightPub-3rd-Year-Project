import {
    Box,
    Button,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    Heading,
    Input,
    Link,
    Stack,
    useToast,
    Thead,
    Table,
    Tr,
    Th,
    Tbody,
    Td,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
} from '@chakra-ui/react';
import {
    TriangleDownIcon, TriangleUpIcon,
} from '@chakra-ui/icons';
import React, { SyntheticEvent, useState } from 'react';
const columns = [
    {accessor: 'AirlineName', Header: 'Airline'},
    {accessor: 'DepartureAirport', Header: 'Departure Airport'},
    {accessor: 'DepartureTime', Header: 'Departure Time'},
    {accessor: 'ArrivalTime', Header: 'Arrival Time'},
    {accessor: "DestinationAirport", Header: 'Destination Airport'},
    {accessor: 'StopOverAirport', Header: 'Stop Over'},
    {accessor: 'Price', Header: 'Price'},
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
    const [results, setResults] = useState(flights);
    const [sortField, setSortField] = useState('DepartureTime');
    const [ascending, setAscending] = useState(true);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);

    const sortByField = (field: string) => {
        let order = -1;
        if (sortField === field) {
            order = ascending ? -1 : 1;
            setAscending(!ascending);
        }
        setResults([...results.sort((a: any, b: any) => a?.[field] < b?.[field] ? order : -1*order)])
        setSortField(field)
    }

    const filterByPrice = (val: number[]) => {
        setMinPrice(val[0]);
        setMaxPrice(val[1]);
    }

    return (
        <div>
            <div>
                Min Price: {minPrice}
                Max Price: {maxPrice}
            </div>
            <RangeSlider
                aria-label={['min', 'max']}
                onChangeEnd={(val) => filterByPrice(val)}
                min={0}
                max={10000}
                defaultValue={[0, 10000]}
            >
                <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
            </RangeSlider>
            <Table>
                <Thead>
                    <Tr>
                        {columns.map((column) =>
                            <Th onClick={() => sortByField(column.accessor)}>
                                {column.Header}
                            </Th>
                        )}
                    </Tr>
                </Thead>
                <Tbody>
                    {results.filter(function(result) {
                        if (result.Price < minPrice || result.Price > maxPrice) {
                            return false;
                        }
                        return true
                    }).map((result: any) =>
                        <Tr>
                            {columns.map((column) =>
                                <Td>{result[column.accessor]}</Td>
                            )}
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </div>
    )
}