import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';

import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { BsFillPlusCircleFill, HiOutlineArrowNarrowRight } from 'react-icons/all';
import { UserContext } from '../services/UserContext';
import { HolidayCard } from '../components/HolidayCard';
import { HolidayPackage } from '../models/HolidayCardProps';
import { ApiError, useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Flight } from '../models';
import { Airport, findNearestAirport } from '../utility/geolocation';
import { routes } from '../constants/routes';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { PassengerDTO } from '../models/Passenger';
import { SavedPaymentType } from '../models/SavedPaymentTypes';
import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { countries } from '../data/countries';
import { PaymentDetailsForm } from '../components/PaymentDetailsForm';

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

export interface HolidayPackageBookingQuery {
  holidayPackageId: number;
  passengers: PassengerDTO[];
  flightIds: number[];
  payment: {
    type: string;
  };
}

export const HolidayPackageBookingPage = () => {
  const { packageId } = useParams();

  useEffect(() => {
    document.title = 'FlightPub - Bookings';
  });

  const getPackage = async () => {
    if (packageId) return await httpGetHolidayPackages(`/${parseInt(packageId)}`);
  };

  useEffect(() => {
    getPackage()
      .then(setHolidayPackage)
      .catch((err: ApiError) => {
        if (err.statusCode === 400) {
          toast({
            title: err.name,
            description: 'The requested session was not found',
            status: 'error'
          });
          navigate(routes.travelAgents.base);
        }
      });
  }, [packageId]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [paymentType, setPaymentType] = useState<SavedPaymentType | undefined>();
  const [passengerList, setPassengerList] = useState<PassengerDTO[]>([]);

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
  const billingDetailsSchema = yup.object().shape({
    firstName: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    lastName: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    company: yup.string(),
    addressLine1: yup.string().required(),
    addressLine2: yup.string(),
    city: yup
      .string()
      .matches(/[a-zA-Z]/)
      .required(),
    postCode: yup
      .string()
      .matches(/^\d{4}$/)
      .required(),
    state: yup.string().required()
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
      .required()
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
    accountName: yup.string().required()
  });

  const paypalSchema = yup.object().shape({
    email: yup.string().email('must be a valid email').required()
  });

  const [bookingRequest, setBookingRequest] = useState<HolidayPackageBookingQuery>({
    holidayPackageId: 1,
    flightIds: [],
    passengers: [],
    payment: {
      type: 'PAYPAL'
    }
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
        state: billingForm.state
      };

      if (!validateSchema(billingDetailsSchema, billingDetails)) {
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

      switch (paymentType?.toString()) {
        case 'CARD':
          paymentDetails = {
            cardNumber: cardForm.cardNumber,
            cardholder: cardForm.cardholder,
            expiryDate: cardForm.expiryDate,
            ccv: cardForm.ccv
          };
          if (!(await validateSchema(cardDetailsSchema, paymentDetails))) {
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
            accountName: directDebitForm.accountName
          };
          if (!(await validateSchema(directDebitDetailsSchema, paymentDetails))) {
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
            email: payPalEmail
          };
          if (!(await validateSchema(paypalSchema, paymentDetails))) {
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
  };

  const validateSchema = async (schema: yup.ObjectSchema<ObjectShape, any>, value: any) => {
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
  const [holidayPackage, setHolidayPackage] = useState<HolidayPackage>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => setUserLocation(position.coords));
  }, [packageId]);

  useEffect(() => {
    if (paymentType)
      setBookingRequest((br: any) => ({ ...br, payment: { ...br.payment, type: paymentType } }));
  }, [paymentType]);

  useEffect(() => {
    if (holidayPackage)
      setBookingRequest({
        ...bookingRequest,
        holidayPackageId: holidayPackage.id,
        flightIds: holidayPackage.flights.map((flight) => flight.id)
      });
  }, [holidayPackage]);

  useEffect(() => {
    if (passengerList)
      setBookingRequest({
        ...bookingRequest,
        passengers: passengerList
      });
  }, [passengerList]);

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [firstNames, setFirstNames] = useState<string[]>(['']);
  const [lastNames, setLastNames] = useState<string[]>(['']);
  const [emails, setEmails] = useState<string[]>(['']);
  const [confEmails, setConfEmails] = useState<string[]>(['']);
  //userLocation: Uses geoLocation to store users current position
  const [userLocation, setUserLocation] = useState<any>();

  const { httpGet: httpGetHolidayPackages } = useApi(endpoints.holidayPackages);
  const { httpPost } = useApi(endpoints.bookHolidayPackage);

  const ticketOptions = [
    { key: 'BUS', label: 'Business Class' },
    { key: 'ECO', label: 'Economy' },
    { key: 'FIR', label: 'First Class' },
    { key: 'PME', label: 'Premium Economy' }
  ];

  //airport: User's nearest airport for reccomendations
  const [airport, setAirport] = useState<Airport | undefined>();

  useEffect(() => {
    if (!userLocation) return;
    let airport = findNearestAirport([userLocation.longitude, userLocation.latitude]);
    setAirport(airport);
  }, [userLocation]);

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
  const updateBookingInfo = () => {
    let passengersList: PassengerDTO[] = [];

    for (var i = 0; i < passengerCount; i++) {
      passengersList.push({
        firstName: firstNames[i],
        lastName: lastNames[i],
        email: emails[i]
      });
    }
    setPassengerList(passengersList);
  };

  const handleCurrentUser = () => {
    if (user) {
      let tempFNames = [...firstNames];
      tempFNames[0] = user.firstName;
      setFirstNames(tempFNames);

      let tempLNames = [...lastNames];
      tempLNames[0] = user.lastName;
      setLastNames(tempLNames);

      let tempEmails = [...emails];
      tempEmails[0] = user.email;
      setEmails(tempEmails);

      let tempConfEmails = [...confEmails];
      tempConfEmails[0] = user.email;
      setConfEmails(tempConfEmails);
    } else {
      toast({
        title: 'Error!',
        description: 'Not logged in!',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'fname':
        let tempFNames = [...firstNames];
        tempFNames[index] = event.target.value;
        setFirstNames(tempFNames);
        break;
      case 'lname':
        let tempLNames = [...lastNames];
        tempLNames[index] = event.target.value;
        setLastNames(tempLNames);
        break;
      case 'email':
        let tempEmails = [...emails];
        tempEmails[index] = event.target.value;
        setEmails(tempEmails);
        break;
      case 'confemail':
        let tempConfEmails = [...confEmails];
        tempConfEmails[index] = event.target.value;
        setConfEmails(tempConfEmails);
        break;
    }
    updateBookingInfo();
  };

  const renderFlightDetails = () => {
    return (
      <Box>
        <Text>Flights:</Text>
        <Accordion mb='1em' allowToggle={true} maxW='full' w='full'>
          {holidayPackage?.flights.map((flight) => (
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
                      <Text>{flight.airline.airlineCode}</Text>
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
      </Box>
    );
  };

  const renderPackageInfo = () => {
    return (
      <Flex justifyContent='center' direction='column' w='3xl'>
        <Text>{}</Text>
        <Heading fontSize='3xl' mb='1em'>
          Finalise Holiday Booking
        </Heading>
        <TableContainer>
          <Table size='lg' variant='striped'>
            <Thead>
              <Tr>
                <Th>Holiday Package Items</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>PackageId</Td>
                <Td>{holidayPackage?.id}</Td>
              </Tr>
              <Tr>
                <Td>Package Name</Td>
                <Td>{holidayPackage?.packageName}</Td>
              </Tr>
              <Tr>
                <Td>Package Accomodation</Td>
                <Td>{holidayPackage?.accommodation}</Td>
              </Tr>
              <Tr>
                <Td>Package Price (ex. Flights)</Td>
                <Td>${holidayPackage?.price}</Td>
              </Tr>
              <Tr>
                <Td>Flight Information: </Td>
                <Td>{renderFlightDetails()}</Td>
              </Tr>
              <Tr>
                <Td>Total Cost: </Td>
                <Td>
                  <Text mb='4em'>{`$${holidayPackage?.flights.reduce(
                    (partialSum, a) => partialSum + a.prices[0].price,
                    holidayPackage?.price
                  )}`}</Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    );
  };
  const handleAddPassenger = () => {
    firstNames.push('');
    lastNames.push('');
    emails.push('');
    confEmails.push('');
  };

  const handleRemovePassenger = (index: number) => {
    firstNames.splice(index, 1);
    lastNames.splice(index, 1);
    emails.splice(index, 1);
    confEmails.splice(index, 1);
  };
  const renderPassengerForms = () => {
    var forms = [];
    for (var i = 0; i < passengerCount; i++) {
      if (i === 0) {
        forms.push(
          <VStack>
            <Text>Passenger {i + 1}</Text>
            <HStack w='full'>
              <FormControl flex={1}>
                <FormLabel>First Name</FormLabel>
                <Input value={firstNames[0]} name='fname' onChange={handleChange(0)} />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Last Name</FormLabel>
                <Input value={lastNames[0]} name='lname' onChange={handleChange(0)} />
              </FormControl>
            </HStack>
            <HStack w='full'>
              <FormControl flex={1}>
                <FormLabel>Email Address</FormLabel>
                <Input value={emails[0]} name='email' onChange={handleChange(0)} />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Confirm Email Address</FormLabel>
                <Input value={confEmails[0]} name='confemail' onChange={handleChange(0)} />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Class</FormLabel>
              <Select>
                {ticketOptions.map((o) => (
                  <option value={o.key}>{o.label}</option>
                ))}
              </Select>
            </FormControl>
            <Text
              as='u'
              colorScheme='gray'
              onClick={() => {
                handleCurrentUser();
              }}
            >
              {' '}
              Set as Me
            </Text>
          </VStack>
        );
      } else {
        forms.push(
          <VStack>
            <Text>Passenger {i + 1}</Text>
            <HStack w='full'>
              <FormControl flex={1}>
                <FormLabel>First Name</FormLabel>
                <Input value={firstNames[i]} name={'fname'} onChange={handleChange(i)} />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Last Name</FormLabel>
                <Input value={lastNames[i]} name={'lname'} onChange={handleChange(i)} />
              </FormControl>
            </HStack>
            <HStack w='full'>
              <FormControl flex={1}>
                <FormLabel>Email Address</FormLabel>
                <Input value={emails[i]} name={'email'} onChange={handleChange(i)} />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Confirm Email Address</FormLabel>
                <Input value={confEmails[i]} name={'confemail'} onChange={handleChange(i)} />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Class</FormLabel>
              <Select>
                {ticketOptions.map((o) => (
                  <option value={o.key}>{o.label}</option>
                ))}
              </Select>
            </FormControl>
            <Button
              id={i.toString()}
              colorScheme='gray'
              name={i.toString()}
              onClick={(e) => {
                let index = Number(e.currentTarget.getAttribute('id'));
                handleRemovePassenger(index);
                setPassengerCount(passengerCount - 1);
              }}
            >
              {' '}
              Remove
            </Button>
          </VStack>
        );
      }
    }
    return forms;
  };

  return (
    <Flex justifyContent='center' p='2em'>
      <Flex justifyContent='center' direction='column' w='60em'>
        <Center>
          <Box>
            {holidayPackage ? (
              <HolidayCard data={holidayPackage} showBookButton={false}></HolidayCard>
            ) : (
              <h1>Nothing here, please check back later!</h1>
            )}
          </Box>
        </Center>
        <br />
        <Box p='6' rounded='md'>
          {renderPackageInfo()}
          {renderPassengerForms()}
          <Button
            leftIcon={<BsFillPlusCircleFill />}
            onClick={() => {
              handleAddPassenger();
              setPassengerCount(passengerCount + 1);
            }}
          >
            Add another passenger
          </Button>
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
                  onFieldChange={onPaymentFieldChange}
                  paymentType={paymentType}
                />
              )}
            </VStack>
            {paymentType !== SavedPaymentType.SAVED && (
              <Switch mt='2em'>Save payment for future transactions?</Switch>
            )}
            <HStack w='full' gap='1em' mt='2em'>
              <Button
                onClick={async () => {
                  if (await submitEvent()) {
                    handleBooking();
                  }
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
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Spinner style={{ position: 'absolute', top: '50vh', left: '50vw' }} />
      </Modal>
    </Flex>
  );
};
