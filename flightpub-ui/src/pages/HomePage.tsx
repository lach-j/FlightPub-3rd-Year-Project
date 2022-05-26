import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Center,
    Grid,
    Heading,
    HStack, position,
    StackDivider,
    Table,
    TableCaption,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
    VStack
} from "@chakra-ui/react";
import logo from '../FlightPubLogo.png';
import { httpGet } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import {Airline, ColumnDefinition, Flight, Price} from '../models';
import * as _ from "lodash";
import {airportsGeoJSON} from "../data/airportsGeoJSON";

export const HomePage = () => {
    const toast = useToast();
    const [recommended, setRecommended] = useState<Flight[]>([]);
    const [userLocation, setUserLocation] = useState<any>();
    const [airport, setAirport] = useState<any>();
    const [airlines, setAirlines] = useState<Airline[]>([]);

    const formatDateTime = (value: string): string => new Date(value).toLocaleString('en-AU', {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
    });

    const getPriceString = (prices: Price[]) => {
        if (!prices) return '';
        let pricesVals = prices.map(p => p.price);
        let minPrice = Math.min(...pricesVals)
        let maxPrice = Math.max(...pricesVals)
        return `$${minPrice}${maxPrice !== minPrice && ` - $${maxPrice}`}`;
    }
    const getSimplePrice = (prices: Price[]) => {
        if (!prices) return '';
        let pricesVals = prices.map(p => p.price);
        let minPrice = Math.min(...pricesVals)
        let maxPrice = Math.max(...pricesVals)
        return `$${minPrice}`;
    }

    function convertMinsToHM(minutes: number) {
        let hours = Math.floor(minutes / 60);

        minutes = minutes % 60;

        return (hours + ' hrs ' + minutes + ' mins');
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => setUserLocation(position.coords));
        httpGet(endpoints.airlines)
            .then(setAirlines);
    }, []);
    useEffect(() => {
        if(!userLocation) return;
        let airport = findNearestAirport([userLocation.longitude, userLocation.latitude]);
        setAirport(airport);
        console.log(airport);
    }, [userLocation]);

    const columns: ColumnDefinition<any>[] = [
        { accessor: 'airlineCode', Header: 'Airline', transform: value => airlines.find(a => a.airlineCode === value)?.airlineName},
        { accessor: 'departureLocation.airport', Header: 'Departure Airport' },
        { accessor: 'departureTime', Header: 'Departure Time', transform: formatDateTime },
        { accessor: 'arrivalTime', Header: 'Arrival Time', transform: formatDateTime },
        { accessor: 'arrivalLocation.airport', Header: 'Destination Airport' },
        { accessor: 'stopOverLocation.airport', Header: 'Stop Over', transform: (value: any) => value || '---' },
        { accessor: 'prices', Header: 'Price', transform: getSimplePrice },
        { accessor: 'duration', Header: 'Duration', transform: (value: any) => convertMinsToHM(value) },
    ];



    const findNearestAirport = (userLocation: [number, number]): GeoJSON.Feature<GeoJSON.Geometry> | undefined => {
        if (!userLocation) return;
        let airports = airportsGeoJSON.features;
        let nearest = airports[0];
        let distance = calculateDistance(userLocation, airports[0].geometry.coordinates);
        airports.slice(1).forEach(airport => {
            let tempDist = calculateDistance(userLocation, airport.geometry.coordinates);
            if (tempDist < distance) {
                distance = tempDist;
                nearest = airport;
            }
        });
        return nearest;
    };

    const calculateDistance = (point1: number[], point2: number[]) => {
        return Math.sqrt(Math.pow(
            (point2[0] - point1[0]),
            2,
        ) + Math.pow(
            (point2[1] - point1[1]),
            2,
        ));
    };



    //TODO: get use location
    useEffect( () => {
        if(!airport) return;
        httpGet(endpoints.recommended + "/"+ airport?.properties?.code)
            .then(setRecommended)
        }, [airport]);


    return (
        <Grid>
            <Center>
                <VStack
                    spacing={2}
                    align='center'
                    divider={<StackDivider borderColor='white'/>}>
                    <Center  backgroundColor='gray.600' maxW="1000px" mx="auto">
                        <img src={logo} alt="Logo" width='1000px'/>
                    </Center>
                    <Box>
                        <form>
                            <Button type="submit" colorScheme="red" width='500px'>
                                Search For a Flight
                            </Button>
                            <Button type="submit" colorScheme="red" width='500px'>
                                I'm Feeling Lucky
                            </Button>
                        </form>
                    </Box>
                    <Heading as='h1' size='lg'>Cheapest flights from {airport?.properties?.city}</Heading>
                    <Center>
                        <Table width='100%'>
                            <TableCaption>Prices subject to change. T&C's apply</TableCaption>
                            <Thead>
                                <Tr>
                                    {columns.map((column) =>
                                        <Th>
                                            <HStack spacing={3}>
                                                <Text>{column.Header}</Text>
                                            </HStack>
                                        </Th>,
                                    )}
                                    <Th>Duration</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {/*TODO OSOSOSOSOSOSOSOSOSOSOSOSOSOSOOSOSOSOSOSOoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}

                                {recommended.map((result: any) =>
                                    <Tr>
                                        {columns.map((column) =>
                                            <Td>{column?.transform ? column.transform(_.get(result, column.accessor)) : _.get(result, column.accessor)}</Td>)}
                                        <Td>
                                            <Button type='button'
                                                    colorScheme='red'
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
                                    </Tr>,
                                )}
                            </Tbody>
                        </Table>
                    </Center>
                </VStack>
            </Center>
        </Grid>
    )
}