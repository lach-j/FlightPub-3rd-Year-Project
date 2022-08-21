import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  ListItem,
  Modal,
  ModalOverlay,
  OrderedList,
  Select,
  Spinner,
  Switch,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';
import { ApiError, useApi } from '../services/ApiService';
import { countries } from '../data/countries';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { Flight } from '../models/Flight';
import { endpoints } from '../constants/endpoints';
import { Passenger, PassengerDTO } from '../models/Passenger';
import { SavedPaymentType } from '../models/SavedPaymentTypes';
import { UserContext } from '../services/UserContext';
import { FlightListAccordian } from '../components/FlightListAccordian';
import { PaymentDetailsForm } from '../components/PaymentDetailsForm';
import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';

export interface BillingDetails {
  firstName: string;
  lastName: string;
  company: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  state: string;
}

export interface CardDetails {
  cardNumber: string;
  cardholder: string;
  expiryDate: string;
  ccv: string;
}

export interface DirectDebitDetails {
  bsb: string;
  accountNumber: string;
  accountName: string;
}

export const BookingPage = ({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) => {
  useEffect(() => {
    if (cartState[0].length <= 0) {
      toast({
        title: 'No Items In Cart',
        description: 'You must have at least 1 flight in your cart to checkout.',
        status: 'error',
        position: 'top'
      });
      navigate(routes.home);
    }
  }, [cartState[0]]);

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
    firstName: '',
    lastName: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postCode: '',
    state: ''
  });
  const [cardForm, setCardForm] = useState<CardDetails>({
    cardNumber: '',
    cardholder: '',
    expiryDate: '',
    ccv: ''
  });
  const [directDebitForm, setDirectDebitForm] = useState<DirectDebitDetails>({
    bsb: '',
    accountNumber: '',
    accountName: ''
  });
  const [payPalEmail, setPayPalEmail] = useState<string>('');

  const toast = useToast();
  const { httpPost } = useApi(endpoints.book);
  const [cart, setCart] = cartState;
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const { state } = useLocation();

  const billingDetailsSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    company: yup.string(),
    addressLine1: yup.string().required('Address line  is required'),
    addressLine2: yup.string(),
    city: yup.string().required('City is required'),
    postCode: yup
      .string()
      .matches(/^\d{4}$/, 'Postcode must be 4 digits')
      .required('Postcode is required'),
    state: yup.string().required('State is required')
  });

  const cardDetailsSchema = yup.object().shape({
    cardNumber: yup
      .string()
      .matches(/^\d{16}$/, 'Card number must be 16 digits')
      .required('Card number is required'),
    cardholder: yup.string().required('Card holder name is required'),
    expiryDate: yup
      .string()
      .matches(
        /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
        'Expiry date must be valid and follow format DD/YY'
      )
      .required('Expiry date is required'),
    ccv: yup
      .string()
      .matches(/^\d{3}$/, 'CCV must be 3 digits')
      .required('CCV is required')
  });

  const directDebitDetailsSchema = yup.object().shape({
    bsb: yup
      .string()
      .matches(/^\d{6}$/, 'BSB must be 6 digits')
      .required('BSB is required'),
    accountNumber: yup
      .string()
      .matches(/^\d{12}$/, 'Account number must be 12 digits')
      .required('Account number is required'),
    accountName: yup.string().required('Account name is required')
  });

  const paypalSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email').required('Email is required')
  });

  const submitEvent = async () => {
    let success = true;
    let pType = paymentType?.toString();
    if (pType && bookingRequest?.payment) {
      let billingDetails = {
        firstName: billingForm.firstName,
        lastName: billingForm.lastName,
        company: billingForm.company,
        addressLine1: billingForm.addressLine1,
        addressLine2: billingForm.addressLine2,
        city: billingForm.city,
        postCode: billingForm.postCode,
        state: billingForm.state
      };

      if (!(await validateSchema(billingDetailsSchema, billingDetails, 'Billing details'))) {
        success = false;
      }

      var paymentDetails;

      switch (paymentType?.toString()) {
        case 'CARD':
          paymentDetails = {
            cardNumber: cardForm.cardNumber,
            cardholder: cardForm.cardholder,
            expiryDate: cardForm.expiryDate,
            ccv: cardForm.ccv
          };
          if (!(await validateSchema(cardDetailsSchema, paymentDetails, 'Card details'))) {
            success = false;
          }
          break;
        case 'DIRECT_DEBIT':
          paymentDetails = {
            bsb: directDebitForm.bsb,
            accountNumber: directDebitForm.accountNumber,
            accountName: directDebitForm.accountName
          };
          if (
            !(await validateSchema(
              directDebitDetailsSchema,
              paymentDetails,
              'Direct debit details'
            ))
          ) {
            success = false;
          }
          break;
        case 'PAYPAL':
          paymentDetails = {
            email: payPalEmail
          };
          if (!(await validateSchema(paypalSchema, paymentDetails, 'Paypal email'))) {
            success = false;
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
  };

  const validateSchema = async (
    schema: yup.ObjectSchema<ObjectShape, any>,
    value: any,
    formName: string
  ) => {
    let success = true;
    let errorArray: string[] = [];
    try {
      await schema.validate(value, { abortEarly: false });
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        success = false;
        errorArray = e.errors;
      }
    }

    if (!success)
      toast({
        title: formName + ' filled out incorrectly:',
        description: (
          <UnorderedList>
            {errorArray.map((e) => (
              <ListItem>{e}</ListItem>
            ))}
          </UnorderedList>
        ),
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });

    return await schema.isValid(value);
  };

  const handleBillingChange =
    (fieldValue: keyof BillingDetails) => (e: ChangeEvent<HTMLInputElement>) => {
      setBillingForm((billingForm) => ({ ...billingForm, [fieldValue]: e.target.value }));
    };

  const handleCardChange = (field: string, value: any) => {
    setCardForm((cardForm) => ({ ...cardForm, [field]: value }));
  };

  const handleDirectDebitChange = (field: string, value: any) => {
    setDirectDebitForm((directDebitForm) => ({ ...directDebitForm, [field]: value }));
  };

  const handlePayPalChange = (value: any) => {
    if (typeof value == 'string') setPayPalEmail(value);
  };

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
    switch (paymentType?.toString()) {
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
    if (!state || !(state as { passengers: Passenger[] })?.passengers) {
      navigate(routes.home);
      return;
    }
    const { passengers } = state as { passengers: Passenger[] };
    setBookingRequest({
      ...bookingRequest,
      passengers: passengers,
      flightIds: cart.map((flight) => flight.id)
    });
  }, [state]);

  useEffect(() => {
    if (paymentType && paymentType !== SavedPaymentType.SAVED)
      setBookingRequest((br: any) => ({ ...br, payment: { type: paymentType } }));
  }, [paymentType]);

  if (!user) {
    navigate(routes.login, { state: { redirectUrl: routes.home } });
  }

  const getTotalCost = () => {
    const booking: { passengers: [{ ticketClass: string }]; flights: Flight[] } = {
      passengers: bookingRequest.passengers,
      flights: cart
    };

    let total = 0;
    booking.passengers.forEach((passenger) => {
      booking.flights.forEach((flight) => {
        let price = flight.prices.find((p) => p.ticketClass.classCode === passenger.ticketClass);
        total += price?.price || 0;
      });
    });
    return total;
  };

  return (
    <Flex justifyContent='center' p='5em'>
      <Flex justifyContent='center' direction='column' w='50em'>
        <Heading fontSize='3xl' mb='1em'>
          Finalise Booking
        </Heading>
        <Text>Flights:</Text>
        <FlightListAccordian flights={cart} />
        <Text mt='4' mb='2'>
          Passengers:
        </Text>
        <OrderedList mb='3'>
          {bookingRequest.passengers?.map((p: PassengerDTO) => (
            <ListItem>
              <HStack>
                <Text>{`${p.firstName} ${p.lastName} - ${p.email}`}</Text>
                <Text decoration='underline'>[{p.ticketClass}]</Text>
              </HStack>
            </ListItem>
          ))}
        </OrderedList>
        <Text
          fontSize='xl'
          textDecoration='underline'
          mb='4em'
        >{`Subtotal: $${getTotalCost()}`}</Text>
        <form>
          <Heading fontSize='xl'>Billing Details</Heading>
          <VStack>
            <HStack w='full'>
              <FormControl flex={1}>
                <FormLabel>First Name</FormLabel>
                <Input onChange={handleBillingChange('firstName')} />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Last Name</FormLabel>
                <Input onChange={handleBillingChange('lastName')} />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Company (optional)</FormLabel>
              <Input onChange={handleBillingChange('company')} />
            </FormControl>
            <FormControl>
              <FormLabel>Address line 1</FormLabel>
              <Input onChange={handleBillingChange('addressLine1')} />
            </FormControl>
            <FormControl>
              <FormLabel>Address line 2</FormLabel>
              <Input onChange={handleBillingChange('addressLine2')} />
            </FormControl>
            <HStack w='full'>
              <FormControl flex={2}>
                <FormLabel>City</FormLabel>
                <Input onChange={handleBillingChange('city')} />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Postcode</FormLabel>
                <Input onChange={handleBillingChange('postCode')} />
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
                <Input onChange={handleBillingChange('state')} />
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
              <PaymentDetailsForm
                savedPaymentSelected={(p) => {
                  setBookingRequest((br: any) => ({
                    ...br,
                    payment: p ? { ...p, type: p.type } : undefined
                  }));
                }}
                onFieldChange={onPaymentFieldChange}
                paymentType={paymentType}
              />
            )}
          </VStack>
          {paymentType && paymentType !== SavedPaymentType.SAVED && (
            <Switch
              mt='2em'
              onChange={(e) => {
                setBookingRequest((br: any) => ({ ...br, savePayment: e.target.checked }));
              }}
            >
              Save payment for future transactions?
            </Switch>
          )}
          <HStack w='full' gap='1em' mt='2em'>
            <Button
              onClick={async () => {
                if (await submitEvent()) handleBooking();
              }}
              colorScheme='red'
            >
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
