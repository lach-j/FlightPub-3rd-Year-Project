import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
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
    Button
  } from '@chakra-ui/react';

import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState, useContext} from 'react';
import { Flight } from '../models/Flight';
import { Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { BiLinkExternal, HiOutlineArrowNarrowRight, BsFillPlusCircleFill } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { UserContext } from '../services/UserContext';

export const PassengerDetailsPage = ({ cartState }: { cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>] }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const [cart, setCart] = cartState;
    const [flight, setFlight] = useState<Flight>();
    const [passengerCount, setPassengerCount] = useState<number>(1);
    const { state } = useLocation();

    const [firstNames, setFirstNames] =  useState<string[]>(['']);
    const [lastNames, setLastNames] =  useState<string[]>(['']);
    const [emails, setEmails] =  useState<string[]>(['']);
    const [confEmails, setConfEmails] =  useState<string[]>(['']);

    const ticketOptions = [
        { key: 'BUS', label: 'Business Class' },
        { key: 'ECO', label: 'Economy' },
        { key: 'FIR', label: 'First Class' },
        { key: 'PME', label: 'Premium Economy' }
      ];

    const { user, setUser } = useContext(UserContext);

    const passengerSchema = 
      yup.object().shape({
        firstName: yup.string().matches(/[a-zA-Z]/).required(),
        lastName: yup.string().matches(/[a-zA-Z]/).required(),
        email: yup.string().email('must be a valid email').required(),
        confEmail: yup.string().email('must be a valid email').required(),
      });

    useEffect(() => {
        const {result} = state as {result: Flight};
        setFlight(result);
    }, [state]);

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
            if(!(await validatePassenger(pass))) {
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
        if(flight) {
            return (
                <Flex justifyContent='center' direction='column' w='50em'>
                <Heading fontSize='3xl' mb='1em'>Finalise Booking</Heading>
                <Text>Flights:</Text>
                <Accordion mb='1em' allowToggle={true} maxW='full' w='full'>
                    <AccordionItem>
                    <h2>
                        <AccordionButton>
                        <Box flex='1' textAlign='left'>
                            <Flex width='full' justifyContent='space-between'>
                            <HStack>
                                <Text fontWeight='bold'>{flight.departureLocation.destinationCode}</Text>
                                <HiOutlineArrowNarrowRight />
                                <Text fontWeight='bold'>{flight.arrivalLocation.destinationCode}</Text>
                            </HStack>
                            <Text>{`$${flight.prices[0].price}`}</Text>
                            <Text>{flight.airlineCode}</Text>
                            </Flex>
                        </Box>
                        <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
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
                    </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                </Flex>
            );
        }
        else {
            return (<Flex></Flex>);
        }
    }

    const renderPassengerForms = () => {
        var forms = [];
        for (var i = 0; i < passengerCount; i++) {
            if (i === 0) {
                forms.push(
                    <VStack>
                        <Text>Passenger {i + 1}</Text>
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
                                {ticketOptions.map((o) => {
                                    <option value={o.key}>{o.label}</option>
                                })}
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
                        <Text>Passenger {i + 1}</Text>
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
                                {ticketOptions.map((o) => {
                                    <option value={o.key}>{o.label}</option>
                                })}
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
            {renderFlightDetails()}
            {renderPassengerForms()}
            <Button leftIcon={<BsFillPlusCircleFill/>} onClick={() => setPassengerCount(passengerCount + 1)}>Add another passenger</Button>
            <Button
            type='button'
            colorScheme='red'
            onClick={async () => {
                if (flight){
                    //checks here if flight in cart again just in case they somehow make their way to this page with a duplicate flight
                    if ([...cart.filter((cartItem) => cartItem.id === flight.id)].length > 0) {
                        toast({
                            title: 'Error!',
                            description: 'Flight already in cart!',
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                            position: 'top'
                        });
                    } else {
                        if((await submitEvent())){
                            setCart((cart) => [...cart, flight]);
                            toast({
                                title: 'Success!',
                                description: 'Flight added to cart successfully.',
                                status: 'success',
                                duration: 9000,
                                isClosable: true,
                                position: 'top'
                            });
                            navigate(routes.home);
                        }
                    }
                }
                else {
                    toast({
                        title: 'Error',
                        description: 'No flight present to add to cart',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                    });
                }
                }} >Add to Cart</Button>
        </Flex>
    </Flex>
)};

