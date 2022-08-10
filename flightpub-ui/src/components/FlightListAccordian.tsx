import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  Flex,
  HStack,
  AccordionIcon,
  AccordionPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text
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
      {flights.map((flight) => (
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
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
