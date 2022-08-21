import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  StackDivider,
  Switch,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import logo from '../FlightPubLogo.png';
import { ApiError, useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Flight } from '../models';
import { Airport, findNearestAirport } from '../utility/geolocation';

import { HolidayCard } from '../components/HolidayCard';
import { HolidayPackage } from '../models/HolidayCardProps';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import { airports } from '../data/airports';
import { UserContext } from '../services/UserContext';
import { UserRole } from '../models/User';

interface CreateHolidayPackageQuery {
  isPopular: boolean;
  imageURL: string;
  packageName: string;
  packageDescription: string;
  packageTagline: string;
  packageNights: number;
  location: string;
  price: number;
  arrivalLocation: string;
  flightIds: number[];
  accommodation: string;
}

export function HolidayPackagesPage() {
  useEffect(() => {
    document.title = 'FlightPub - Holiday Packages';
  });
  const [holidayPackageList, setHolidayPackageList] = useState<HolidayPackage[]>([]);
  const [localHolidayPackageList, setLocalHolidayPackageList] = useState<HolidayPackage[]>([]);
  const [currentFlight, setCurrentFlight] = useState(0);

  const [holidayPackage, setHolidayPackage] = useState<CreateHolidayPackageQuery>({
    isPopular: true,
    imageURL:
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/7d/68/1d/four-seasons-resort-whistler.jpg?w=600&h=400&s=1',
    packageName: 'Iconic Canadian Winter in Whistler',
    packageDescription:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore',
    packageTagline: 'Fun filled adventure in the most iconic part of Canada!',
    price: 600,
    packageNights: 7,
    location: 'Whistler',
    arrivalLocation: 'SYD',
    flightIds: [],
    accommodation: 'The Example Hotel, Whistler'
  });
  const handleHolidayPackageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHolidayPackage({
      ...holidayPackage,
      [event.target.name]: event.target.value
    });
  };
  const handleFlightInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFlight(parseInt(event.target.value));
  };
  const addFlightToList = () => {
    if (currentFlight === 0) {
      return;
    }
    setHolidayPackage({
      ...holidayPackage,
      flightIds: [...holidayPackage.flightIds, currentFlight]
    });
    setCurrentFlight(0);
  };

  const handleIsPopularChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHolidayPackage({
      ...holidayPackage,
      [event.target.name]: event.target.checked
    });
  };
  const handleToggleChange = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => setLocalOnly(e.target.checked);

  const handleCreateQueryUpdate = (field: keyof CreateHolidayPackageQuery, value: any) => {
    setHolidayPackage({ ...holidayPackage, [field]: value });
  };

  const { user, setUser } = useContext(UserContext);

  const userHasPrivileges =
    user?.role === UserRole.ADMINISTRATOR || user?.role === UserRole.TRAVEL_AGENT;

  const handlePackageCreation = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      httpPostHolidayPackage('/', holidayPackage) //posts registration request
        .then(() => {
          toast({
            title: 'Holiday Package Created',
            description: 'Holiday Package Added Successfully!',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top'
          });
        })
        .catch((err: ApiError) => {
          //if an error occurs in registration process
          {
            toast({
              title: 'Error.',
              description: 'An internal error has occurred, please try again later.',
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top'
            });
          }
        })
        .finally(() => setLoading(false));
      return false;
    }, 1000);
  };

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  //recommended : contains data table of cheapest flights based on user location
  const [recommended, setRecommended] = useState<Flight[]>([]);

  //userLocation: Uses geoLocation to store users current position
  const [userLocation, setUserLocation] = useState<any>();

  //airport: User's nearest airport for reccomendations
  const [airport, setAirport] = useState<Airport | undefined>();
  const [localOnly, setLocalOnly] = useState(false);

  const { httpGet: httpGetRecommended } = useApi(endpoints.recommended);
  const { httpGet: httpGetHolidayPackages } = useApi(endpoints.holidayPackages);
  const { httpPost: httpPostHolidayPackage } = useApi(endpoints.createHolidayPackage);

  //Takes user location and finds nearest airport on load
  useEffect(() => {
    if (!userLocation) return;
    let airport = findNearestAirport([userLocation.longitude, userLocation.latitude]);
    setAirport(airport);
  }, [userLocation]);

  //Gets airport code for nearest airport on-load to run reccomended search query
  useEffect(() => {
    if (!airport) return;
    httpGetRecommended('/' + airport.code).then(setRecommended);
    httpGetHolidayPackages('/getByDeparture/' + airport.code).then(setLocalHolidayPackageList);
  }, [airport]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => setUserLocation(position.coords));
    httpGetHolidayPackages('/getAll').then(setHolidayPackageList);
  }, []);

  return (
    <Grid>
      <Center backgroundColor='#112147' width='100%' mx='auto'>
        <img src={logo} alt='Logo' width='400px' />
      </Center>
      <Center>
        <VStack spacing={2} align='center' divider={<StackDivider borderColor='white' />}>
          <Heading paddingTop='10px' as='h1' size='lg'>
            Holiday Packages and Deals
          </Heading>
          <div>
            {airport ? (
              <HStack>
                <Heading as='h1' size='md' noOfLines={1} fontStyle={'bold'}>
                  Only show packages from {airport?.city}:
                </Heading>
                <Switch name='localOnly' checked={localOnly} onChange={handleToggleChange} />
              </HStack>
            ) : (
              <div></div>
            )}
          </div>
          {userHasPrivileges ? (
            <Box border='2px' borderColor='gray.200' p='10' borderRadius='2xl' width={'2xl'}>
              <form onSubmit={handlePackageCreation}>
                <Stack spacing='20px'>
                  <Center>
                    <Heading>Create Holiday Package</Heading>
                  </Center>
                  <FormControl isDisabled={loading}>
                    <FormLabel>Flag as Popular</FormLabel>
                    <Switch
                      name='isPopular'
                      colorScheme='red'
                      checked={holidayPackage.isPopular}
                      onChange={handleIsPopularChange}
                    />
                  </FormControl>
                  <FormControl isDisabled={loading}>
                    <FormLabel>imageURL:</FormLabel>
                    <Input
                      name='imageURL'
                      value={holidayPackage.imageURL}
                      onChange={handleHolidayPackageChange}
                    />
                  </FormControl>

                  <HStack>
                    <FormControl isDisabled={loading}>
                      <FormLabel>Package Name:</FormLabel>
                      <Input
                        name='packageName'
                        value={holidayPackage.packageName}
                        onChange={handleHolidayPackageChange}
                      />
                    </FormControl>
                  </HStack>
                  <HStack>
                    <FormControl isDisabled={loading}>
                      <FormLabel>Description:</FormLabel>
                      <Input
                        name='packageDescription'
                        value={holidayPackage.packageDescription}
                        onChange={handleHolidayPackageChange}
                      />
                    </FormControl>
                  </HStack>
                  <HStack>
                    <FormControl isDisabled={loading}>
                      <FormLabel>Package Tagline:</FormLabel>
                      <Input
                        name='packageTagline'
                        value={holidayPackage.packageTagline}
                        onChange={handleHolidayPackageChange}
                      />
                    </FormControl>
                  </HStack>
                  <HStack>
                    <FormControl isDisabled={loading}>
                      <FormLabel>Accommodation:</FormLabel>
                      <Input
                        name='accommodation'
                        value={holidayPackage.accommodation}
                        onChange={handleHolidayPackageChange}
                      />
                    </FormControl>
                    <FormControl isDisabled={loading}>
                      <FormLabel>Location:</FormLabel>
                      <Input
                        name='location'
                        value={holidayPackage.location}
                        onChange={handleHolidayPackageChange}
                      />
                    </FormControl>
                  </HStack>
                  <HStack>
                    <FormControl>
                      <FormLabel>Departure Location:</FormLabel>
                      <AutoComplete
                        openOnFocus
                        suggestWhenEmpty
                        onChange={(value) => handleCreateQueryUpdate('arrivalLocation', value)}
                      >
                        <AutoCompleteInput placeholder='Search...' variant='filled' />
                        <AutoCompleteList>
                          {airports.map(({ code, city }) => (
                            <AutoCompleteItem
                              key={city}
                              value={code}
                              label={`${city} - ${code}`}
                              align='center'
                            ></AutoCompleteItem>
                          ))}
                        </AutoCompleteList>
                      </AutoComplete>
                    </FormControl>
                    <FormControl isDisabled={loading}>
                      <FormLabel>Price</FormLabel>
                      <Input
                        type='number'
                        name='price'
                        maxW={'120px'}
                        value={holidayPackage.price}
                        onChange={handleHolidayPackageChange}
                      />
                    </FormControl>
                  </HStack>
                  <Flex>
                    <Box>
                      <FormControl isDisabled={loading}>
                        <FormLabel>Flight Ids:</FormLabel>
                        <HStack>
                          <Input
                            type='number'
                            name='flight'
                            value={currentFlight}
                            onChange={handleFlightInputUpdate}
                          />
                          <Input type='button' onClick={addFlightToList} value='Add'></Input>
                        </HStack>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl isDisabled={loading}>
                        <FormLabel>No. of nights:</FormLabel>
                        <NumberInput
                          allowMouseWheel={true}
                          name='packageNights'
                          value={holidayPackage.packageNights}
                          size='md'
                          min={1}
                          maxW={'125px'}
                          onChange={(value) => handleCreateQueryUpdate('packageNights', value)}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </Box>
                  </Flex>
                  <HStack>
                    <Text fontWeight={'bold'}>Selected Flights: </Text>
                    {holidayPackage.flightIds.map((entry) => (
                      <div>{entry},</div>
                    ))}
                  </HStack>

                  {/* Error message popup */}
                  <FormErrorMessage>Values provided are incorrect</FormErrorMessage>
                  {/* Form submission button */}

                  <Center>
                    <Button type='submit' isLoading={loading} colorScheme='red'>
                      Create Holiday Package
                    </Button>
                  </Center>
                </Stack>
              </form>
            </Box>
          ) : (
            <div></div>
          )}
          <VStack>
            {localOnly
              ? localHolidayPackageList.map((value) => (
                  <HolidayCard data={value} showBookButton={true}></HolidayCard>
                ))
              : holidayPackageList.map((value) => (
                  <HolidayCard data={value} showBookButton={true}></HolidayCard>
                ))}
          </VStack>
        </VStack>
      </Center>
    </Grid>
  );
}
