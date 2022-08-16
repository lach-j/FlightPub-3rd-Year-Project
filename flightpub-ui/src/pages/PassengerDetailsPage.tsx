import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useToast,
  VStack,
  Input,
  Select,
  Button,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';

import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
  useContext
} from 'react';
import { Flight } from '../models/Flight';
import { Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { BiLinkExternal, HiOutlineArrowNarrowRight, BsFillPlusCircleFill } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { UserContext } from '../services/UserContext';
import { Passenger } from '../models/Passenger';

export const PassengerDetailsPage = ({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = cartState;
  const [passengerCount, setPassengerCount] = useState<number>(1);

  const [firstNames, setFirstNames] = useState<string[]>(['']);
  const [lastNames, setLastNames] = useState<string[]>(['']);
  const [emails, setEmails] = useState<string[]>(['']);
  const [confEmails, setConfEmails] = useState<string[]>(['']);

  const ticketOptions = [
    { key: 'BUS', label: 'Business Class' },
    { key: 'ECO', label: 'Economy' },
    { key: 'FIR', label: 'First Class' },
    { key: 'PME', label: 'Premium Economy' }
  ];

  const { user, setUser } = useContext(UserContext);

  const passengerSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First name is required"),
    lastName: yup
      .string()
      .required("Last name is required"),
    email: yup.string().email('Email must be a valid email address').required("Email is required"),
    confEmail: yup.string().email('Confirm email must be a valid email address').required("Confirm email is required")
  });

  const submitEvent = async () => {
    let success = true;
    for (var i = 0; i < passengerCount; i++) {
      let pass = {
        firstName: firstNames[i],
        lastName: lastNames[i],
        email: emails[i],
        confEmail: confEmails[i]
      };
      if (!(await validatePassenger(pass, (i + 1)))) {
        success = false;
      }
    }
    return success;
  };

  const validatePassenger = async (passenger: any, index: number) => {
    let success = true;
    let errorArray: string[] = [];
    try {
        await passengerSchema.validate(passenger, { abortEarly: false });
      } catch (e) {
        if (e instanceof yup.ValidationError) {
            success = false;
            errorArray = e.errors;
        }
    }
    if (passenger.email !== passenger.confEmail) {
        success = false;
        errorArray.push("Emails do not match")
    }

    if (!success)
    toast({
        title: 'Incorrectly filled for Passenger ' + index,
        description: (
            <UnorderedList>
                {errorArray.map(e => (
                    <ListItem>{e}</ListItem>
                ))}
            </UnorderedList>
        ),
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    return success;
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
  };

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

    const handleAddPassenger = () => {
        firstNames.push('');
        lastNames.push('');
        emails.push('');
        confEmails.push('');
    }

    const handleRemovePassenger = (index: number)  => {
        firstNames.splice(index, 1);
        lastNames.splice(index, 1);
        emails.splice(index, 1);
        confEmails.splice(index, 1);
    }

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
                                <Input value={firstNames[0]} name='fname' onChange={handleChange(0)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Last Name</FormLabel>
                                <Input value={lastNames[0]} name='lname' onChange={handleChange(0)}/>
                            </FormControl>
                        </HStack>
                        <HStack w='full'>
                            <FormControl flex={1}>
                                <FormLabel>Email Address</FormLabel>
                                <Input value={emails[0]} name='email' onChange={handleChange(0)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Confirm Email Address</FormLabel>
                                <Input value={confEmails[0]} name='confemail' onChange={handleChange(0)}/>
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Class</FormLabel>
                            <Select>
                                {ticketOptions.map((o) => 
                                    <option value={o.key}>{o.label}</option>
                                )}
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
                                <Input value={firstNames[i]} name={'fname'} onChange={handleChange(i)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Last Name</FormLabel>
                                <Input value={lastNames[i]} name={'lname'} onChange={handleChange(i)}/>
                            </FormControl>
                        </HStack>
                        <HStack w='full'>
                            <FormControl flex={1}>
                                <FormLabel>Email Address</FormLabel>
                                <Input value={emails[i]} name={'email'} onChange={handleChange(i)}/>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Confirm Email Address</FormLabel>
                                <Input value={confEmails[i]} name={'confemail'} onChange={handleChange(i)}/>
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Class</FormLabel>
                            <Select>
                                {ticketOptions.map((o) => 
                                    <option value={o.key}>{o.label}</option>
                                )}
                            </Select>
                        </FormControl>
                        <Button
                            id={i.toString()}
                            colorScheme='gray'
                            name={i.toString()}
                            onClick={(e) => {
                                let index = Number(e.currentTarget.getAttribute("id"));
                                console.log(index);
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
    }

  const renderFlightDetails = () => {
    return (
      <Flex justifyContent='center' direction='column' w='50em'>
        <Heading fontSize='3xl' mb='1em'>
          Finalise Booking
        </Heading>
        <Text>Flights:</Text>
        <Accordion mb='1em' allowToggle={true} maxW='full' w='full'>
          {cart.map((flight) => (
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
      </Flex>
    );
  };

    if (!user) {
        navigate(routes.login, {state: {redirectUrl: routes.home}})
    }

  return (
    <Flex justifyContent='center' p='5em'>
        <Flex justifyContent='center' direction='column' w='50em'>
            {renderFlightDetails()}
            {renderPassengerForms()}
            <Button leftIcon={<BsFillPlusCircleFill/>} 
                onClick={() => {
                    handleAddPassenger();
                    setPassengerCount(passengerCount + 1);
                }}>Add another passenger</Button>
            <Button
            type='button'
            colorScheme='red'
            onClick={async () => {
                if(await submitEvent()){
                    let passengers: Passenger[] = [];

              for (var i = 0; i < passengerCount; i++) {
                passengers.push({
                  firstName: firstNames[i],
                  lastName: lastNames[i],
                  email: emails[i]
                });
              }

              navigate(routes.booking, {
                state: {
                  passengers
                }
              });
            }
          }}
        >
          Checkout
        </Button>
      </Flex>
    </Flex>
  );
};
