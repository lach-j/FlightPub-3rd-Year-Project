import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { Booking } from '../../models/Booking';
import { FlightListAccordian } from '../../components/FlightListAccordian';
import moment from 'moment';

export const BookingHistoryTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const { httpGet } = useApi(endpoints.bookings);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    httpGet('').then((bookings) => {
      setBookings(bookings);
    });
  }, []);

  return (
    <>
      <Heading mb='1em'>Booking History</Heading>
      <VStack gap='4'>
        {bookings.map((booking) => {
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
              <Text>Flights:</Text>
              <FlightListAccordian flights={booking.flights} />
            </Box>
          );
        })}
      </VStack>
    </>
  );
};
