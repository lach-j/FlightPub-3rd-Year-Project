import {
  Box,
  Center,
  HStack,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  StackDivider,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airline, ColumnDefinition, Flight, Price } from '../models';

import { ResultsTable } from '../components/ResultsTable';

//Takes date-time input and formats to user-friendly display type
const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString('en-AU', {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: false
  });

//returns price-range as string of different flight class options
const getPriceString = (prices: Price[]) => {
  if (!prices) return '';
  let pricesVals = prices.map((p) => p.price);
  let minPrice = Math.min(...pricesVals);
  let maxPrice = Math.max(...pricesVals);
  return `$${minPrice}${maxPrice !== minPrice && ` - $${maxPrice}`}`;
};

//Converts from flight minutes to hour:minute format
function convertMinsToHM(minutes: number) {
  let hours = Math.floor(minutes / 60);

  minutes = minutes % 60;

  return hours + ' hrs ' + minutes + ' mins';
}

export function SearchResultsPage({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) {
  useEffect(() => {
    document.title = 'FlightPub - Search Results';
  });

  const { state } = useLocation();
  const [cart, setCart] = cartState;
  const { httpGet } = useApi(endpoints.airlines);
  //results: list of flights returned from query
  const [results, setResults] = useState<Flight[]>([]);
  //Price range filter query resutls
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  //Airline filter for airline type
  const [airlineFilter, setAirlineFilter] = useState('');
  //Duration range filter query results
  const [durationFilter, setDurationFilter] = useState(180000000);
  const [query, setQuery] = useState();

  //Min-Max duration slider information
  const [maxDuration, setMaxDuration] = useState(180000000);
  const [minDuration, setMinDuration] = useState(0);
  //List of airlines from models/Airline
  const [airlines, setAirlines] = useState<Airline[]>([]);

  //Min-Max price information
  const getMinPrice = (prices: Price[]) => Math.min(...prices.map((p) => p.price));
  const getMaxPrice = (prices: Price[]) => Math.max(...prices.map((p) => p.price));

  //DataTable column definitions
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
  //sets airline information on-load
  useEffect(() => {
    httpGet('').then(setAirlines);
  }, []);

  //sets results and query on-load
  useEffect(() => {
    const { results, query } = state as { query: any; results: Flight[] };
    setResults(results);
    setQuery(query);
    const flightTimes = results.map((r) => r.duration);
    const maxDuration = Math.max(...flightTimes);
    const minDuration = Math.min(...flightTimes);
    setMaxDuration(maxDuration);
    setMinDuration(minDuration);
    setDurationFilter(maxDuration);
  }, [state]);

  // filtering by price
  const filterByPrice = (val: number[]) => {
    setMinPrice(val[0]);
    setMaxPrice(val[1]);
  };
  //filtering by airline
  const filterByAirline = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAirlineFilter(event.target.value);
  };
  //filtering by duration
  const filterByDuration = (val: number) => {
    setDurationFilter(val);
  };

  //Filters resultdata based on stored filter criteria
  const filterResults = (result: Flight) => {
    if (
      result.prices.filter((p) => p.price < minPrice).length > 0 ||
      result.prices.filter((p) => p.price > maxPrice).length > 0
    )
      return false;

    if (airlineFilter && airlineFilter !== result.airlineCode) return false;

    if (result.duration > durationFilter) return false;

    return true;
  };

  const toast = useToast();

  return (
    <Box p='1em'>
      <HStack
        divider={<StackDivider borderColor='gray.200' />}
        spacing={10}
        alignItems='flex-start'
      >
        <Box w='300px' pt='30px' pl='30px'>
          <VStack divider={<StackDivider borderColor='gray.200' />} spacing={10} align='stretch'>
            //Price filter slider
            <VStack spacing={4} align='stretch'>
              <Text>
                Price: ${minPrice} - ${maxPrice}
              </Text>

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
            //Flight duration slider
            <VStack spacing={4} align='stretch'>
              <Text>Max Duration: {Math.floor(durationFilter / 60)} hours</Text>

              <Slider
                aria-label='slider-ex-1'
                onChangeEnd={(val) => filterByDuration(val)}
                min={minDuration}
                max={maxDuration}
                defaultValue={maxDuration}
                isDisabled={minDuration === maxDuration}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </VStack>
            //Airline filter selectbox
            <VStack spacing={4} align='stretch'>
              <Text>Airline:</Text>
              <Select placeholder='No Filter' onChange={filterByAirline}>
                {airlines
                  .filter((airline) =>
                    results.map((a) => a.airlineCode).includes(airline.airlineCode)
                  )
                  .map((airline) => (
                    <option value={airline.airlineCode}>{airline.airlineName}</option>
                  ))}
              </Select>
            </VStack>
          </VStack>
        </Box>
        //DataTable for flight results based on filtered data
        <Center flex='1'>
          <ResultsTable
            columns={columns}
            data={results.filter(filterResults)}
            keyAccessor='id'
            sortable
            cartState={[cart, setCart]}
          ></ResultsTable>
        </Center>
      </HStack>
    </Box>
  );
}
