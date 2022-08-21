import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Box, Button, Center, Grid, Heading, HStack, StackDivider, VStack } from '@chakra-ui/react';
import logo from '../FlightPubLogo.png';
import plane from '../HomePageStockShot.jpg';
import { useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airline, ColumnDefinition, Flight, Price } from '../models';
import { Airport, findNearestAirport } from '../utility/geolocation';
import { convertMinsToHM, formatDateTime } from '../utility/formatting';
import { ResultsTable } from '../components/ResultsTable';
import { NavLink } from 'react-router-dom';
import { routes } from '../constants/routes';
import { HolidayPackage } from '../models/HolidayCardProps';
import { HolidayCardSmall } from '../components/HolidayCardSmall';

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
  const [holidayPackageList, setHolidayPackageList] = useState<HolidayPackage[]>([]);

  const { httpGet: httpGetRecommended } = useApi(endpoints.recommended);
  const { httpGet: httpGetHolidayPackages } = useApi(endpoints.holidayPackages);

  //takes price and returns cheapest price value as a string
  const getMinPriceString = (prices: Price[]) => {
    if (!prices) return '---';
    let pricesVals = prices.map((p) => p.price);
    let minPrice = Math.min(...pricesVals);
    return `$${minPrice}`;
  };

  //Gets users current position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => setUserLocation(position.coords));
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
      accessor: 'airline.airlineName',
      Header: 'Airline'
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
    httpGetHolidayPackages('/getByDeparture/' + airport.code).then(setHolidayPackageList);
  }, [airport]);

  return (
    <Grid>
      <Center>
        <VStack spacing={6} align='centre' width='100%'>
          <VStack spacing={0}>
            <Center backgroundColor='#112147' width='100%' mx='auto'>
              <img src={logo} alt='Logo' width='400px' />
            </Center>
            <HStack width='full' spacing={0} bgColor='#112147'>
              <img src={plane} width='62%' />
              <VStack w='38%'>
                <Box bgColor='#112147' color='white' h='100%' p='40px' fontSize='1.5em'>
                  <h1>
                    <b>Welcome to FlightPub!</b>
                  </h1>{' '}
                  <br />
                  <p>
                    Our wide range of luxurious getaways will surely entice you to plan your next
                    trip away from the daily grind. With regular holiday offerings and an advanced
                    map search system, we strive to take the guess work out of booking flights. Safe
                    travels! Your journey awaits!
                  </p>
                </Box>
                `
                <Box>
                  <Button as={NavLink} to={routes.search} colorScheme='red' width='300px'>
                    Search For a Flight
                  </Button>
                </Box>
              </VStack>
            </HStack>
          </VStack>
          <VStack spacing={6} align='center' divider={<StackDivider borderColor='white' />}>
            <Heading as='h1' size='lg'>
              Cheapest flights from {airport?.city ?? 'your location'}
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
        </VStack>
      </Center>
      <VStack align={'center'}>
        <Heading as='h1' size='lg'>
          Recommended Holiday Packages
        </Heading>
        <Box overflowX='auto' maxWidth={'100%'}>
          <HStack spacing={1} align='center'>
            {holidayPackageList.length !== 0 ? (
              holidayPackageList.slice(0, 3).map((value) => (
                <Box>
                  <HolidayCardSmall data={value} showBookButton={true}></HolidayCardSmall>
                </Box>
              ))
            ) : (
              <h1>No holiday packages have been created yet.</h1>
            )}
          </HStack>
        </Box>
      </VStack>
    </Grid>
  );
}
