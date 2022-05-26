import {
  Box,
  Button,
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { httpGet } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airline, Flight, Price, ColumnDefinition } from '../models';

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
function convertMinsToHM(minutes: number) {
  let hours = Math.floor(minutes / 60);

  minutes = minutes % 60;

  return (hours + ' hrs ' + minutes + ' mins');
}

export function SearchResultsPage() {

  const { state } = useLocation();

  const [results, setResults] = useState<Flight[]>([]);

  const [sortField, setSortField] = useState('');
  const [ascendingCol, setAscendingCol] = useState('');
  const [descendingCol, setDescendingCol] = useState('');
  const [ascending, setAscending] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [airlineFilter, setAirlineFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState(180000000);
  const [query, setQuery] = useState();
  const [maxDuration, setMaxDuration] = useState(180000000);
  const [minDuration, setMinDuration] = useState(0);


  const [airlines, setAirlines] = useState<Airline[]>([]);

  const columns: ColumnDefinition<any>[] = [
    { accessor: 'airlineCode', Header: 'Airline', transform: value => airlines.find(a => a.airlineCode === value)?.airlineName},
    { accessor: 'departureLocation.airport', Header: 'Departure Airport' },
    { accessor: 'departureTime', Header: 'Departure Time', transform: formatDateTime },
    { accessor: 'arrivalTime', Header: 'Arrival Time', transform: formatDateTime },
    { accessor: 'arrivalLocation.airport', Header: 'Destination Airport' },
    { accessor: 'stopOverLocation.airport', Header: 'Stop Over', transform: (value: any) => value || '---' },
    { accessor: 'prices', Header: 'Price', transform: getPriceString },
    { accessor: 'duration', Header: 'Duration', transform: (value: any) => convertMinsToHM(value) },
  ];

  useEffect(() => {
    httpGet(endpoints.airlines)
      .then(setAirlines);
  }, []);

  useEffect(() => {
    const { results, query } = state as { query: any, results: Flight[] };
    setResults(results);
    setQuery(query);
    const flightTimes = results.map(r => r.duration);
    const maxDuration = Math.max(...flightTimes);
    const minDuration = Math.min(...flightTimes);
    setMaxDuration(maxDuration);
    setMinDuration(minDuration);
    setDurationFilter(maxDuration);

  }, [state]);

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
    setResults([...results.sort((a: any, b: any) => a?.[field] < b?.[field] ? order : -1 * order)]);
    setSortField(field);
  };

  const filterByPrice = (val: number[]) => {
    setMinPrice(val[0]);
    setMaxPrice(val[1]);
  };

  const filterByAirline = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAirlineFilter(event.target.value);
  };

  const filterByDuration = (val: number) => {
    setDurationFilter(val);
  };

  const sortIcon = (col: string) => {
    if (col === ascendingCol) {
      return (
        <TriangleUpIcon />
      );
    }
    if (col === descendingCol) {
      return (
        <TriangleDownIcon />
      );
    }
    return;
  };

  const toast = useToast();

  return (
    <Box p={'1em'}>
      <HStack
        divider={<StackDivider borderColor='gray.200' />}
        spacing={10}
        alignItems={'flex-start'}
      >
        <Box w='300px' pt='30px' pl='30px'>
          <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={10}
            align='stretch'>
            <VStack
              spacing={4}
              align='stretch'>
              <Text>Price: ${minPrice} - ${maxPrice}</Text>

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

            <VStack
              spacing={4}
              align='stretch'>
              <Text>Airline:</Text>
              <Select placeholder='No Filter' onChange={filterByAirline}>
                {airlines.filter(airline => results.map(a => a.airlineCode).includes(airline.airlineCode)).map((airline) =>
                  <option value={airline.airlineCode}>{airline.airlineName}</option>,
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
                  </Th>,
                )}
                <Th>Duration</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {/*TODO OSOSOSOSOSOSOSOSOSOSOSOSOSOSOOSOSOSOSOSOoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}

              {results.map((result: any) =>
                  <Tr>
                    {columns.map((column) =>
                        <Td>{column?.transform ? column.transform(_.get(result, column.accessor)) : _.get(result, column.accessor)}</Td>)}
                  {/*  chuck here after*/}
                  </Tr>,
              )}

              {results.filter((result) => {
                if (result.prices.filter( p => p.price < minPrice).length > 0 || result.prices.filter( p => p.price > maxPrice).length > 0) {
                  return false;
                }
                if (airlineFilter !== '') {
                  if (airlineFilter !== result.airlineCode) {
                    return false;
                  }
                }
                if (result.duration > durationFilter) {
                  return false;
                }
                return true;
              }).map((result: any) =>
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
      </HStack>
    </Box>
  );
}