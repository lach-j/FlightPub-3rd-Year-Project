import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  HStack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack
} from '@chakra-ui/react';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { Flight } from '../models';

export const FlightListAccordian = ({ flights }: { flights: Flight[] }) => {
  const renderStopOver = (flight: Flight) => {
    if (flight?.stopOverLocation) {
      return (
        <Stat textAlign='center' flex='none'>
          {(flight?.stopOverLocation.destinationCode || 'NONE') && (
            <>
              <Stat textAlign='center' flex='none'>
                <StatLabel>
                  {new Date(flight?.arrivalTimeStopOver || '').toLocaleString('en-AU', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hour12: false
                  }) +
                    ' - ' +
                    new Date(flight?.departureTimeStopOver || '').toLocaleString('en-AU', {
                      timeStyle: 'short',
                      hour12: false
                    })}
                </StatLabel>
                <StatNumber>{flight?.stopOverLocation.destinationCode || 'NONE'}</StatNumber>
                <StatHelpText>STOPOVER</StatHelpText>
              </Stat>
            </>
          )}
        </Stat>
      );
    } else {
      return (
        <Stat textAlign='center' flex='none'>
          <StatLabel></StatLabel>
          <StatNumber>NO</StatNumber>
          <StatHelpText>STOPOVER</StatHelpText>
        </Stat>
      );
    }
  };

  return (
    <Accordion mb='1em' allowToggle={true} maxW='full' w='full'>
      {flights.map((flight) => {
        let priceSorted = flight.prices.sort((a, b) => a.price - b.price);
        return (
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  <Flex width='full' justifyContent='space-between'>
                    {flight?.cancelled && <Badge colorScheme='red'>CANCELLED</Badge>}
                    <HStack>
                      <Text fontWeight='bold'>{flight.departureLocation.destinationCode}</Text>
                      <HiOutlineArrowNarrowRight />
                      <Text fontWeight='bold'>{flight.arrivalLocation.destinationCode}</Text>
                    </HStack>
                    <Text>{`$${priceSorted.at(0)?.price} - ${priceSorted.at(-1)?.price}`}</Text>
                    <Text>{flight.airline.airlineCode}</Text>
                  </Flex>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <VStack>
                <Flex w='full' justifyContent='space-between' alignItems='center'>
                  <Stat textAlign='left' flex='none'>
                    <StatLabel>
                      {new Date(flight?.departureTime).toLocaleString('en-AU', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        hour12: false
                      })}
                    </StatLabel>
                    <StatNumber>{flight?.departureLocation.destinationCode}</StatNumber>
                    <StatHelpText>DEPARTURE</StatHelpText>
                  </Stat>
                  <HiOutlineArrowNarrowRight />
                  {renderStopOver(flight)}
                  <HiOutlineArrowNarrowRight />
                  <Stat textAlign='right' flex='none'>
                    <StatLabel>
                      {new Date(flight?.arrivalTime).toLocaleString('en-AU', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        hour12: false
                      })}
                    </StatLabel>
                    <StatNumber>{flight?.arrivalLocation.destinationCode}</StatNumber>
                    <StatHelpText>ARRIVAL</StatHelpText>
                  </Stat>
                </Flex>
                <HStack w='full' justify='space-between'>
                  {flight.prices.map((price) => {
                    return (
                      <HStack>
                        <Text title={price.ticketClass?.details} fontWeight='bold'>
                          {price.ticketClass?.classCode}:
                        </Text>
                        <Text>${price.price}</Text>
                      </HStack>
                    );
                  })}
                </HStack>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
