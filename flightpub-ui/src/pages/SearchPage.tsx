import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Center,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	Modal,
	ModalOverlay,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Spinner,
	StackDivider,
	Table,
	Tag,
	TagCloseButton,
	TagLabel,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	useDisclosure,
	useToast,
	VStack
} from '@chakra-ui/react';
import React, { FormEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteItem,
	AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { ApiError, useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { airports } from '../data/airports';
import { Airport, findNearestAirport } from '../utility/geolocation';

export interface Item {
	label: string;
	value: string;
}

//container for flexidate information, contains date and flex-date range
interface FlexiDate {
	date: string;
	flex?: number;
}

//container for search query
interface SearchQuery {
	departureDate: FlexiDate;
	departureCode?: string;
	destinationCode?: string;
	tickets?: Map<string, number>;
	returnFlight?: boolean;
	searchTags?: Array<string>;
	multiLeg?: boolean;
}

export const SearchPage = () => {
	const navigate = useNavigate(); //enables react programmatic navigation
	const [flexEnabled, setFlexEnabled] = useState(false); //state for tracking whether user has selected flexdate option
	const [multiLegEnabled, setMultiLegEnabled] = useState(false); //state for tracking whether multi-leg flights are desired
	const [returnDate, setReturnDate] = useState(new Date()); // Return date, not currently used in request (visual only)
	const [searchTags, setSearchTags] = useState<Array<string>>([]); //user input search tags
	const toast = useToast();

	useEffect(() => {
		document.title = 'FlightPub - Search';
	});

	const { httpGet } = useApi(endpoints.flightSearch);

	//stateful airport storage
	const [airport, setAirport] = useState<Airport | undefined>();

	//handle the getCurrentPosition callback
	function getPosition(position: any) {
		setAirport(findNearestAirport([position.coords.longitude, position.coords.latitude]));
	}

	//Formats from JavaScript Date type to string
	const formatDate = (date: Date) => {
		return new Date(date).toISOString().split('T')[0];
	};
	//authRequest : stores search query request
	const [searchQuery, setSearchQuery] = useState<SearchQuery>({
		departureDate: { date: formatDate(new Date()) },
	});

	const { onOpen, onClose, isOpen } = useDisclosure();

	//Handles update of search query input, updating value(s)
	const handleSearchQueryUpdate = (field: keyof SearchQuery, value: any) => {
		setSearchQuery({ ...searchQuery, [field]: value });
	};

	//update the user's location and set the search query
	useEffect(() => {
		if (!navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(getPosition);
		handleSearchQueryUpdate('destinationCode', airport?.code);
	}, [airport]);

	//Handles search event for search form
	function handleSearch(e: FormEvent<HTMLFormElement>) {
		e.preventDefault(); //prevents stand HTML form submission protocol
		onOpen();
		//gets flight in formation from search query
		httpGet('', searchQuery)
			.then((results) =>
				navigate(routes.searchResults, {
					state: {
						query: searchQuery,
						results
					}
				})
			)
			.catch((err: ApiError) => {
				//error handling
				toast({
					title: 'An Error Has Occurred',
					description: 'An error has occurred, please try again later.',
					status: 'error',
					duration: 9000,
					isClosable: true,
					position: 'top'
				});
			})
			.finally(onClose);
	}

	//Handles update of ticket type form input
	const handleTicketUpdate = (value: number, classCode: string) => {
		handleSearchQueryUpdate(
			'tickets',
			searchQuery.tickets
				? searchQuery.tickets.set(classCode, value)
				: new Map<string, number>().set(classCode, value)
		);
	};

	const ticketOptions = [
		{ key: 'BUS', label: 'Business Class' },
		{ key: 'ECO', label: 'Economy' },
		{ key: 'FIR', label: 'First Class' },
		{ key: 'PME', label: 'Premium Economy' }
	];

	//tags information for search
	const tags = [
		{ label: 'Beach', value: 'beach' },
		{ label: 'Snow', value: 'snow' },
		{ label: 'Holiday', value: 'holiday' },
		{ label: 'Family-Friendly', value: 'family-friendly' },
		{ label: 'Sports', value: 'sports' },
		{ label: 'Romantic', value: 'romantic' },
		{ label: 'Asia', value: 'asia' },
		{ label: 'Surfing', value: 'surfing' }
	];

	//update the search tags, and prevent duplicate tags
	function handleTagUpdate(value: string) {
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
		handleSearchQueryUpdate('searchTags', searchTags);
	}

	//props for the tag message which displays when no tags are selected
	interface TagMessageProps {
		length: number;
	}

	//render a message when no tags are selected
	function TagMessage(props: TagMessageProps) {
		if (props.length === 0) {
			return (
				<>
					<em>No search tags added</em>
				</>
			);
		}
		return null;
	}

	return (
		<Box p='2em'>
			<Center>
				<form onSubmit={handleSearch}>
					<FormControl as='fieldset'>
						<FormLabel as='legend' fontSize='2xl'>
							Search for a flight
						</FormLabel>
						<VStack gap='2em'>
							<HStack
								alignItems='flex-start'
								divider={<StackDivider borderColor='gray.200' />}
								gap='3em'
							>
								<VStack
									divider={<StackDivider borderColor='gray.200' />}
									spacing={2}
									align='stretch'
								>
									{/* Departure location input */}
									<Box>
										<FormControl isRequired>
											<FormLabel>Departure Location</FormLabel>
											<AutoComplete
												openOnFocus
												suggestWhenEmpty
												onChange={(value) => handleSearchQueryUpdate('departureCode', value)}
											>
												<AutoCompleteInput
													variant='filled'
													placeholder={airport ? (airport?.city + " / " + airport?.code) : ("City / CODE")}
												/>
												<AutoCompleteList>
													{airports.map(({ code, city }) => (
														<AutoCompleteItem key={code} value={code} align='center'>
															<Text ml='4'>{city}</Text>
														</AutoCompleteItem>
													))}
												</AutoCompleteList>
											</AutoComplete>
										</FormControl>
									</Box>

									{/* Arrival location input */}
									<Box>
										<FormControl>
											<FormLabel>Arrival Location</FormLabel>
											<AutoComplete
												openOnFocus
												suggestWhenEmpty
												emptyState={true}
												onChange={(value) => handleSearchQueryUpdate('destinationCode', value)}
											>
												<AutoCompleteInput
													onBlur={() => handleSearchQueryUpdate('destinationCode', undefined)}
													variant='filled'
												/>
												<AutoCompleteList>
													{airports.map(({ code, city }) => (
														<AutoCompleteItem key={code} value={code} align='center'>
															<Text ml='4'>{city}</Text>
														</AutoCompleteItem>
													))}
												</AutoCompleteList>
											</AutoComplete>
										</FormControl>
									</Box>

									{/* Multi-leg flight checkbox */}
									<Box>
										<Checkbox
											name='multiLegEnabled'
											colorScheme='green'
											onChange={(e) => {
												setMultiLegEnabled(e.target.checked);
												handleSearchQueryUpdate('multiLeg', e.target.checked);
											}}
										>
											Allow multi-leg flights?&nbsp;
										</Checkbox>
										<Tooltip
											hasArrow
											label='Multi-leg flights reach your set destination by chaining multiple flights together'
											color='white'
										>
											<SearchIcon boxSize={3} />
										</Tooltip>
									</Box>

									{/* Ticket type input */}
									<Box>
										<FormControl isRequired>
											<FormLabel htmlFor='flightClass'>Tickets </FormLabel>
											<Accordion allowToggle w='20em'>
												<AccordionItem>
													<AccordionButton>
														<Box flex='1' textAlign='left'>
															{`Total: ${Object.values(searchQuery?.tickets || {}).reduce(
																(prev, current) => prev + (current || 0),
																0
															)}`}
														</Box>
														<AccordionIcon />
													</AccordionButton>
													<AccordionPanel p={0}>
														<Table>
															<Thead>
																<Tr>
																	<Th>Class</Th>
																	<Th>Quantity</Th>
																</Tr>
															</Thead>

															{/* Dropdown for ticket type */}
															<Tbody>
																{ticketOptions.map((option) => (
																	<Tr key={option.key}>
																		<Td>{option.label}</Td>
																		<Td>
																			<NumberInput
																				w='5em'
																				onChange={(value) =>
																					handleTicketUpdate(
																						value ? parseInt(value) : 0,
																						option.key
																					)
																				}
																				defaultValue={0}
																				min={0}
																				allowMouseWheel
																			>
																				<NumberInputField />
																				<NumberInputStepper>
																					<NumberIncrementStepper />
																					<NumberDecrementStepper />
																				</NumberInputStepper>
																			</NumberInput>
																		</Td>
																	</Tr>
																))}
															</Tbody>
														</Table>
													</AccordionPanel>
												</AccordionItem>
											</Accordion>
										</FormControl>
									</Box>
									<Box>
										{/* Handles type of flight (return or one-way) */}
										<FormControl isRequired>
											<FormLabel htmlFor='flightType'>Type </FormLabel>
											<Select
												onChange={(e) =>
													handleSearchQueryUpdate('returnFlight', e.target.value === 'return')
												}
												name='flightType'
												id='flightType'
												placeholder='Select flight Type'
												maxW={240}
											>
												<option value='one-way'>One-way</option>
												<option value='return'>Round trip</option>
											</Select>
										</FormControl>
									</Box>

									{/* Divider for the two columns */}
								</VStack>
								<VStack
									divider={<StackDivider borderColor='gray.200' />}
									spacing={2}
									align='stretch'
								>
									{/* Location tag inputs */}
									<VStack align='left'>
										<Box>
											<FormControl>
												<FormLabel>Location Tags</FormLabel>
												<HStack>
													<AutoComplete
														openOnFocus
														suggestWhenEmpty
														onChange={(e) => {
															setSearchTags(e.target.value);
														}}
													// onChange={(value: string) => handleTagUpdate(value)}
													>
														<AutoCompleteInput
															variant='filled'
															placeholder='Surfing'
														/>
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
										<label>Selected Tags</label>
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

									{/* Departure date input */}
									<Box>
										<FormControl>
											<FormLabel>Departure Date</FormLabel>
											<DatePicker
												dateFormat='dd/MM/yyyy'
												minDate={new Date()}
												selected={new Date(searchQuery.departureDate.date)}
												onChange={(date: Date) =>
													handleSearchQueryUpdate('departureDate', {
														...searchQuery?.departureDate,
														date: formatDate(date)
													})
												}
											/>
										</FormControl>
									</Box>

									{/* Return date input */}
									{searchQuery?.returnFlight === true && (
										<Box>
											<FormControl>
												<FormLabel>Return Date</FormLabel>
												<DatePicker
													dateFormat='dd/MM/yyyy'
													minDate={new Date(searchQuery.departureDate.date) || new Date()}
													selected={returnDate}
													onChange={(date: Date) => setReturnDate(date)}
												/>
											</FormControl>
										</Box>
									)}

									{/* Flex-date checkbox */}
									<Box>
										<Checkbox
											name='flexEnabled'
											colorScheme='green'
											onChange={(e) => {
												setFlexEnabled(e.target.checked);
												handleSearchQueryUpdate('departureDate', {
													...searchQuery?.departureDate,
													flex: e.target.checked ? 1 : 0
												});
											}}
										>
											Enable FlexSearch?&nbsp;
										</Checkbox>
										<Tooltip
											hasArrow
											label='FlexSearch increases increases the date range for your chosen arrival and departure dates'
											color='white'
										>
											<SearchIcon boxSize={3} />
										</Tooltip>
									</Box>

									{/* FLex-date input */}
									{flexEnabled && (
										<Box>
											<p>+/- days</p>
											<NumberInput
												allowMouseWheel={true}
												name='flexibleRange'
												size='sm'
												min={1}
												maxW={16}
												isDisabled={!flexEnabled}
												onChange={(e) =>
													handleSearchQueryUpdate('departureDate', {
														...searchQuery?.departureDate,
														flex: parseInt(e || '0')
													})
												}
												defaultValue={1}
												max={7}
											>
												<NumberInputField />
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
										</Box>
									)}
								</VStack>
							</HStack>

							{/* Submission button */}
							<Box>
								<Button type='submit' colorScheme='red'>
									Search
								</Button>
							</Box>
						</VStack>
					</FormControl>
				</form>
			</Center>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<Spinner style={{ position: 'absolute', top: '50vh', left: '50vw' }} />
			</Modal>
		</Box>
	);
};
