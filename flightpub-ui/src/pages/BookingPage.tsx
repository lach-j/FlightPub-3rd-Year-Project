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
  useContext,
  ChangeEvent
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
import { ObjectShape } from 'yup/lib/object';

export interface BillingDetails {
  firstName: string,
  lastName: string,
  company: string,
  addressLine1: string,
  addressLine2: string,
  city: string,
  postCode: string,
  state: string,
}

export interface CardDetails {
  cardNumber: string,
  cardholder: string,
  expiryDate: string,
  ccv: string,
}

export interface DirectDebitDetails {
  bsb: string,
  accountNumber: string,
  accountName: string,
}

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
    userId: 2,
    flightIds: [],
    passengers: []
  });
  
  const [billingForm, setBillingForm] = useState<BillingDetails>({
    firstName: "",
    lastName: "",
    company: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postCode: "",
    state: "",
  });
  const [cardForm, setCardForm] = useState<CardDetails>({
    cardNumber: "",
    cardholder: "",
    expiryDate: "",
    ccv: "",
  });
  const [directDebitForm, setDirectDebitForm] = useState<DirectDebitDetails>({
    bsb: "",
    accountNumber: "",
    accountName: "",
  });
  const [payPalEmail, setPayPalEmail] = useState<string>("");

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
    cardholder: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    expiryDate: yup
      .string()
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
      .required(),
    ccv: yup
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

  const paypalSchema = yup.object().shape({
    email: yup.string().email('must be a valid email').required(),
  });

  const submitEvent = async () => {
    let success = true;
    let pType = paymentType?.toString();
    if (pType) {
      let billingDetails = {
        firstName: billingForm.firstName,
        lastName: billingForm.lastName,
        company: billingForm.company,
        addressLine1: billingForm.addressLine1,
        addressLine2: billingForm.addressLine2,
        city: billingForm.city,
        postCode: billingForm.postCode,
        state: billingForm.state,
      }

      if (!(await validateSchema(billingDetailsSchema, billingDetails))){
        success = false;
        toast({
          title: 'Error!',
          description: 'Invalid billing details. Please try again!',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top'
        });
      }

      var paymentDetails;

      switch(paymentType?.toString()){
        case 'CARD':
          paymentDetails = {
            cardNumber: cardForm.cardNumber,
            cardholder: cardForm.cardholder,
            expiryDate: cardForm.expiryDate,
            ccv: cardForm.ccv,
          }
          if (!(await validateSchema(cardDetailsSchema, paymentDetails))){
            success = false;
            toast({
              title: 'Error!',
              description: 'Invalid card details. Please try again!',
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top'
            });
          }
          break;
        case 'DIRECT_DEBIT':
          paymentDetails = {
           bsb: directDebitForm.bsb,
           accountNumber: directDebitForm.accountNumber,
           accountName: directDebitForm.accountName,
          }
          if (!(await validateSchema(directDebitDetailsSchema, paymentDetails))){
            success = false;
            toast({
              title: 'Error!',
              description: 'Invalid direct debit details. Please try again!',
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top'
            });
          }
          break;
        case 'PAYPAL':
          paymentDetails = {
            email: payPalEmail,
          }
          if (!(await validateSchema(paypalSchema, paymentDetails))){
            success = false;
            toast({
              title: 'Error!',
              description: 'Invalid paypal email. Please try again!',
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top'
            });
          }
          break;
      }
    } else {
      success = false;
      toast({
        title: 'Error!',
        description: 'Please select a payment type before proceeding!',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    }
    return success;
  }

  const validateSchema = async (schema: yup.ObjectSchema<ObjectShape, any>, value: any) => {
    return await schema.isValid(value);
  }

  const handleBillingChange = (fieldValue: keyof BillingDetails) => (e: ChangeEvent<HTMLInputElement>) => {
      setBillingForm(billingForm => ({...billingForm, [fieldValue]: e.target.value}));
    }

  const handleCardChange = (field: string,  value: any) => {
      setCardForm(cardForm => ({...cardForm, [field]: value}));
    }

  const handleDirectDebitChange = (field: string, value: any) => {
    setDirectDebitForm(directDebitForm => ({...directDebitForm, [field]: value}));
  }

  const handlePayPalChange = (value: any) => {
    if (typeof value == 'string')
      setPayPalEmail(value);
  }

  const handleBooking = () => {
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
    switch(paymentType?.toString()){
      case 'CARD':
        handleCardChange(field, value);
        break;
      case 'DIRECT_DEBIT':
        handleDirectDebitChange(field, value);
        break;
      case 'PAYPAL':
        handlePayPalChange(value);
        break;
    }
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

  if (!user) {
    navigate(routes.login, {state: {redirectUrl: routes.home}})
  } 

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
                <Input onChange={handleBillingChange('firstName')}/>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Last Name</FormLabel>
                <Input onChange={handleBillingChange('lastName')}/>
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Company (optional)</FormLabel>
              <Input onChange={handleBillingChange('company')}/>
            </FormControl>
            <FormControl>
              <FormLabel>Address line 1</FormLabel>
              <Input onChange={handleBillingChange('addressLine1')}/>
            </FormControl>
            <FormControl>
              <FormLabel>Address line 2</FormLabel>
              <Input onChange={handleBillingChange('addressLine2')}/>
            </FormControl>
            <HStack w='full'>
              <FormControl flex={2}>
                <FormLabel>City</FormLabel>
                <Input onChange={handleBillingChange('city')}/>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Postcode</FormLabel>
                <Input onChange={handleBillingChange('postCode')}/>
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
                <Input onChange={handleBillingChange('state')}/>
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
            <Button onClick={async () => {
              if(await submitEvent())
                handleBooking();
              }} 
              colorScheme='red'>
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
