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
  VStack
} from '@chakra-ui/react';
import { BiLinkExternal, HiOutlineArrowNarrowRight } from 'react-icons/all';
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
  useContext
} from 'react';
import { useApi } from '../services/ApiService';
import { ApiError } from '../services/ApiService';
import { countries } from '../data/countries';
import { SavedPayment } from '../models';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { routes } from '../constants/routes';
import { Booking } from '../models/Booking';
import { Flight } from '../models/Flight';
import { endpoints } from '../constants/endpoints';
import { Passenger } from '../models/Passenger';
import { PaymentType, SavedPaymentType } from '../models/SavedPaymentTypes';
import { UserContext } from '../services/UserContext';
import { FlightListAccordian } from '../components/FlightListAccordian';
import { PaymentDetailsForm } from '../components/PaymentDetailsForm';
import { TypeOf } from 'yup';
import * as yup from 'yup';

export const BookingPage = ({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) => {
  useEffect(() => {
    document.title = 'FlightPub - Bookings';
  });
  // SavedPayment takes DirectDebit, Card, Paypal and Saved payment types
  const [paymentType, setPaymentType] = useState<SavedPaymentType | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bookingRequest, setBookingRequest] = useState<any>({
    userId: 0,
    flightIds: [],
    passengers: []
  });
  const toast = useToast();
  const { httpPost } = useApi(endpoints.book);
  const [cart, setCart] = cartState;
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const { state } = useLocation();

  const billingDetailsSchema = yup.object().shape({
    firstName: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    lastName: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    company: yup
      .string(),
    addressLine1: yup
      .string()
      .required(),
    addressLine2: yup
      .string(),
    city: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    postCode: yup
      .string()
      .matches(/^\d{4}$/)
      .required(),
    state: yup
      .string()
      .required(),
  });

  const cardDetailsSchema = yup.object().shape({
    cardNumber: yup
      .string()
      .matches(/^\d{16}$/)
      .required(),
    cardHolderName: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    expiryDate: yup
      .string()
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
      .required(),
    cvv: yup
      .string()
      .matches(/^\d{3}$/)
      .required(),
  });

  const directDebitDetailsSchema = yup.object().shape({
    bsb: yup
      .string()
      .matches(/^\d{6}$/)
      .required(),
    accountNumber: yup
      .string()
      .matches(/^\d{12}$/)
      .required(),
    accountName: yup
      .string()
      .required(),
  });

  const handleBooking = (e: SyntheticEvent) => {
    e.preventDefault();
    onOpen();
    httpPost('', bookingRequest)
      .then(() => {
        toast({
          title: 'Booking Confirmed',
          description: 'Your booking was made successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top'
        });
        setCart([]);
        navigate(routes.home);
      })
      .catch((err: ApiError) => {
        if (err.statusCode === 401) {
        } else {
          toast({
            title: 'Error.',
            description: 'An internal error has occurred, please try again later.',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top'
          });
        }
      })
      .finally(() => onClose());
  };

  const onPaymentFieldChange = (field: string, value: any) => {
    setBookingRequest((br: any) => ({ ...br, payment: { ...br.payment, [field]: value } }));
  };

  useEffect(() => {
    const { passengers } = state as { passengers: Passenger[] };
    setBookingRequest({
      ...bookingRequest,
      passengers: passengers,
      flightIds: cart.map((flight) => flight.id)
    });
  }, [state]);

  useEffect(() => {
    if (paymentType)
      setBookingRequest((br: any) => ({ ...br, payment: { ...br.payment, type: paymentType } }));
  }, [paymentType]);

  return (
    <Flex justifyContent='center' p='5em'>
      <Flex justifyContent='center' direction='column' w='50em'>
        <Heading fontSize='3xl' mb='1em'>
          Finalise Booking
        </Heading>
        <Text>Flights:</Text>
        <FlightListAccordian flights={cart} />
        <Text mb='4em'>{`Subtotal: $${cart.reduce(
          (partialSum, a) => partialSum + a.prices[0].price,
          0
        )}`}</Text>
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
                  {countries.map((c) => (
                    <option value={c}>{c}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>State</FormLabel>
                <Input />
              </FormControl>
            </HStack>
          </VStack>
          <Heading fontSize='xl' mt='2em'>
            Payment Details
          </Heading>
          <VStack>
            <FormControl mt='1em'>
              <FormLabel>Payment Type</FormLabel>
              <Select
                value={paymentType?.toString()}
                onChange={(event) =>
                  setPaymentType(
                    SavedPaymentType[event.target.value as keyof typeof SavedPaymentType]
                  )
                }
              >
                <option>Select an option</option>
                <option value={SavedPaymentType.CARD}>Card</option>
                <option value={SavedPaymentType.DIRECT_DEBIT}>Direct Debit</option>
                <option value={SavedPaymentType.PAYPAL}>PayPal</option>
                <option value={SavedPaymentType.SAVED}>Saved Payment</option>
              </Select>
            </FormControl>
            {paymentType && (
              <PaymentDetailsForm onFieldChange={onPaymentFieldChange} paymentType={paymentType} />
            )}
          </VStack>
          {paymentType !== SavedPaymentType.SAVED && (
            <Switch mt='2em'>Save payment for future transactions?</Switch>
          )}
          <HStack w='full' gap='1em' mt='2em'>
            <Button onClick={handleBooking} colorScheme='red'>
              Book Now
            </Button>
            <Button as={NavLink} to={routes.search} colorScheme='gray'>
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
