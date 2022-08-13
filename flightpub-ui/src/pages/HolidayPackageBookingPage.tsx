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
    Button,
    Center, Td, Table, Thead, Th, TableContainer, Tbody, Tr, Switch, useDisclosure
} from '@chakra-ui/react';

import React, {useEffect, useState, useContext, SyntheticEvent} from 'react';

import * as yup from 'yup';
import { BiLinkExternal, HiOutlineArrowNarrowRight, BsFillPlusCircleFill } from 'react-icons/all';
import {NavLink, useNavigate} from 'react-router-dom';
import { routes } from '../constants/routes';
import { UserContext } from '../services/UserContext';
import { Passenger } from '../models/Passenger';
import {HolidayCard} from "../components/HolidayCard";
import {HolidayPackage} from "../models/HolidayCardProps";
import {ApiError, useApi} from "../services/ApiService";
import {endpoints} from "../constants/endpoints";
import {Airline, SavedPayment} from "../models";
import {Airport, findNearestAirport} from "../utility/geolocation";
import {countries} from "../data/countries";
import {SavedPaymentType} from "../models/SavedPaymentTypes";
import {Booking} from "../models/Booking";


export const HolidayPackageBookingPage = () => {
    useEffect(() => {
        document.title = 'FlightPub - Bookings';
    });

    const toast = useToast();
    const navigate = useNavigate();
    const [passengerCount, setPassengerCount] = useState<number>(1);

    const [firstNames, setFirstNames] =  useState<string[]>(['']);
    const [lastNames, setLastNames] =  useState<string[]>(['']);
    const [emails, setEmails] =  useState<string[]>(['']);
    const [confEmails, setConfEmails] =  useState<string[]>(['']);

    const [savedPaymentData, setSavedPaymentData] = useState<SavedPayment | null>(null);
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
        httpGetHolidayPackages('/fetchById/1').then(setHolidayPackage)
    }, []);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [bookingRequest, setBookingRequest] = useState<Booking>({
        userId: 2,
        flightIds: [],
        passengers: []
    });
    const { httpPost } = useApi(endpoints.book);

    const passengerSchema =
        yup.object().shape({
            firstName: yup.string().matches(/[a-zA-Z]/).required(),
            lastName: yup.string().matches(/[a-zA-Z]/).required(),
            email: yup.string().email('must be a valid email').required(),
            confEmail: yup.string().email('must be a valid email').required(),
        });
    const handleBooking = (e: SyntheticEvent) => {
        e.preventDefault();
        onOpen();
        httpPost('', bookingRequest)
            .then(() => {
                toast({
                    title: 'Booking Confirmed',
                    description: 'Your booking was made successfully',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    position: 'top'
                });
                navigate(routes.home);
            })
            .catch((err: ApiError) => {
                if (err.statusCode === 401) {
                } else {
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
            .finally(() => onClose());
    };

    const submitEvent = async () => {
        let success = true;
        var fails = []
        for (var i = 0; i < passengerCount; i++) {
            let pass = {
                firstName: firstNames[i],
                lastName: lastNames[i],
                email: emails[i],
                confEmail: confEmails[i],
            };
            if(!(await validatePassenger(pass)) || emails[i] !== confEmails[i]) {
                fails.push(i);
                success = false;
            }
        }
        if (!success) {
            var message = "Incorrectly filled for passenger(s) ";
            for (var i = 0; i < fails.length; i++) {
                if ((fails.length - i) !== 1){
                    message = message + (fails[i] + 1) + ", ";
                } else {
                    message = message + (fails[i] + 1) + ".";
                }
            }
            toast({
                title: 'Error!',
                description: message,
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top'
            });
        }
        return success;
    }

    const validatePassenger = async (passenger: any) => {
        return await passengerSchema.isValid(passenger);
    }

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
    const renderPaymentDetails = () => {
        //switch statement defines flow based on payment type
        switch (savedPaymentData?.type) {
            //if users payment type is card
            case SavedPaymentType.CARD:
                return (
                    <VStack mt='1em' gap='1em' w='full'>
                        <HStack w='full' gap='1em'>
                            <FormControl>
                                <FormLabel>Card Number</FormLabel>
                                <Input />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Cardholder Name</FormLabel>
                                <Input />
                            </FormControl>
                        </HStack>
                        <HStack w='full' gap='1em'>
                            <FormControl>
                                <FormLabel>Expiry Date</FormLabel>
                                <Input />
                            </FormControl>
                            <FormControl>
                                <FormLabel>CCV</FormLabel>
                                <Input />
                            </FormControl>
                        </HStack>
                    </VStack>
                );
            // if users payment type is PayPal
            case SavedPaymentType.PAYPAL:
                return (
                    <VStack mt='1em' gap='1em' w='full'>
                        <FormControl>
                            <FormLabel>PayPal Email</FormLabel>
                            <Input />
                        </FormControl>
                        <Button rightIcon={<BiLinkExternal />}>Link PayPal Account</Button>
                    </VStack>
                );
            // if users payment type is PayPal
            case SavedPaymentType.DIRECT_DEBIT:
                return (
                    <HStack w='full' mt='1em' gap='1em'>
                        <FormControl>
                            <FormLabel>BSB</FormLabel>
                            <Input type='number' />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Account Number</FormLabel>
                            <Input type='number' />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Account Name</FormLabel>
                            <Input />
                        </FormControl>
                    </HStack>
                );
            //If user payment type is 'saved'
            case SavedPaymentType.SAVED:
                return (
                    <Select>
                        {([] as SavedPayment[]).map((s) => (
                            <option value={s.nickname}>{s.nickname}</option>
                        ))}
                    </Select>
                );
        }
    };

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
                    <form>
                        <Heading fontSize='xl'>Billing Details</Heading>
                        <VStack>
                            <HStack w='full'>
                                <FormControl flex={1}>
                                    <FormLabel>First Name</FormLabel>
                                    <Input />
                                </FormControl>
                                <FormControl flex={1}>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input />
                                </FormControl>
                            </HStack>
                            <FormControl>
                                <FormLabel>Company (optional)</FormLabel>
                                <Input />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Address line 1</FormLabel>
                                <Input />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Address line 2</FormLabel>
                                <Input />
                            </FormControl>
                            <HStack w='full'>
                                <FormControl flex={2}>
                                    <FormLabel>City</FormLabel>
                                    <Input />
                                </FormControl>
                                <FormControl flex={1}>
                                    <FormLabel>Postcode</FormLabel>
                                    <Input />
                                </FormControl>
                            </HStack>
                            <HStack w='full'>
                                <FormControl flex={2}>
                                    <FormLabel>Country</FormLabel>
                                    <Select>
                                        {countries.map((c) => (
                                            <option value={c}>{c}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl flex={1}>
                                    <FormLabel>State</FormLabel>
                                    <Input />
                                </FormControl>
                            </HStack>
                        </VStack>
                        <Heading fontSize='xl' mt='2em'>
                            Payment Details
                        </Heading>
                        <VStack>
                            <FormControl mt='1em'>
                                <FormLabel>Payment Type</FormLabel>
                                <Select
                                    value={savedPaymentData?.type}
                                    onChange={(event) =>
                                        setSavedPaymentData({ type: event.target.value } as SavedPayment)
                                    }
                                >
                                    <option>Select an option</option>
                                    <option value='card'>Card</option>
                                    <option value='directDebit'>Direct Debit</option>
                                    <option value='paypal'>PayPal</option>
                                    <option value='saved'>Saved Payment</option>
                                </Select>
                            </FormControl>
                            {renderPaymentDetails()}
                        </VStack>
                        {savedPaymentData?.type !== SavedPaymentType.SAVED && (
                            <Switch mt='2em'>Save payment for future transactions?</Switch>
                        )}
                        <HStack w='full' gap='1em' mt='2em'>
                            <Button onClick={handleBooking} colorScheme='red'>
                                Book Now
                            </Button>
                            <Button as={NavLink} to={routes.search} colorScheme='gray'>
                                Continue Searching
                            </Button>
                        </HStack>
                    </form>
                <Button leftIcon={<BsFillPlusCircleFill/>} onClick={() => setPassengerCount(passengerCount + 1)}>Add another passenger</Button>
                <Button
                    type='button'
                    colorScheme='red'
                    onClick={async () => {
                        if((await submitEvent())){
                            let passengers: Passenger[] = [];

                            for (var i = 0; i < passengerCount; i++) {
                                passengers.push({
                                    fname: firstNames[i],
                                    lname: lastNames[i],
                                    email: emails[i],
                                });
                            }


                            navigate(routes.booking, {
                                state: {
                                    passengers,
                                }
                            });
                        }
                    }}
                >Checkout</Button>
                  </Box>
            </Flex>
        </Flex>
    )};