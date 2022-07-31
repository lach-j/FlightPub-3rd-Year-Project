import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    Heading,
    HStack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useToast,
  } from '@chakra-ui/react';

import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { Flight } from '../models/Flight';
import { useLocation } from 'react-router-dom';
import * as api from '../services/ApiService';
import { BiLinkExternal, HiOutlineArrowNarrowRight } from 'react-icons/all';
import { relativeTimeRounding } from 'moment';

export const PassengerDetailsPage = ({ cartState }: { cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>] }) => {
    const toast = useToast();
    const [cart] = cartState;
    const [flight, setFlight] = useState<Flight>();
    const { state } = useLocation();


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
    

    return (
    <Flex justifyContent='center' p='5em'>
      {renderFlightDetails()}
    </Flex>
)};

