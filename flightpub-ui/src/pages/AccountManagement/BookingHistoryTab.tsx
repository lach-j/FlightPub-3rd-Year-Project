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
import { useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { Booking } from '../../models/Booking';
import { FlightListAccordian } from '../../components/FlightListAccordian';
import moment from 'moment';
import { SavedPaymentComponent } from './SavedPaymentComponent';

export const BookingHistoryTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const { httpGet } = useApi(endpoints.bookings);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortFunction, setSortFunction] = useState<string>('bookedDesc');

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
        return (a: Booking, b: Booking) => getTotalCost(a) - getTotalCost(b);

      case 'priceDesc':
        return (a: Booking, b: Booking) => getTotalCost(b) - getTotalCost(a);
    }
    return () => 1;
  };

  const getTotalCost = (booking: Booking) => {
    let total = 0;
    booking.passengers.forEach((passenger) => {
      booking.flights.forEach((flight) => {
        let price = flight.prices.find(
          (p) => p.ticketClass?.classCode === passenger.ticketClass?.classCode
        );
        total += price?.price || 0;
      });
    });
    return total;
  };

  return (
    <>
      <Heading mb='1em'>Booking History</Heading>
      <Box mb='4'>
        <Select
          value={sortFunction}
          onChange={(e) => setSortFunction(e.target.value)}
          w='fit-content'
        >
          <option value='bookedDesc'>Newest</option>
          <option value='bookedAsc'>Oldest</option>
          <option value='priceAsc'>Cheapest</option>
          <option value='priceDesc'>Most Expensive</option>
        </Select>
      </Box>
      <VStack gap='4'>
        {bookings.length === 0 && <Text>You have no bookings.</Text>}
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
              <HStack alignItems='baseline' justifyContent='space-between'>
                <Box>
                  <Text mt='4' mb='2'>
                    Passengers:
                  </Text>
                  <OrderedList>
                    {booking.passengers?.map((p) => (
                      <ListItem>
                        <HStack>
                          <Text>{`${p.firstName} ${p.lastName} - ${p.email}`}</Text>
                          <Text decoration='underline' title={p.ticketClass?.details}>
                            [{p.ticketClass?.classCode}]
                          </Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </OrderedList>

                  <Text mt='4'>
                    <Text fontWeight='bold'>Total Cost:</Text>
                    {' $'}
                    {getTotalCost(booking)}
                  </Text>
                </Box>
                {booking?.payment?.type && (
                  <Box>
                    <Text mb='4'>Payment Used:</Text>
                    <SavedPaymentComponent
                      showButtons={false}
                      showSmall
                      payment={{ nickname: '', payment: booking.payment }}
                    ></SavedPaymentComponent>
                  </Box>
                )}
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </>
  );
};
