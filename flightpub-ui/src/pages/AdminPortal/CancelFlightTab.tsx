import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  useDisclosure,
  useToast,
  VStack,
  Input
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import {useLocation, useNavigate} from 'react-router-dom';
import { Airline, ColumnDefinition, Flight, Price } from '../../models';
import { useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { ResultsTable } from '../../components/CancelFlightsTable';
import { convertMinsToHM, formatDateTime } from '../../utility/formatting';
import { airlines } from '../../data/airline';
import { Airport, findNearestAirport } from '../../utility/geolocation';
import {flights} from "../../data/flights";

export const CancelFlightTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  //recommended : contains data table of cheapest flights based on user location
  const [recommended, setRecommended] = useState<Flight[]>([]);

  //userLocation: Uses geoLocation to store users current position
  const [userLocation, setUserLocation] = useState<any>();

  //airport: User's nearest airport for reccomendations
  const [airport, setAirport] = useState<Airport | undefined>();

  const { state } = useLocation();

  const [results, setResults] = useState<Flight[]>([]);

  const [idFilter, setIdFilter] = useState<number>();

  const { httpGet } = useApi(endpoints.flightSearch);

  const getMinPrice = (prices: Price[]) => Math.min(...prices.map((p) => p.price));
  const getMaxPrice = (prices: Price[]) => Math.max(...prices.map((p) => p.price));
  const getPriceString = (prices: Price[]) => {
    if (!prices) return '';
    let pricesVals = prices.map((p) => p.price);
    let minPrice = Math.min(...pricesVals);
    let maxPrice = Math.max(...pricesVals);
    return `$${minPrice}${maxPrice !== minPrice && ` - $${maxPrice}`}`;
  };

  // retrieves list of airlines
  useEffect(() => {
    httpGet('').then(setResults);
  }, []);



  //Filters resultdata based on stored filter criteria
  const filterResults = (result: Flight) => {
    if (idFilter && result.id !== idFilter) return false;

    return true;
  };

  //filtering by duration
  const filterByID = (val: number) => {
    setIdFilter(val);
  };

  // Defines columns for DataTable in correct format
  const columns: ColumnDefinition<any>[] = [
    {
      accessor: 'airlineCode',
      Header: 'Airline',
      transform: (value) => airlines.find((a) => a.airlineCode === value)?.airlineName
    },
    {
      accessor: 'departureLocation.airport',
      Header: 'Departure Airport'
    },
    {
      accessor: 'departureTime',
      Header: 'Departure Time',
      transform: formatDateTime
    },
    {
      accessor: 'arrivalTime',
      Header: 'Arrival Time',
      transform: formatDateTime
    },
    {
      accessor: 'arrivalLocation.airport',
      Header: 'Destination Airport'
    },
    {
      accessor: 'stopOverLocation.airport',
      Header: 'Stop Over',
      transform: (value: any) => value || '---'
    },
    {
      accessor: 'prices',
      Header: 'Price',
      transform: getPriceString,
      sortValue: (prices: Price[], descending) =>
          descending ? getMaxPrice(prices) : getMinPrice(prices)
    },
    {
      accessor: 'duration',
      Header: 'Duration',
      transform: (value: any) => convertMinsToHM(value)
    }
  ];

  return (
    <>
      <Heading mb='1em'>Cancel Flight</Heading>
      <Input placeholder='Flight id' size='md' onChange={(val) => filterByID} />
      <Center>
        <ResultsTable
          columns={columns}
          data={results}
          // data={flights.filter(filterResults)}
          // data={recommended.filter(filterResults)}
          keyAccessor='id'
        ></ResultsTable>
      </Center>
    </>
  );
};
