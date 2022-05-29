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
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { FormEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { ApiError, httpGet } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { airports } from '../data/airports';

export interface Item {
  label: string;
  value: string;
}


//tags information for search, currently not implemented
const tags2 = [
  { label: 'Beach', value: 'beach' },
  { label: 'Snow', value: 'snow' },
  { label: 'Holiday', value: 'holiday' },
  { label: 'Family-Friendly', value: 'family-friendly' },
  { label: 'Sports', value: 'sports' },
  { label: 'Romantic', value: 'romantic' },
  { label: 'Asia', value: 'asia' },
];

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
}


export const SearchPage = () => {
  const navigate = useNavigate();   //enables react programmatic navigation
  const [flexEnabled, setFlexEnabled] = useState(false); //state for tracking whether user has selected flexdate option
  const toast = useToast();

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

  //Handles search event for search form
  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();  //prevents stand HTML form submission protocol
    onOpen();
    //gets flight in formation from search query
    httpGet(endpoints.flightSearch, searchQuery).then(results => navigate(routes.searchResults, {
      state: {
        query: searchQuery,
        results,
      },
    }))
      .catch((err: ApiError) => { //error handling
        toast({
          title: 'An Error Has Occurred',
          description: 'An error has occurred, please try again later.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
      }).finally(onClose);
  }
//Handles update of ticket type form input
  const handleTicketUpdate = (value: number, classCode: string) => {
    handleSearchQueryUpdate('tickets', searchQuery.tickets ? searchQuery.tickets.set(classCode, value) : new Map<string, number>().set(classCode, value));
  };

  const ticketOptions = [
    { key: 'BUS', label: 'Business Class' },
    { key: 'ECO', label: 'Economy' },
    { key: 'FIR', label: 'First Class' },
    { key: 'PME', label: 'Premium Economy' },
  ];

  return (
    <Box p='2em'>
      <Center>
        <form onSubmit={handleSearch}>
          <FormControl as='fieldset'>
            <FormLabel as='legend' fontSize='2xl'>
              Search flights
            </FormLabel>
            <VStack gap='2em'>
              <HStack
                alignItems={'flex-start'}
                divider={<StackDivider borderColor='gray.200' />}
                gap={'3em'}
              >
                <VStack
                  divider={<StackDivider borderColor='gray.200' />}
                  spacing={2}
                  align='stretch'
                >
                  <Box>
                    //Ticket type input
                    <FormControl isRequired>
                      <FormLabel htmlFor='flightClass'>Tickets: </FormLabel>
                      <Accordion allowToggle w='20em'>
                        <AccordionItem>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              {`Total: ${Object.values(
                                searchQuery?.tickets || {},
                              ).reduce(
                                (prev, current) => prev + (current || 0),
                                0,
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
                              <Tbody>
                                //Dropdown for ticket type
                                {ticketOptions.map((option) => (
                                  <Tr key={option.key}>
                                    <Td>{option.label}</Td>
                                    <Td>
                                      <NumberInput
                                        w={'5em'}
                                        onChange={(value) =>
                                          handleTicketUpdate(value ? parseInt(value) : 0, option.key)
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
                    //Handles type of flight (return or one-way)
                    <FormControl isRequired>
                      <FormLabel htmlFor='flightType'>Type: </FormLabel>
                      <Select
                        onChange={(e) =>
                          handleSearchQueryUpdate(
                            'returnFlight',
                            e.target.value === 'return',
                          )
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
                </VStack>
                <VStack
                  divider={<StackDivider borderColor='gray.200' />}
                  spacing={2}
                  align='stretch'
                >
                  <Box>
                    //Departure location input
                    <FormControl isRequired>
                      <FormLabel>Departure Location</FormLabel>
                      <AutoComplete
                        openOnFocus
                        onChange={(value) =>
                          handleSearchQueryUpdate('departureCode', value)
                        }
                      >
                        <AutoCompleteInput variant='filled' />
                        <AutoCompleteList>
                          {airports.map(({ code, city }) => (
                            <AutoCompleteItem
                              key={code}
                              value={code}
                              align='center'
                            >
                              <Text ml='4'>{city}</Text>
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteList>
                      </AutoComplete>
                    </FormControl>
                  </Box>
                  //Arrival location input
                  <Box>
                    <FormControl>
                      <FormLabel>Arrival Location:</FormLabel>
                      <AutoComplete
                        openOnFocus
                        defaultValue={''}
                        emptyState={true}
                        onChange={(value) =>
                          handleSearchQueryUpdate('destinationCode', value)
                        }
                      >
                        <AutoCompleteInput onBlur={() => handleSearchQueryUpdate('destinationCode', undefined)}
                                           variant='filled' />
                        <AutoCompleteList>
                          {airports.map(({ code, city }) => (
                            <AutoCompleteItem
                              key={code}
                              value={code}
                              align='center'
                            >
                              <Text ml='4'>{city}</Text>
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteList>
                      </AutoComplete>
                    </FormControl>
                  </Box>

                  //Departure date input
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
                            date: formatDate(date),
                          })
                        }
                      />
                    </FormControl>
                  </Box>
                  //Departure date input
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
                            date: formatDate(date),
                          })
                        }
                      />
                    </FormControl>
                  </Box>

                  //Flex-date input
                  <Box>
                    <Checkbox
                      name={'flexEnabled'}
                      colorScheme='green'
                      onChange={(e) => {
                        setFlexEnabled(e.target.checked);
                        handleSearchQueryUpdate('departureDate', {
                          ...searchQuery?.departureDate,
                          flex: e.target.checked ? 1 : 0,
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
                  {flexEnabled && (
                    <Box>
                      <p>+/- days</p>
                      <NumberInput
                        allowMouseWheel={true}
                        name={'flexibleRange'}
                        size='sm'
                        min={1}
                        maxW={16}
                        isDisabled={!flexEnabled}
                        onChange={(e) =>
                          handleSearchQueryUpdate('departureDate', {
                            ...searchQuery?.departureDate,
                            flex: parseInt(e || '0'),
                          })
                        }
                        defaultValue={1}
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
              //Submission button
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
