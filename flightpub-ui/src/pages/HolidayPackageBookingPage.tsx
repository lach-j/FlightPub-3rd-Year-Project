import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useToast,
    VStack,
    Input,
    Select,
    Center, Td, Table, Thead, Th, TableContainer, Tbody, Tr, useDisclosure
} from '@chakra-ui/react';

import React, {useEffect, useState, useContext} from 'react';

import { HiOutlineArrowNarrowRight } from 'react-icons/all';
import { UserContext } from '../services/UserContext';
import {HolidayCard} from "../components/HolidayCard";
import {HolidayPackage} from "../models/HolidayCardProps";
import {ApiError, useApi} from "../services/ApiService";
import {endpoints} from "../constants/endpoints";
import {Airline} from "../models";
import {Airport, findNearestAirport} from "../utility/geolocation";


export const HolidayPackageBookingPage = () => {
    useEffect(() => {
        document.title = 'FlightPub - Bookings';
    });

    const toast = useToast();
    const [passengerCount, setPassengerCount] = useState<number>(1);

    const [firstNames, setFirstNames] =  useState<string[]>(['']);
    const [lastNames, setLastNames] =  useState<string[]>(['']);
    const [emails, setEmails] =  useState<string[]>(['']);
    const [confEmails, setConfEmails] =  useState<string[]>(['']);

    //userLocation: Uses geoLocation to store users current position
    const [userLocation, setUserLocation] = useState<any>();
    const [holidayPackage, setHolidayPackage] = useState<HolidayPackage>();

    const { httpGet: httpGetHolidayPackages } = useApi(endpoints.holidayPackages);
    const { httpGet: httpGetAirlines } = useApi(endpoints.airlines);


    const ticketOptions = [
        { key: 'BUS', label: 'Business Class' },
        { key: 'ECO', label: 'Economy' },
        { key: 'FIR', label: 'First Class' },
        { key: 'PME', label: 'Premium Economy' }
    ];

    const { user, setUser } = useContext(UserContext);

    //airport: User's nearest airport for reccomendations
    const [airport, setAirport] = useState<Airport | undefined>();

    useEffect(() => {
        if (!userLocation) return;
        let airport = findNearestAirport([userLocation.longitude, userLocation.latitude]);
        setAirport(airport);
    }, [userLocation]);

    //airlines : list of all airlines from models/Airline
    const [airlines, setAirlines] = useState<Airline[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => setUserLocation(position.coords));
        httpGetAirlines('').then(setAirlines);
        httpGetHolidayPackages('/1').then(setHolidayPackage)
    }, []);

    const handleCurrentUser = () => {
        if (user) {
            let tempFNames = [...firstNames];
            tempFNames[0] = user.firstName;
            setFirstNames(tempFNames);

            let tempLNames = [...lastNames];
            tempLNames[0] = user.lastName;
            setLastNames(tempLNames);

            let tempEmails = [...emails];
            tempEmails[0] = user.email;
            setEmails(tempEmails);

            let tempConfEmails = [...confEmails];
            tempConfEmails[0] = user.email;
            setConfEmails(tempConfEmails);
        } else {
            toast({
                title: 'Error!',
                description: 'Not logged in!',
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top'
            });
        }
    }

    const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        switch(event.target.name) {
            case "fname":
                let tempFNames = [...firstNames];
                tempFNames[index] = event.target.value;
                setFirstNames(tempFNames);
                break;
            case "lname":
                let tempLNames = [...lastNames];
                tempLNames[index] = event.target.value;
                setLastNames(tempLNames);
                break;
            case "email":
                let tempEmails = [...emails];
                tempEmails[index] = event.target.value;
                setEmails(tempEmails);
                break;
            case "confemail":
                let tempConfEmails = [...confEmails];
                tempConfEmails[index] = event.target.value;
                setConfEmails(tempConfEmails);
                break;
        }
    }

    const renderFlightDetails = () => {
        return (
            <Flex justifyContent='center' direction='column' w='xs'>
                    {holidayPackage?.flights.map((flight) => (
                        <Flex w='full' justifyContent='space-between' alignItems='center'>
                            <Stat textAlign='left' flex='none'>
                                <StatLabel>{new Date(flight?.departureTime).toLocaleString('en-AU', {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                    hour12: false,
                                })}</StatLabel>
                                <StatNumber>{flight?.departureLocation.destinationCode}</StatNumber>
                                <StatHelpText>DEPARTURE</StatHelpText>
                            </Stat>
                            {flight?.stopOverLocation.destinationCode && <>
                                <HiOutlineArrowNarrowRight />
                                <Stat textAlign='center' flex='none'>
                                    <StatLabel>{new Date(flight?.arrivalTimeStopOver || '').toLocaleString('en-AU', {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                        hour12: false,
                                    }) + ' - ' + new Date(flight?.departureTimeStopOver || '').toLocaleString('en-AU', {
                                        timeStyle: 'short',
                                        hour12: false,
                                    })}</StatLabel>
                                    <StatNumber>{flight?.stopOverLocation.destinationCode}</StatNumber>
                                    <StatHelpText>STOPOVER</StatHelpText>
                                </Stat></>}
                            <HiOutlineArrowNarrowRight />
                            <Stat textAlign='right' flex='none'>
                                <StatLabel>{new Date(flight?.arrivalTime).toLocaleString('en-AU', {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                    hour12: false,
                                })}</StatLabel>
                                <StatNumber>{flight?.arrivalLocation.destinationCode}</StatNumber>
                                <StatHelpText>ARRIVAL</StatHelpText>
                            </Stat>
                        </Flex>
                    ))}
            </Flex>
        );
    }

    const renderPackageInfo = () => {
        return (
            <Flex justifyContent='center' direction='column' w='3xl'>
                <Heading fontSize='3xl' mb='1em'>Finalise Holiday Booking</Heading>
                <TableContainer>
                    <Table size='lg' variant='striped'>
                        <Thead>
                            <Tr>
                                <Th>Holiday Package Items</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>PackageId</Td>
                                <Td>{holidayPackage?.id}</Td>
                            </Tr>
                            <Tr>
                                <Td>Package Name</Td>
                                <Td>{holidayPackage?.packageName}</Td>
                            </Tr>
                            <Tr>
                                <Td>Package Accomodation</Td>
                                <Td>{holidayPackage?.accommodation}</Td>
                            </Tr>
                            <Tr>
                                <Td>Package Price (ex. Flights)</Td>
                                <Td>${holidayPackage?.price}</Td>
                            </Tr>
                            <Tr>
                                <Td>Flight Information: </Td>
                                <Td>{renderFlightDetails()}</Td>
                            </Tr>
                            <Tr>
                                <Td>Total Cost: </Td>
                                <Td>
                                    <Text mb='4em'>{`$${holidayPackage?.flights.reduce(
                                        (partialSum, a) => partialSum + a.prices[0].price,
                                        holidayPackage?.price
                                    )}`}</Text>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        );
    }

    const renderPassengerForms = () => {
        var forms = [];
        for (var i = 0; i < passengerCount; i++) {
            if (i === 0) {
                forms.push(
                    <VStack>
                        <Text fontSize='2xl'>Passenger {i + 1}</Text>
                        <HStack w='full'>
                            <FormControl flex={1}>
                                <FormLabel>First Name</FormLabel>
                                <Input value={firstNames[0]} name='fname' onChange={handleChange(0)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Last Name</FormLabel>
                                <Input value={lastNames[0]} name='lname' onChange={handleChange(0)}/>
                            </FormControl>
                        </HStack>
                        <HStack w='full'>
                            <FormControl flex={1}>
                                <FormLabel>Email Address</FormLabel>
                                <Input value={emails[0]} name='email' onChange={handleChange(0)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Confirm Email Address</FormLabel>
                                <Input value={confEmails[0]} name='confemail' onChange={handleChange(0)}/>
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Class</FormLabel>
                            <Select>
                                {ticketOptions.map((o) =>
                                    <option value={o.key}>{o.label}</option>
                                )}
                            </Select>
                        </FormControl>
                        <Text
                            as='u'
                            colorScheme='gray'
                            onClick={() => {
                                handleCurrentUser();
                            }}
                        >
                            {' '}
                            Set as Me
                        </Text>
                    </VStack>
                );
            } else {
                forms.push(
                    <VStack>
                        <Text fontSize='2xl'>Passenger {i + 1}</Text>
                        <HStack w='full'>
                            <FormControl flex={1}>
                                <FormLabel>First Name</FormLabel>
                                <Input value={firstNames[i]} name={'fname'} onChange={handleChange(i)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Last Name</FormLabel>
                                <Input value={lastNames[i]} name={'lname'} onChange={handleChange(i)}/>
                            </FormControl>
                        </HStack>
                        <HStack w='full'>
                            <FormControl flex={1}>
                                <FormLabel>Email Address</FormLabel>
                                <Input value={emails[i]} name={'email'} onChange={handleChange(i)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Confirm Email Address</FormLabel>
                                <Input value={confEmails[i]} name={'confemail'} onChange={handleChange(i)}/>
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Class</FormLabel>
                            <Select>
                                {ticketOptions.map((o) =>
                                    <option value={o.key}>{o.label}</option>
                                )}
                            </Select>
                        </FormControl>
                    </VStack>
                );
            }
        }
        return forms;
    }


    return (
        <Flex justifyContent='center' p='5em'>
            <Flex justifyContent='center' direction='column' w='50em'>
                <Center>
                    <Box>
                        {holidayPackage ? (
                             <HolidayCard data={holidayPackage}></HolidayCard>
                        ) : (
                            <h1>Nothing here, please check back later!</h1>
                        )}
                    </Box>
                </Center>
                <Box boxShadow='dark-lg' p='6' rounded='md' bg='white'>
                {renderPackageInfo()}
                {renderPassengerForms()}
                </Box>
            </Flex>
        </Flex>
    )};