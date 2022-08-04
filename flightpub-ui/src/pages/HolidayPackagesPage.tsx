import React, {Dispatch, SetStateAction, SyntheticEvent, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Center, Checkbox, FormControl, FormErrorMessage, FormLabel,
  Grid,
  Heading, Input,
  Stack,
  StackDivider,
  useToast,
  VStack
} from '@chakra-ui/react';
import logo from '../FlightPubLogo.png';
import {ApiError, useApi} from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import {Airline, Flight, Price } from '../models';
import { Airport, findNearestAirport } from '../utility/geolocation';

import { NavLink} from 'react-router-dom';
import { routes } from '../constants/routes';
import { HolidayCard } from '../components/HolidayCard';
import { HolidayCardProps, HolidayPackage } from '../models/HolidayCardProps';

export function HolidayPackagesPage({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) {
  useEffect(() => {
    document.title = 'FlightPub - Holiday Packages';
  });

  const data: HolidayCardProps[] = [
    {
      isPopular: true,
      imageURL:
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/7d/68/1d/four-seasons-resort-whistler.jpg?w=600&h=400&s=1',
      name: 'Iconic Canadian Winter in Whistler',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore',
      tagline: 'Fun filled adventure in the most iconic part of Canada!',
      price: 600,
      nights: 7,
      location: 'Whistler',
      tags: [
        { tagName: 'Winter', tagColor: 'blue' },
        { tagName: 'Scenic', tagColor: 'yellow' },
        { tagName: 'Holiday', tagColor: 'green' }
      ]
    },
    {
      isPopular: false,
      imageURL: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/f4/64/09/aerial-view.jpg',
      name: 'Maldives Resort and Spa',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore',
      tagline: 'Surround yourself by deep blue beautiful ocean in the beautiful Maldives',
      price: 450,
      nights: 4,
      location: 'Maldives',
      tags: [
        { tagName: 'Warm', tagColor: 'orange' },
        { tagName: 'Scenic', tagColor: 'yellow' },
        { tagName: 'Holiday', tagColor: 'green' }
      ]
    }
  ];

  const [holidayPackage, setHolidayPackage] = useState<HolidayPackage>({
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
  });
  const handleHolidayPackageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHolidayPackage({
      ...holidayPackage,
      [event.target.name]: event.target.value
    });
  };
  const handlePackageCreation = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      httpPostHolidayPackage('/', holidayPackage) //posts registration request
          .then(() => {
            toast({
              title: 'Holiday Package Created',
              description:
                  'Holiday Package Added Successfully!',
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

  //airlines : list of all airlines from models/Airline
  const [airlines, setAirlines] = useState<Airline[]>([]);

  const { httpGet: httpGetAirlines } = useApi(endpoints.airlines);
  const { httpGet: httpGetRecommended } = useApi(endpoints.recommended);
  const { httpGet: httpGetHolidayPackages } = useApi(endpoints.holidayPackages);
  const { httpPost: httpPostHolidayPackage } = useApi(endpoints.createHolidayPackage);


  //takes price and returns cheapest price value as a string
  const getMinPriceString = (prices: Price[]) => {
    if (!prices) return '---';
    let pricesVals = prices.map((p) => p.price);
    let minPrice = Math.min(...pricesVals);
    return `$${minPrice}`;
  };

  //Gets users current position and retrieves list of airlines
  //TODO: Retrieve list of holiday packages
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => setUserLocation(position.coords));
    httpGetAirlines('').then(setAirlines);
  }, []);

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
  }, [airport]);



  return (
    <Grid>
      <Center>
        <Box border='2px' borderColor='gray.200' p='10' borderRadius='2xl' w='md'>
          <form onSubmit={handlePackageCreation}>
            <Stack spacing='12'>
              <Box>
                <Heading>Create Holiday Package</Heading>
              </Box>
              <Box>
                <Stack spacing='3'>
                  {/* Email input */}
                  <FormControl isDisabled={loading}>
                    <FormLabel>isPopular</FormLabel>
                    <Checkbox
                        checked={holidayPackage.isPopular}
                        onChange={handleHolidayPackageChange}
                    />

                    {/* Firstname input */}
                  </FormControl>
                  <FormControl isDisabled={loading}>
                    <FormLabel>imageUrl</FormLabel>
                    <Input
                        name='imageUrl'
                        value={holidayPackage.imageURL}
                        onChange={handleHolidayPackageChange}
                    />
                    {/* LastName input */}
                  </FormControl>
                  <FormControl isDisabled={loading} >
                    <FormLabel>Package Name</FormLabel>
                    <Input
                        name='packageName'
                        value={holidayPackage.packageName}
                        onChange={handleHolidayPackageChange}
                    />
                  </FormControl>
                  <FormControl isDisabled={loading} >
                    <FormLabel>Description</FormLabel>
                    <Input
                        name='packageDescription'
                        value={holidayPackage.packageDescription}
                        onChange={handleHolidayPackageChange}
                    />
                  </FormControl>
                  <FormControl isDisabled={loading} >
                    <FormLabel>packageTagline</FormLabel>
                    <Input
                        name='packageTagline'
                        value={holidayPackage.packageTagline}
                        onChange={handleHolidayPackageChange}
                    />
                  </FormControl>
                  <FormControl isDisabled={loading} >
                    <FormLabel>packageNights</FormLabel>
                    <Input
                        name='packageNights'
                        value={holidayPackage.packageNights}
                        onChange={handleHolidayPackageChange}
                    />
                  </FormControl>
                  <FormControl isDisabled={loading} >
                    <FormLabel>location</FormLabel>
                    <Input
                        name='location'
                        value={holidayPackage.location}
                        onChange={handleHolidayPackageChange}
                    />
                  </FormControl>
                  <FormControl isDisabled={loading}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type='number'
                        name='price'
                        value={holidayPackage.price}
                        onChange={handleHolidayPackageChange}
                    />

                    {/* Error message popup */}
                    <FormErrorMessage>
                      Values provided are incorrect
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
              {/* Form submission button */}
              <Button type='submit' isLoading={loading} colorScheme='red'>
                Create Holiday Package
              </Button>
            </Stack>
          </form>
        </Box>
        <VStack spacing={2} align='center' divider={<StackDivider borderColor='white' />}>
          <Center backgroundColor='gray.600' maxW='1000px' mx='auto'>
            <img src={logo} alt='Logo' width='1000px' />
          </Center>
          <Box>
            <Button as={NavLink} to={routes.search} colorScheme='red' width='500px'>
              Search For a Flight
            </Button>
          </Box>
          <Heading as='h1' size='lg'>
            Holiday Packages and Deals from {airport?.city}
          </Heading>
          <VStack>
            {data.length !== 0 ? (
              data.map((value) => <HolidayCard data={value}></HolidayCard>)
            ) : (
              <h1>Nothing here, please check back later!</h1>
            )}
            ;
          </VStack>
        </VStack>
      </Center>
      <Button onClick={handlePackageCreation} colorScheme='red'>
        Create Package
      </Button>
    </Grid>
  );
}
