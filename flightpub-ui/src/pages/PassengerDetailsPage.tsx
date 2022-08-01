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

import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { Flight } from '../models/Flight';
import { Navigate, useLocation } from 'react-router-dom';
import * as api from '../services/ApiService';
import { BiLinkExternal, HiOutlineArrowNarrowRight, BsFillPlusCircleFill } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';

export const PassengerDetailsPage = ({ cartState }: { cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>] }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const [cart, setCart] = cartState;
    const [flight, setFlight] = useState<Flight>();
    const [passengerCount, setPassengerCount] = useState<number>(1);
    const { state } = useLocation();

    const ticketOptions = [
        { key: 'BUS', label: 'Business Class' },
        { key: 'ECO', label: 'Economy' },
        { key: 'FIR', label: 'First Class' },
        { key: 'PME', label: 'Premium Economy' }
      ];


    useEffect(() => {
        const {result} = state as {result: Flight};
        setFlight(result);
    }, [state]);

    const renderFlightDetails = () => {
        if(typeof flight !== 'undefined') {
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
            forms.push(
                <VStack>
                    <Text>Passenger {i + 1}</Text>
                    <HStack w='full'>
                        <FormControl flex={1}>
                            <FormLabel>First Name</FormLabel>
                            <Input/>
                        </FormControl>
                        <FormControl flex={1}>
                            <FormLabel>Last Name</FormLabel>
                            <Input/>
                        </FormControl>
                    </HStack>
                    <HStack w='full'>
                        <FormControl flex={1}>
                            <FormLabel>Email Address</FormLabel>
                            <Input/>
                        </FormControl>
                        <FormControl flex={1}>
                            <FormLabel>Confirm Email Address</FormLabel>
                            <Input/>
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
            onClick={() => {
                if (typeof flight !== "undefined"){
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

