import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Box, Button, Center, Grid, Heading, StackDivider, VStack } from '@chakra-ui/react';
import logo from '../FlightPubLogo.png';
import { httpGet } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airline, ColumnDefinition, Flight, Price } from '../models';
import { Airport, findNearestAirport } from '../utility/geolocation';
import { convertMinsToHM, formatDateTime } from '../utility/formatting';
import { ResultsTable } from '../components/ResultsTable';
import { NavLink } from 'react-router-dom';
import { routes } from '../constants/routes';
import { HolidayCard } from "../components/HolidayCard";
import { HolidayCardProps } from "../models/HolidayCardProps";

export function HolidayPackagesPage({ cartState }: { cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>] }) {

    const data: HolidayCardProps[] = [{
        isPopular: true,
        imageURL:
            'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/7d/68/1d/four-seasons-resort-whistler.jpg?w=600&h=400&s=1',
        name: 'Iconic Canadian Winter in Whistler',
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore',
        tagline: 'Fun filled adventure in the most iconic part of Canada!',
        price: 600,
        nights: 7,
        location: 'Whistler',
        tags: [
            {tagName: 'Winter', tagColor: 'blue'},
            {tagName: 'Scenic', tagColor: 'yellow'},
            {tagName: 'Holiday', tagColor: 'green'}
        ],
    },
        {
            isPopular: false,
            imageURL:
                'https://media-cdn.tripadvisor.com/media/photo-s/1b/f4/64/09/aerial-view.jpg',
            name: 'Maldives Resort and Spa',
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore',
            tagline: 'Surround yourself by deep blue beautiful ocean in the beautiful Maldives',
            price: 450,
            nights: 4,
            location: 'Maldives',
            tags: [
                {tagName: 'Warm', tagColor: 'orange'},
                {tagName: 'Scenic', tagColor: 'yellow'},
                {tagName: 'Holiday', tagColor: 'green'}
            ],
        }];

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
    //TODO: Retrieve list of holiday packages
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

    //Gets airport code for nearest airport on-load to run reccomended search query
    useEffect(() => {
        if (!airport) return;
        httpGet(endpoints.recommended + '/' + airport.code)
            .then(setRecommended);
    }, [airport]);


    return (
        <Grid>
            <Center>
                <VStack
                    spacing={2}
                    align='center'
                    divider={<StackDivider borderColor='white' />}>
                    <Center backgroundColor='gray.600' maxW='1000px' mx='auto'>
                        <img src={logo} alt='Logo' width='1000px' />
                    </Center>
                    <Box>
                        <Button as={NavLink} to={routes.search} colorScheme='red' width='500px'>
                            Search For a Flight
                        </Button>
                    </Box>
                    <Heading as='h1' size='lg'>Holiday Packages and Deals from {airport?.city}</Heading>
                    <VStack>
                        {(data.length!==0) ? (
                            data.map((value) =>
                                (<HolidayCard data={value}></HolidayCard>))) :
                            (<h1>Nothing here, please check back later!</h1>)
                        };
                    </VStack>
                </VStack>
            </Center>
        </Grid>
    );
}
