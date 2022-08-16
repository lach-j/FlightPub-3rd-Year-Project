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
import {int} from "framer-motion/types/render/dom/value-types/type-int";
import {FlightCancel} from "../../models/FlightCancel";

export const CancelFlightTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {


  const [swapLists, setSwapLists] = useState(true);

  const [results, setResults] = useState<Flight[]>([]);
  const [canceledResults, setCanceledResults] = useState<Flight[]>([]);
  const [idFilter, setIdFilter] = useState('');

  const { httpGet: httpGetFlights } = useApi(endpoints.flightSearch);
  const { httpGet: httpGetCanceledFlights } = useApi(endpoints.getCanceled);

  const { httpPost } = useApi(endpoints.airlineUpdate);

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
    httpGetFlights('').then(setResults);
    httpGetCanceledFlights('').then(setCanceledResults);
  }, []);




  // Defines columns for DataTable in correct format
  const columns: ColumnDefinition<any>[] = [
    {
      accessor: 'flightNumber',
      Header: 'Flight Number'
    },
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
      <HStack gap={'5em'}>
        <Heading mb='1em'>Cancel Flight</Heading>
        <Button onClick={() => {setSwapLists(!swapLists)}}>
          Swap lists
        </Button>
      </HStack>

      <Input placeholder='Flight Number (is case sensitive)' size='md' onChange={event => setIdFilter(event.target.value)} />
      <Center>
        {swapLists ? (
            <ResultsTable
                columns={columns}
                data={results.filter(f => f.flightNumber.includes(idFilter) || idFilter === '')}
                keyAccessor='id'
            ></ResultsTable>
        ) : (
            <ResultsTable
                columns={columns}
                data={canceledResults.filter(f => f.flightNumber.includes(idFilter) || idFilter === '')}
                keyAccessor='id'
            ></ResultsTable>
        )}

      </Center>
    </>
  );
};
