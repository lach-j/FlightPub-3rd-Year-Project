import {
  Box,
  Heading,
  HStack,
  ListItem,
  OrderedList,
  Select,
  Text,
  VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { Booking } from '../../models/Booking';
import { FlightListAccordian } from '../../components/FlightListAccordian';
import moment from 'moment';
import { number } from 'yup';

export const BookingHistoryTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const { httpGet } = useApi(endpoints.bookings);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortFunction, setSortFunction] = useState<string>('');

  useEffect(() => {
    httpGet('').then((bookings) => {
      setBookings(bookings);
    });
  }, []);

  const getSortMethod = () => {
    switch (sortFunction) {
      case 'bookedDesc':
        return (a: Booking, b: Booking) =>
          moment(a.dateBooked).isBefore(moment(b.dateBooked)) ? 1 : -1;

      case 'bookedAsc':
        return (a: Booking, b: Booking) =>
          moment(a.dateBooked).isBefore(moment(b.dateBooked)) ? -1 : 1;

      case 'priceAsc':
        return (a: Booking, b: Booking) =>
          a.flights.reduce((a, b) => a + b.prices[0].price, 0) -
          b.flights.reduce((a, b) => a + b.prices[0].price, 0);

      case 'priceDesc':
        return (a: Booking, b: Booking) =>
          b.flights.reduce((a, b) => a + b.prices[0].price, 0) -
          a.flights.reduce((a, b) => a + b.prices[0].price, 0);
    }
    return () => 1;
  };

  return (
    <>
      <Heading mb='1em'>Booking History</Heading>
      <Box mb='4'>
        <Select onChange={(e) => setSortFunction(e.target.value)} w='fit-content'>
          <option value='bookedDesc'>Newest</option>
          <option value='bookedAsc'>Oldest</option>
          <option value='priceAsc'>Cheapest</option>
          <option value='priceDesc'>Most Expensive</option>
        </Select>
      </Box>
      <VStack gap='4'>
        {bookings.sort(getSortMethod()).map((booking) => {
          const date =
            booking?.dateBooked instanceof Date
              ? booking?.dateBooked
              : new Date(`${booking?.dateBooked}Z`);

          return (
            <Box w='full' border='solid 1px gray' p='4' rounded={'md'}>
              <HStack w='full' mb='3' justify={'space-between'}>
                <Text>Booked: {moment(date).format('DD/MM/yyy HH:mm')}</Text>
                <Text>Reference Number: {booking.id}</Text>
              </HStack>
              <Text mb='2'>Flights:</Text>
              <FlightListAccordian flights={booking.flights} />
              <Text mt='4' mb='2'>
                Passengers:
              </Text>
              <OrderedList>
                {booking.passengers?.map((p) => (
                  <ListItem>{`${p.firstName} ${p.lastName} - ${p.email}`}</ListItem>
                ))}
              </OrderedList>
              <Text mt='4'>
                <Text fontWeight='bold'>Total Cost:</Text>
                {' $'}
                {booking.flights.reduce((a, b) => a + b.prices[0].price, 0)}
              </Text>
            </Box>
          );
        })}
      </VStack>
    </>
  );
};
