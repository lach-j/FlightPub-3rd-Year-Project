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
	VStack,
	FormControl,
	Tag,
	TagLabel,
	TagCloseButton,
	FormLabel,
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

	const [searchTags, setSearchTags] = useState<Array<string>>([]); //user input search tags

	const [searchResultsWithTags, setSearchResultsWithTags] = useState<Array<SearchResult>>([]);

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
		},
		{
			accessor: 'airportsWithTags',
			Header: 'Tags',
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
		setSearchTags(query.searchTags);
		GenerateSearchResults();
		const flightTimes = results.map((r) => r.duration);
		const maxDuration = Math.max(...flightTimes);
		const minDuration = Math.min(...flightTimes);
		setMaxDuration(maxDuration);
		setMinDuration(minDuration);
		setDurationFilter(maxDuration);
	}, [state]);

	//create search result objects, which are flights with associated tags
	function GenerateSearchResults() {
		const sr = new Array<SearchResult>();
		results?.map((f, idx) => {
			sr[idx]['flight'] = f;
			sr[idx]['tags'] = airports.find((airport) => airport.code === f.arrivalLocation.destinationCode)?.tags;
		})
		setSearchResultsWithTags(sr);
	}

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
		if (searchTags.includes(value)) {
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
		setSearchTags((searchTags) => [...searchTags, value]);
		// handleSearchQueryUpdate('searchTags', searchTags);
	}

	//tags information for search
	const tags = [
		{ label: 'Beach', value: 'beach' },
		{ label: 'Snow', value: 'snow' },
		{ label: 'Holiday', value: 'holiday' },
		{ label: 'Family-Friendly', value: 'family-friendly' },
		{ label: 'Sports', value: 'sports' },
		{ label: 'Romantic', value: 'romantic' },
		{ label: 'Asia', value: 'asia' }
	];

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
										results.map((a) => a.airlineCode).includes(airline.airlineCode)
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
												{tags.map(({ label }) => (
													<AutoCompleteItem key={label} value={label} align='center'>
														<Text ml='4'>{label}</Text>
													</AutoCompleteItem>
												))}
											</AutoCompleteList>
										</AutoComplete>
									</HStack>
								</FormControl>
							</Box>
							<label>Selected Tags:</label>
							<Box width='15rem'>
								<TagMessage length={searchTags.length} />
								{searchTags.map((item) => (
									<Tag
										size='md'
										key={item}
										borderRadius='full'
										variant='outline'
										colorScheme='red'
									>
										<TagLabel>{item}</TagLabel>
										<TagCloseButton
											onClick={() =>
												setSearchTags(searchTags.filter((value) => value !== item))
											}
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
						data={results.filter(filterResults)}
						keyAccessor='id'
						sortable
						cartState={[cart, setCart]}
					></ResultsTable>
				</Center>
			</HStack >
		</Box >
	);
}
