import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Box, Button, Center, Grid, Heading, StackDivider, VStack } from '@chakra-ui/react';
import logo from '../FlightPubLogo.png';
import { useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airline, ColumnDefinition, Flight, Price } from '../models';
import { Airport, findNearestAirport } from '../utility/geolocation';
import { convertMinsToHM, formatDateTime } from '../utility/formatting';
import { ResultsTable } from '../components/ResultsTable';
import { NavLink } from 'react-router-dom';
import { routes } from '../constants/routes';

export function HomePage({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) {
  //userLocation: Uses geoLocation to store users current position
  const [userLocation, setUserLocation] = useState<any>();
  useEffect(() => {
    document.title = 'FlightPub - Home';
  });

  //recommended : contains data table of cheapest flights based on user location
  const [recommended, setRecommended] = useState<Flight[]>([]);

  //airport: User's nearest airport for reccomendations
  const [airport, setAirport] = useState<Airport | undefined>();

  //airlines : list of all airlines from models/Airline
  const [airlines, setAirlines] = useState<Airline[]>([]);

  const { httpGet: httpGetAirlines } = useApi(endpoints.airlines);
  const { httpGet: httpGetRecommended } = useApi(endpoints.recommended);

  //takes price and returns cheapest price value as a string
  const getMinPriceString = (prices: Price[]) => {
    if (!prices) return '---';
    let pricesVals = prices.map((p) => p.price);
    let minPrice = Math.min(...pricesVals);
    return `$${minPrice}`;
  };

  //Gets users current position and retrieves list of airlines
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => setUserLocation(position.coords));
    httpGetAirlines('').then(setAirlines);
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
      accessor: 'airlineCode',
      Header: 'Airline',
      transform: (value) => airlines.find((a) => a.airlineCode === value)?.airlineName || value
    },
    { accessor: 'departureLocation.airport', Header: 'Departure Airport' },
    { accessor: 'departureTime', Header: 'Departure Time', transform: formatDateTime },
    { accessor: 'arrivalTime', Header: 'Arrival Time', transform: formatDateTime },
    { accessor: 'arrivalLocation.airport', Header: 'Destination Airport' },
    {
      accessor: 'stopOverLocation.airport',
      Header: 'Stop Over',
      transform: (value: any) => value || '---'
    },
    { accessor: 'prices', Header: 'Price', transform: getMinPriceString },
    { accessor: 'duration', Header: 'Duration', transform: (value: any) => convertMinsToHM(value) }
  ];

  //Gets airport code for nearest airport on-load to run reccomended search query
  useEffect(() => {
    if (!airport) return;
    httpGetRecommended('/' + airport.code).then(setRecommended);
  }, [airport]);

  return (
    <Grid>
      <Center>
        <VStack spacing={2} align='center' divider={<StackDivider borderColor='white' />}>
          <Center backgroundColor='gray.600' maxW='1000px' mx='auto'>
            <img src={logo} alt='Logo' width='1000px' />
          </Center>
          <Box>
            <Button as={NavLink} to={routes.search} colorScheme='red' width='500px'>
              Search For a Flight
            </Button>
          </Box>
          <Heading as='h1' size='lg'>
            Cheapest flights from {airport?.city}
          </Heading>
          <Center>
            <ResultsTable
              columns={columns}
              data={recommended}
              keyAccessor='id'
              cartState={cartState}
            ></ResultsTable>
          </Center>
        </VStack>
      </Center>
    </Grid>
  );
}
