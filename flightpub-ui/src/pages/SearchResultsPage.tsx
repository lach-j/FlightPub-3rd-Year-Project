import {
    Text,
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
    Select,
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
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Flex,
    Spacer,
    HStack,
    VStack,
    StackDivider,
} from '@chakra-ui/react';
import {
    TriangleDownIcon, TriangleUpIcon,
} from '@chakra-ui/icons';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import React, { SyntheticEvent, useState } from 'react';

const columns = [
    {accessor: 'AirlineName', Header: 'Airline'},
    {accessor: 'DepartureAirport', Header: 'Departure Airport'},
    {accessor: 'DepartureTime', Header: 'Departure Time'},
    {accessor: 'ArrivalTime', Header: 'Arrival Time'},
    {accessor: "DestinationAirport", Header: 'Destination Airport'},
    {accessor: 'StopOverAirport', Header: 'Stop Over'},
    {accessor: 'Price', Header: 'Price', transform: (value: any) => `$${value}`},
]

const airlines = [
    {
        "AirlineName": "KLM-Royal Dutch Airlines",
    },
    {
        "AirlineName": "Finnair",
    },
    {
        "AirlineName": "Emirates Airlines",
    },
    {
        "AirlineName": "Delta Air lines",
    }
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


function convertMsToHM(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = seconds >= 30 ? minutes + 1 : minutes;
    minutes = minutes % 60;
    // hours = hours % 24;

    return (hours + " hrs " + minutes + " mins");
}

export function SearchResultsPage() {
    const [results, setResults] = useState(flights);
    const [sortField, setSortField] = useState('');
    const [ascendingCol, setAscendingCol] = useState('');
    const [descendingCol, setDescendingCol] = useState('');
    const [ascending, setAscending] = useState(true);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [airlineFilter, setAirlineFilter] = useState('');
    const [durationFilter, setDurationFilter] = useState(180000000);

    const sortByField = (field: string) => {
        let order = -1;

        setAscendingCol('');
        setDescendingCol('');
        setAscendingCol(field);

        if (sortField === field) {
            order = ascending ? -1 : 1;
            setAscending(!ascending);
            if (!ascending) {
                setAscendingCol('');
                setDescendingCol(field);
            }
        }
        setResults([...results.sort((a: any, b: any) => a?.[field] < b?.[field] ? order : -1*order)])
        setSortField(field)
    }

    const filterByPrice = (val: number[]) => {
        setMinPrice(val[0]);
        setMaxPrice(val[1]);
    }

    const filterByAirline = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAirlineFilter(event.target.value);
    }

    const filterByDuration = (val: number) => {
        setDurationFilter(val);
    }

    const sortIcon = (col: string) => {
        if (col === ascendingCol) {
            return (
                <TriangleUpIcon/>
            )
        }
        if (col === descendingCol){
            return (
                <TriangleDownIcon/>
            )
        }
        return;
    }

    const toast = useToast();

    return (
        <div>
             <HStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={10}
                >
                <Box w='300px' pt='30px' pl='30px'>
                    <VStack
                        divider={<StackDivider borderColor='gray.200' />}
                        spacing={10}
                        align='stretch'>
                        <VStack
                            spacing={4}
                            align='stretch'>
                            <Text>Min Price: ${minPrice}</Text>
                            <Text>Max Price: ${maxPrice}</Text>

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
                        </VStack>

                        <VStack
                            spacing={4}
                            align='stretch'>
                            <Text>Max Duration: {durationFilter/3600000} hours</Text>

                            <Slider
                                aria-label='slider-ex-1'
                                onChangeEnd={(val) => filterByDuration(val * 3600000)}
                                min={0}
                                max={50}
                                defaultValue={50}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack/>
                                </SliderTrack>
                                <SliderThumb/>
                            </Slider>
                        </VStack>

                        <VStack
                            spacing={4}
                            align='stretch'>
                            <Text>Airline:</Text>
                            <Select placeholder="No Filter" onChange={filterByAirline}>
                                {airlines.map((airline) =>
                                    <option value={airline["AirlineName"]}>{airline["AirlineName"]}</option>
                                )}
                            </Select>
                        </VStack>
                    </VStack>
                </Box>
                <Center flex='1'>
                    <Table width='90%'>
                        <Thead>
                            <Tr>
                                {columns.map((column) =>
                                    <Th onClick={() => sortByField(column.accessor)}>
                                        <HStack spacing={3}>
                                            <Text>{column.Header}</Text>
                                            {sortIcon(column.accessor)}
                                        </HStack>
                                    </Th>
                                )}
                                <Th>Duration</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {results.filter(function(result) {
                                if (result.Price < minPrice || result.Price > maxPrice) {
                                    return false;
                                }
                                if (airlineFilter !== '') {
                                    if (airlineFilter !== result.AirlineName) {
                                        return false;
                                    }
                                }
                                if ((Date.parse(result.ArrivalTime) - Date.parse(result.DepartureTime)) > durationFilter) {
                                    return false;
                                }
                                return true;
                            }).map((result: any) =>
                                <Tr>
                                    {columns.map((column) =>
                                        <Td>{column?.transform ? column.transform(result[column.accessor]) : result[column.accessor]}</Td>                                    )}
                                    <Td>{convertMsToHM(Date.parse(result.ArrivalTime) - Date.parse(result.DepartureTime))}</Td>
                                    <Td>
                                        <Button type="button"
                                                colorScheme="red"
                                                onClick={() =>
                                                    toast({
                                                        title: 'Success!',
                                                        description:
                                                            'Flight added to cart successfully.',
                                                        status: 'success',
                                                        duration: 9000,
                                                        isClosable: true,
                                                        position: 'top',
                                                    })
                                                }>
                                            Add to Cart
                                        </Button>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </Center>
            </HStack>
        </div>
    )
}