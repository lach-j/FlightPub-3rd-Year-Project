import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  useToast
} from '@chakra-ui/react';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { ApiError, useApi } from '../services/ApiService';
import { Link as RouteLink, NavLink, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { User } from '../models/User';
import { endpoints } from '../constants/endpoints';
import { FaArrowRight } from 'react-icons/fa';
import * as yup from 'yup';

const userDetailsSchema = yup.object().shape({
  firstName: yup.string().required('First Name is a required field'),
  lastName: yup.string().required('Last Name is a required field'),
  email: yup.string().email('Invalid email').required('Email is a required field'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'Password must contain at least one uppercase, one lowercase and 1 numeric character.'
    )
    .required('Password is a required field')
});

export const RegisterPage = () => {
  useEffect(() => {
    document.title = 'FlightPub - Register';
  });

  const [loading, setLoading] = useState(false);
  //authError: boolean state, set to true when a registration error has occured
  const [authError, setAuthError] = useState(false);

  //authRequest : stores registration request with email, password, firstName, lastName parameters
  const [registerRequest, setRegisterRequest] = useState<User>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const toast = useToast();
  const { httpPost } = useApi(endpoints.users);

  //enables react programmatic navigation
  const navigate = useNavigate();
  const redirectUser = () => {
    navigate(routes.login);
  };

  //Handles registration event for registration form
  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!(await dataIsValid())) return;

    setLoading(true);
    setTimeout(() => {
      httpPost('', registerRequest) //posts registration request
        .then((authResponse) => {
          toast({
            title: 'Account Created',
            description:
              'Your account was created successfully, you can now sign in to your FlightPub account!',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top'
          });
          redirectUser();
        })
        .catch((err: ApiError) => {
          //if an error occurs in registration process
          if (err.statusCode === 401) {
            setAuthError(true);
          } else if (err.statusCode === 409) {
            toast({
              title: 'User Already Exists',
              description: (
                <Text>
                  An account with this username already exists, if you cannot access your account
                  try <Link href={routes.forgotPassword}>reseting your password</Link>.
                </Text>
              ),
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top'
            });
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
        .finally(() => setLoading(false));
      return false;
    }, 1000);
    setAuthError(false); //reset authError boolean on page reload
  };
  //Handles update of registration form inputs, updating value(s)
  const handleLoginDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterRequest({
      ...registerRequest,
      [event.target.name]: event.target.value
    });
  };

  const dataIsValid = async () => {
    if (await userDetailsSchema.isValid(registerRequest)) return true;

    try {
      await userDetailsSchema.validate(registerRequest, { abortEarly: false });
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        toast({
          title: 'Invalid Details',
          description: (
            <UnorderedList>
              {e.errors.map((e) => (
                <ListItem>{e}</ListItem>
              ))}
            </UnorderedList>
          ),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top'
        });
      }
    }
  };

  return (
    <Center w='full' h='full' p='5'>
      <Box border='2px' borderColor='gray.200' p='10' borderRadius='2xl' w='md'>
        <form onSubmit={handleRegister}>
          <Stack spacing='12'>
            <HStack justify='space-between'>
              <Heading>Sign Up</Heading>
              <Button as={NavLink} to={routes.home} variant='ghost' rightIcon={<FaArrowRight />}>
                Continue as guest
              </Button>
            </HStack>
            <Box>
              <Stack spacing='3'>
                {/* Email input */}
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name='email'
                    value={registerRequest.email}
                    onChange={handleLoginDetailsChange}
                  />

                  {/* Firstname input */}
                </FormControl>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name='firstName'
                    value={registerRequest.firstName}
                    onChange={handleLoginDetailsChange}
                  />
                  {/* LastName input */}
                </FormControl>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name='lastName'
                    value={registerRequest.lastName}
                    onChange={handleLoginDetailsChange}
                  />
                </FormControl>
                {/* Password input */}
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type='password'
                    name='password'
                    value={registerRequest.password}
                    onChange={handleLoginDetailsChange}
                  />

                  {/* Error message popup */}
                  <FormErrorMessage>
                    The email and/or password provided are incorrect
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Box>
            {/* Form submission button */}
            <Button type='submit' isLoading={loading} colorScheme='red'>
              Sign Up
            </Button>
            {/* Button redirects user to sign-in page */}
            <Box textAlign='center'>
              Already have an account?{' '}
              <Link as={RouteLink} to={routes.login}>
                Sign In
              </Link>
            </Box>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};
