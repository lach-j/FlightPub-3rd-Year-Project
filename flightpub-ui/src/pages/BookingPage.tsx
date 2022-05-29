import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  Select,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { BiLinkExternal, HiOutlineArrowNarrowRight } from 'react-icons/all';
import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import * as api from '../services/ApiService';
import { ApiError } from '../services/ApiService';
import { countries } from '../data/countries';
import { SavedPayment } from '../models';
import { dummySavedPayments } from '../data/SavedPayments';
import { NavLink } from 'react-router-dom';
import { routes } from '../constants/routes';
import { Booking } from '../models/Booking';
import { Flight } from '../models/Flight';
import { endpoints } from '../constants/endpoints';


export const BookingPage = ({cartState}: {cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>]}) => {
// SavedPayment takes DirectDebit, Card, Paypal and Saved payment types
  const [savedPaymentData, setSavedPaymentData] = useState<SavedPayment | null>(null);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [bookingRequest, setBookingRequest] = useState<Booking>({
    userId: 2,
    flightIds: []
  });
  const toast = useToast();

  const [cart,] = cartState;

  const handleBooking = (e: SyntheticEvent) => {
    e.preventDefault();
    onOpen();
      api
          .httpPost(endpoints.book, bookingRequest)
          .then(() => {
            toast({
              title: 'Booking Confirmed',
              description: 'Your booking was made successfully',
              status: 'success',
              duration: 9000,
              isClosable: true,
              position: 'top',
            });
          })
          .catch((err: ApiError) => {
            if (err.statusCode === 401) {
            } else {
              toast( {
                title: 'Error.',
                description:
                    'An internal error has occurred, please try again later.',
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top',
              });
            }
          })
          .finally(() => onClose());
    };

  useEffect(() => {
    setBookingRequest({...bookingRequest, flightIds: cart.map(flight => flight.id)})
  }, [cart]);

  const renderPaymentDetails = () => {

    //switch statement defines flow based on payment type
    switch (savedPaymentData?.type) {
      //if users payment type is card
      case 'card':
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
      case 'paypal':
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
      case 'directDebit':
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
      case 'saved':
        return (
          <Select>
            {dummySavedPayments.map(s => <option value={s.nickname}>{s.nickname}</option>)}
          </Select>
        );
    }
  };

  return (
    <Flex justifyContent='center' p='5em'>
      <Flex justifyContent='center' direction='column' w='50em'>
        <Heading fontSize='3xl' mb='1em'>Finalise Booking</Heading>
        <Text>Flights:</Text>
        <Accordion mb='1em' allowToggle={true} maxW='full' w='full'>
          {cart.map((flight) =>
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
            </AccordionItem>)}
        </Accordion>
        <Text mb='4em'>{`Subtotal: $${cart.reduce((partialSum, a) => partialSum + a.prices[0].price, 0)}`}</Text>
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
                  {countries.map((c) => <option value={c}>{c}</option>)}
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>State</FormLabel>
                <Input />
              </FormControl>
            </HStack>
          </VStack>
          <Heading fontSize='xl' mt='2em'>Payment Details</Heading>
          <VStack>
            <FormControl mt='1em'>
              <FormLabel>Payment Type</FormLabel>
              <Select value={savedPaymentData?.type}
                      onChange={(event) => setSavedPaymentData({ type: event.target.value } as SavedPayment)}>
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
            <Switch mt='2em'>Save payment for future transactions?</Switch>}
          <HStack w='full' gap='1em' mt='2em'>
            <Button onClick={handleBooking}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Spinner style={{ position: 'absolute', top: '50vh', left: '50vw' }} />
      </Modal>
    </Flex>
  );
};
