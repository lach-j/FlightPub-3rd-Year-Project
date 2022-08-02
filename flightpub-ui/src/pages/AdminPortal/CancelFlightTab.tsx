import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button, Center,
    Divider,
    Heading,
    HStack,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import {Airline, ColumnDefinition, Flight, Price} from "../../models";
import {httpGet} from "../../services/ApiService";
import {endpoints} from "../../constants/endpoints";
import {ResultsTable} from "../../components/CancelFlightsTable";
import {convertMinsToHM, formatDateTime} from "../../utility/formatting";
import {airlines} from "../../data/airline";
import {Airport, findNearestAirport} from "../../utility/geolocation";


export const CancelFlightTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void } ) => {
    //recommended : contains data table of cheapest flights based on user location
    const [recommended, setRecommended] = useState<Flight[]>([]);

    //userLocation: Uses geoLocation to store users current position
    const [userLocation, setUserLocation] = useState<any>();

    //airport: User's nearest airport for reccomendations
    const [airport, setAirport] = useState<Airport | undefined>();

    //airlines : list of all airlines from models/Airline
    const [airlines, setAirlines] = useState<Airline[]>([]);


    //takes price and returns cheapest price value as a string
    const getMinPriceString = (prices: Price[]) => {
        if (!prices) return '---';
        let pricesVals = prices.map(p => p.price);
        let minPrice = Math.min(...pricesVals);
        return `$${minPrice}`;
    };

    //Gets users current position and retrieves list of airlines
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => setUserLocation(position.coords));
        httpGet(endpoints.airlines)
            .then(setAirlines);
    }, []);

    //Takes user location and finds nearest airport on load
    useEffect(() => {
        if (!userLocation) return;
        let airport = findNearestAirport([userLocation.longitude, userLocation.latitude]);
        setAirport(airport);
    }, [userLocation]);

// Defines columns for DataTable in correct format
    const columns: ColumnDefinition<any>[] = [
        {
            accessor: 'id',
            Header: 'Unique Id',
        },
        {
            accessor: 'airlineCode',
            Header: 'Airline',
            transform: value => airlines.find(a => a.airlineCode === value)?.airlineName || value,
        },
        { accessor: 'departureLocation.airport', Header: 'Departure Airport' },
        { accessor: 'departureTime', Header: 'Departure Time', transform: formatDateTime },
        { accessor: 'arrivalTime', Header: 'Arrival Time', transform: formatDateTime },
        { accessor: 'arrivalLocation.airport', Header: 'Destination Airport' },
        { accessor: 'stopOverLocation.airport', Header: 'Stop Over', transform: (value: any) => value || '---' },
        { accessor: 'prices', Header: 'Price', transform: getMinPriceString },
        { accessor: 'duration', Header: 'Duration', transform: (value: any) => convertMinsToHM(value) },
    ];

    //Gets airport code for nearest airport on-load to run reccomended search query
    useEffect(() => {
        if (!airport) return;
        httpGet(endpoints.recommended + '/' + airport.code)
            .then(setRecommended);
    }, [airport]);


    return (
        <>
            <Heading mb='1em'>Cancel Flight</Heading>
            <Center>
                <ResultsTable columns={columns} data={recommended} keyAccessor='id'>
                </ResultsTable>
            </Center>
        </>
    )
}