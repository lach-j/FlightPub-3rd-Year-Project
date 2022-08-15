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
import moment from 'moment';
import { SavedPaymentComponent } from './SavedPaymentComponent';
import { HolidayPackageBooking } from '../../models/HolidayPackageBooking';
import { HolidayCard } from '../../components/HolidayCard';

export const HolidayBookingHistoryTab = ({
  setIsLoading
}: {
  setIsLoading: (value: boolean) => void;
}) => {
  const { httpGet } = useApi(endpoints.packageBookings);
  const [bookings, setBookings] = useState<HolidayPackageBooking[]>([]);
  const [sortFunction, setSortFunction] = useState<string>('');

  useEffect(() => {
    httpGet('').then((bookings) => {
      setBookings(bookings);
    });
  }, []);

  const getSortMethod = () => {
    switch (sortFunction) {
      case 'bookedDesc':
        return (a: HolidayPackageBooking, b: HolidayPackageBooking) =>
          moment(a.dateBooked).isBefore(moment(b.dateBooked)) ? 1 : -1;

      case 'bookedAsc':
        return (a: HolidayPackageBooking, b: HolidayPackageBooking) =>
          moment(a.dateBooked).isBefore(moment(b.dateBooked)) ? -1 : 1;

      case 'priceAsc':
        return (a: HolidayPackageBooking, b: HolidayPackageBooking) =>
          a.booking.flights.reduce((a, b) => a + b.prices[0].price, 0) -
          b.booking.flights.reduce((a, b) => a + b.prices[0].price, 0);

      case 'priceDesc':
        return (a: HolidayPackageBooking, b: HolidayPackageBooking) =>
          b.booking.flights.reduce((a, b) => a + b.prices[0].price, 0) -
          a.booking.flights.reduce((a, b) => a + b.prices[0].price, 0);
    }
    return () => 1;
  };

  return (
    <>
      <Heading mb='1em'>Holiday Booking History</Heading>
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
              <VStack>
                <HolidayCard data={booking.holidayPackage} showBookButton={false}></HolidayCard>
              </VStack>
              <HStack alignItems='baseline' justifyContent='space-between'>
                <Box>
                  <Text mt='2' mb='2'>
                    Passengers:
                  </Text>
                  <OrderedList>
                    {booking.booking.passengers?.map((p) => (
                      <ListItem>{`${p.firstName} ${p.lastName} - ${p.email}`}</ListItem>
                    ))}
                  </OrderedList>
                  <Text mt='4'>
                    <Text fontWeight='bold'>Total Flight Cost:</Text>
                    {' $'}
                    {booking.holidayPackage.flights.reduce((a, b) => a + b.prices[0].price, 0)}
                  </Text>
                  <Text mt='2'>
                    <Text fontWeight='bold'>Total Cost (inc. Package):</Text>
                    {' $'}
                    {booking.holidayPackage.flights.reduce(
                      (a, b) => a + b.prices[0].price,
                      booking.holidayPackage?.price
                    )}
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
