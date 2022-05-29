import React, { useEffect, useState, SetStateAction, Dispatch } from 'react';
import { Box, Button, Center, Grid, Heading, StackDivider, Td, useToast, VStack, Link } from '@chakra-ui/react';
import logo from '../FlightPubLogo.png';
import { httpGet } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airline, ColumnDefinition, Flight, Price } from '../models';
import { Airport, findNearestAirport } from '../utility/geolocation';
import { convertMinsToHM, formatDateTime } from '../utility/formatting';
import { ResultsTable } from '../components/ResultsTable';

export function HomePage({cartState}: {cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>]}) {
  
  const [cart, setCart] = cartState;
  const toast = useToast();
  const [recommended, setRecommended] = useState<Flight[]>([]);
  const [userLocation, setUserLocation] = useState<any>();
  const [airport, setAirport] = useState<Airport | undefined>();
  const [airlines, setAirlines] = useState<Airline[]>([]);

  const getMinPriceString = (prices: Price[]) => {
    if (!prices) return '---';
    let pricesVals = prices.map(p => p.price);
    let minPrice = Math.min(...pricesVals);
    return `$${minPrice}`;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => setUserLocation(position.coords));
    httpGet(endpoints.airlines)
      .then(setAirlines);
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    let airport = findNearestAirport([userLocation.longitude, userLocation.latitude]);
    setAirport(airport);
  }, [userLocation]);

  const columns: ColumnDefinition<any>[] = [
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
            <form>
              <Button type='submit' colorScheme='red' width='500px'>
                Search For a Flight
              </Button>
              <Button type='submit' colorScheme='red' width='500px'>
                I'm Feeling Lucky
              </Button>
            </form>
          </Box>
          <Heading as='h1' size='lg'>Cheapest flights from {airport?.city}</Heading>
          <Center>
            <ResultsTable columns={columns} data={recommended} keyAccessor='id' cartState={[cart, setCart]}>
            </ResultsTable>
          </Center>
        </VStack>
      </Center>
    </Grid>
  );
};