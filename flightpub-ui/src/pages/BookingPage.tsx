import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, Button,
  Flex, FormControl, FormLabel,
  Heading, HStack, Input, Select, Stat, StatHelpText, StatLabel, StatNumber, Switch, Text, VStack,
} from '@chakra-ui/react';
import {BiLinkExternal, HiOutlineArrowNarrowRight} from 'react-icons/all';
import React, {useState} from 'react';

import {flights} from "../data/flights";
import {countries} from "../data/countries";
import {SavedPayment} from "./AccountManagement/SavedPaymentTypes";
import {dummySavedPayments} from "../data/SavedPayments";
import {NavLink} from "react-router-dom";
import {routes} from "../constants/routes";


export const BookingPage = () => {

  const [savedPaymentData, setSavedPaymentData] = useState<SavedPayment | null>(null);
  const bookedFlights = flights.slice(2, 4);

  const renderPaymentDetails = () => {
    switch (savedPaymentData?.type) {
      case 'card':
        return (
          <VStack mt={'1em'} gap={'1em'} w={'full'}><HStack w={'full'} gap={'1em'}>
            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input/>
            </FormControl>
            <FormControl>
              <FormLabel>Cardholder Name</FormLabel>
              <Input/>
            </FormControl></HStack><HStack w={'full'} gap={'1em'}>
            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input/>
            </FormControl>
            <FormControl>
              <FormLabel>CCV</FormLabel>
              <Input/>
            </FormControl></HStack>
          </VStack>
        );
      case 'paypal':
        return (
          <VStack mt={'1em'} gap={'1em'} w={'full'}>
            <FormControl>
              <FormLabel>PayPal Email</FormLabel>
              <Input/>
            </FormControl>
            <Button rightIcon={<BiLinkExternal/>}>Link PayPal Account</Button>
          </VStack>
        );
      case 'directDebit':
        return (
          <HStack w={'full'} mt={'1em'} gap={'1em'}>
            <FormControl>
              <FormLabel>BSB</FormLabel>
              <Input type={'number'}/>
            </FormControl>
            <FormControl>
              <FormLabel>Account Number</FormLabel>
              <Input type={'number'}/>
            </FormControl>
            <FormControl>
              <FormLabel>Account Name</FormLabel>
              <Input/>
            </FormControl>
          </HStack>
        );
      case 'saved':
        return (
          <Select>
            {dummySavedPayments.map(s => <option value={s.nickname}>{s.nickname}</option>)}
          </Select>
        )
    }
  };

  return (
    <Flex justifyContent={'center'} p={'5em'}>
      <Flex justifyContent={'center'} direction={'column'} w={'50em'}>
        <Heading fontSize={'3xl'} mb={'1em'}>Finalise Booking</Heading>
        <Text>Flights:</Text>
        <Accordion mb={'1em'} allowToggle={true} maxW={'full'} w={'full'}>
          {bookedFlights.map((flight) =>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    <Flex width={'full'} justifyContent={'space-between'}>
                      <HStack>
                        <Text fontWeight={'bold'}>{flight.DepartureCode}</Text>
                        <HiOutlineArrowNarrowRight/>
                        <Text fontWeight={'bold'}>{flight.ArrivalCode}</Text>
                      </HStack>
                      <Text>{`$${flight.Price}`}</Text>
                      <Text>{flight.AirlineName}</Text>
                    </Flex>
                  </Box>
                  <AccordionIcon/>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}><Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                <Stat textAlign={'left'} flex={'none'}>
                  <StatLabel>{new Date(flight?.DepartureTime).toLocaleString('en-AU', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hour12: false
                  })}</StatLabel>
                  <StatNumber>{flight?.DepartureCode}</StatNumber>
                  <StatHelpText>DEPARTURE</StatHelpText>
                </Stat>
                {flight?.StopOverCode && <>
                    <HiOutlineArrowNarrowRight/>
                    <Stat textAlign={'center'} flex={'none'}>
                        <StatLabel>{new Date(flight?.ArrivalTimeStopOver || '').toLocaleString('en-AU', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                          hour12: false
                        }) + " - " + new Date(flight?.DepartureTimeStopOver || '').toLocaleString('en-AU', {
                          timeStyle: 'short',
                          hour12: false
                        })}</StatLabel>
                        <StatNumber>{flight?.StopOverCode}</StatNumber>
                        <StatHelpText>STOPOVER</StatHelpText>
                    </Stat></>}
                <HiOutlineArrowNarrowRight/>
                <Stat textAlign={'right'} flex={'none'}>
                  <StatLabel>{new Date(flight?.ArrivalTime).toLocaleString('en-AU', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hour12: false
                  })}</StatLabel>
                  <StatNumber>{flight?.ArrivalCode}</StatNumber>
                  <StatHelpText>ARRIVAL</StatHelpText>
                </Stat>
              </Flex>
              </AccordionPanel>
            </AccordionItem>)}
        </Accordion>
        <Text mb={'4em'}>{`Subtotal: $${bookedFlights.reduce((partialSum, a) => partialSum + a.Price, 0)}`}</Text>
        <form>
          <Heading fontSize={'xl'}>Billing Details</Heading>
          <VStack>
            <HStack w={'full'}>
              <FormControl flex={1}>
                <FormLabel>First Name</FormLabel>
                <Input/>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Last Name</FormLabel>
                <Input/>
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Company (optional)</FormLabel>
              <Input/>
            </FormControl>
            <FormControl>
              <FormLabel>Address line 1</FormLabel>
              <Input/>
            </FormControl>
            <FormControl>
              <FormLabel>Address line 2</FormLabel>
              <Input/>
            </FormControl>
            <HStack w={'full'}>
              <FormControl flex={2}>
                <FormLabel>City</FormLabel>
                <Input/>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Postcode</FormLabel>
                <Input/>
              </FormControl>
            </HStack>
            <HStack w={'full'}>
              <FormControl flex={2}>
                <FormLabel>Country</FormLabel>
                <Select>
                  {countries.map((c) => <option value={c}>{c}</option>)}
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>State</FormLabel>
                <Input/>
              </FormControl>
            </HStack>
          </VStack>
          <Heading fontSize={'xl'} mt={'2em'}>Payment Details</Heading>
          <VStack>
            <FormControl mt={'1em'}>
              <FormLabel>Payment Type</FormLabel>
              <Select value={savedPaymentData?.type}
                      onChange={(event) => setSavedPaymentData({type: event.target.value} as SavedPayment)}>
                <option>Select an option</option>
                <option value='card'>Card</option>
                <option value='directDebit'>Direct Debit</option>
                <option value='paypal'>PayPal</option>
                <option value='saved'>Saved Payment</option>
              </Select>
            </FormControl>
            {renderPaymentDetails()}
          </VStack>
          {savedPaymentData?.type !== 'saved' &&
              <Switch mt={'2em'}>Save payment for future transactions?</Switch>}
          <HStack w={'full'} gap={'1em'} mt={'2em'}>
            <Button
              colorScheme={'red'}
            >
              Book Now
            </Button>
            <Button
              as={NavLink}
              to={routes.search}
              colorScheme={'gray'}
            >
              Continue Searching
            </Button>
          </HStack>
        </form>
      </Flex>
    </Flex>
  )
}