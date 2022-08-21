import {
  Badge,
  Box,
  Center,
  FormControl,
  FormLabel,
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
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import { useLocation } from 'react-router-dom';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airline, ColumnDefinition, Flight, Price } from '../models';
import { airports } from '../data/airports';
import { ResultsTable } from '../components/ResultsTable';
import { SearchResult } from '../models/SearchResult';
import { tags } from '../data/tags';
import moment from 'moment';

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

  const [filterTags, setFilterTags] = useState<string[]>([]); //user input search tags

  const [searchResultsWithTags, setSearchResultsWithTags] = useState<SearchResult[]>([]);

  const isSponsored = (airline: Airline) => {
    return (
      ((airline?.sponsorships?.length || 0 > 0) &&
        airline?.sponsorships?.filter(
          (s) => moment(s.endDate).isAfter(new Date()) && moment(s.startDate).isBefore(new Date())
        )?.length) ||
      0 > 0
    );
  };

  //DataTable column definitions
  const columns: ColumnDefinition<any>[] = [
    {
      accessor: 'flight.airline',
      Header: 'Airline',
      transform: (airline: Airline) => (
        <>
          {airline.airlineName}{' '}
          {isSponsored(airline) && <Badge colorScheme={'yellow'}>SPONSORED</Badge>}
        </>
      )
    },
    {
      accessor: 'flight.departureLocation.airport',
      Header: 'Departure Airport'
    },
    {
      accessor: 'flight.departureTime',
      Header: 'Departure Time',
      transform: formatDateTime
    },
    {
      accessor: 'flight.arrivalTime',
      Header: 'Arrival Time',
      transform: formatDateTime
    },
    {
      accessor: 'flight.arrivalLocation.airport',
      Header: 'Destination Airport'
    },
    {
      accessor: 'flight.stopOverLocation.airport',
      Header: 'Stop Over',
      transform: (value: any) => value || '---'
    },
    {
      accessor: 'flight.prices',
      Header: 'Price',
      transform: getPriceString,
      sortValue: (prices: Price[], descending) =>
        descending ? getMaxPrice(prices) : getMinPrice(prices)
    },
    {
      accessor: 'flight.duration',
      Header: 'Duration',
      transform: (value: any) => convertMinsToHM(value)
    },
    {
      accessor: 'tags',
      Header: 'Tags',
      transform: (value: any) =>
        value
          .map((v: string) => {
            return toProperCase(v);
          })
          .join(', ')
    }
  ];
  //sets airline information on-load
  useEffect(() => {
    httpGet('').then(setAirlines);
  }, []); //don't add the httpGet dependency that eslint wants here, it will infinite loop

  //sets results and query on-load
  useEffect(() => {
    const { results, query } = state as { query: any; results: Flight[] };
    setResults(results);
    setQuery(query);
    setFilterTags(query?.searchTags || []);
    GenerateSearchResults(results);
    const flightTimes = results.map((r) => r.duration);
    const maxDuration = Math.max(...flightTimes);
    const minDuration = Math.min(...flightTimes);
    setMaxDuration(maxDuration);
    setMinDuration(minDuration);
    setDurationFilter(maxDuration);
  }, [state]);

  //converts a string to proprt noun case (i.e. This Is A Sentence Full Of Proper Nouns)
  function toProperCase(input: string) {
    return input.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }

  //create search result objects, which are flights with associated tags
  function GenerateSearchResults(res: Flight[]) {
    const sr = new Array<SearchResult>();
    res?.forEach((f, idx) => {
      const construct: SearchResult = {
        flight: f,
        tags: airports.find((airport) => airport.code === f.arrivalLocation.destinationCode)?.tags
      };
      sr.push(construct);
    });
    setSearchResultsWithTags(sr);
  }

  useEffect(() => {
    if (!results) return;
    setMinPrice(Math.min(...results.map((f) => f.prices.map((p) => p.price)).flat()));
    setMaxPrice(Math.max(...results.map((f) => f.prices.map((p) => p.price)).flat()));
  }, [results]);

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
  const filterResults = (result: SearchResult) => {
    if (
      Math.max(...result.flight.prices.map((p) => p.price).flat()) > maxPrice ||
      Math.min(...result.flight.prices.map((p) => p.price).flat()) < minPrice
    )
      return false;

    if (airlineFilter && airlineFilter !== result.flight.airline.airlineCode) return false;

    if (result.flight.duration > durationFilter) return false;

    if (!filterTags || filterTags.length === 0) return true;
    else if (filterTags?.filter((value) => result?.tags?.includes(value)).length === 0) {
      return false;
    }

    return true;
  };

  const toast = useToast();

  interface TagMessageProps {
    length: number;
  }

  //render a message when no tags are selected
  function TagMessage(props: TagMessageProps) {
    if (props.length === 0) {
      return (
        <>
          <em>No tag filter active</em>
        </>
      );
    }
    return null;
  }

  //update the search tags, and prevent duplicate tags
  function handleTagUpdate(value: any) {
    if (filterTags?.includes(value)) {
      toast({
        title: 'Tag Already Exists',
        description: 'You have already added this tag to your search.',
        status: 'info',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
    setFilterTags((searchTags) => [...searchTags, value]);
  }

  return (
    <Box p='1em'>
      <HStack
        divider={<StackDivider borderColor='gray.200' />}
        spacing={10}
        alignItems='flex-start'
      >
        <Box w='300px' pt='30px' pl='30px'>
          <VStack divider={<StackDivider borderColor='gray.200' />} spacing={10} align='stretch'>
            {/* //Price filter slider */}
            <VStack spacing={4} align='stretch'>
              <Text>
                Price: ${minPrice} - ${maxPrice}
              </Text>

              <RangeSlider
                aria-label={['min', 'max']}
                onChangeEnd={(val) => filterByPrice(val)}
                min={Math.min(...results.map((f) => f.prices.map((p) => p.price)).flat())}
                max={Math.max(...results.map((f) => f.prices.map((p) => p.price)).flat())}
                defaultValue={[0, 100000]}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </VStack>
            {/* //Flight duration slider */}
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
            {/* //Airline filter selectbox */}
            <VStack spacing={4} align='stretch'>
              <Text>Airline:</Text>
              <Select placeholder='No Filter' onChange={filterByAirline}>
                {airlines
                  .filter((airline) =>
                    results.map((a) => a.airline.airlineCode).includes(airline.airlineCode)
                  )
                  .map((airline) => (
                    <option value={airline.airlineCode}>{airline.airlineName}</option>
                  ))}
              </Select>
            </VStack>
            {/* Tag filter input */}
            <VStack align='left'>
              <Box>
                <FormControl>
                  <FormLabel>Filter By tags:</FormLabel>
                  <HStack>
                    <AutoComplete
                      openOnFocus
                      suggestWhenEmpty
                      defaultValue=''
                      emptyState={true}
                      onChange={(value: string) => handleTagUpdate(value)}
                    >
                      <AutoCompleteInput variant='filled' />
                      <AutoCompleteList>
                        {tags.map(({ value }) => (
                          <AutoCompleteItem key={value} value={value} align='center'>
                            <Text ml='4'>{value}</Text>
                          </AutoCompleteItem>
                        ))}
                      </AutoCompleteList>
                    </AutoComplete>
                  </HStack>
                </FormControl>
              </Box>
              <label>Selected Tags:</label>
              <Box width='15rem'>
                <TagMessage length={filterTags?.length} />
                {filterTags?.map((item) => (
                  <Tag size='md' key={item} borderRadius='full' variant='outline' colorScheme='red'>
                    <TagLabel>{item}</TagLabel>
                    <TagCloseButton
                      onClick={() => setFilterTags(filterTags?.filter((value) => value !== item))}
                    />
                  </Tag>
                ))}
              </Box>
            </VStack>
          </VStack>
        </Box>
        {/* //DataTable for flight results based on filtered data */}
        <Center flex='1'>
          <ResultsTable
            columns={columns}
            data={searchResultsWithTags.filter(filterResults)}
            keyAccessor='id'
            sortable
            cartState={[cart, setCart]}
          ></ResultsTable>
        </Center>
      </HStack>
    </Box>
  );
}
