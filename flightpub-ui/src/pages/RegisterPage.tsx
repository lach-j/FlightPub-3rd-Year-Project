import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  useToast,
} from '@chakra-ui/react';
import React, { SyntheticEvent, useState } from 'react';
import * as api from '../services/ApiService';
import { ApiError } from '../services/ApiService';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { User } from '../models/User';
import { endpoints } from '../constants/endpoints';

export const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [registerRequest, setRegisterRequest] = useState<User>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const toast = useToast();

  const navigate = useNavigate();
  const redirectUser = () => {
    navigate(routes.login);
  };

  const handleRegister = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      api
        .httpPost(endpoints.users, registerRequest)
        .then((authResponse) => {
          toast({
            title: 'Account Created',
            description:
              'Your account was created successfully, you can now sign in to your FlightPub account!',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top',
          });
          redirectUser();
        })
        .catch((err: ApiError) => {
          if (err.statusCode === 401) {
            setAuthError(true);
          } else {
            toast({
              title: 'Error.',
              description:
                'An internal error has occurred, please try again later.',
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top',
            });
          }
        })
        .finally(() => setLoading(false));
      return false;
    }, 1000);
    setAuthError(false);
  };

  const handleLoginDetailsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRegisterRequest({
      ...registerRequest,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <Center w='full' h='full' p='5'>
      <Box
        border='2px'
        borderColor='gray.200'
        p='10'
        borderRadius='2xl'
        w='md'
      >
        <form onSubmit={handleRegister}>
          <Stack spacing='12'>
            <Box>
              <Heading>Sign Up</Heading>
            </Box>
            <Box>
              <Stack spacing='3'>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name='email'
                    value={registerRequest.email}
                    onChange={handleLoginDetailsChange}
                  />
                </FormControl>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name='firstName'
                    value={registerRequest.firstName}
                    onChange={handleLoginDetailsChange}
                  />
                </FormControl>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name='lastName'
                    value={registerRequest.lastName}
                    onChange={handleLoginDetailsChange}
                  />
                </FormControl>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type='password'
                    name='password'
                    value={registerRequest.password}
                    onChange={handleLoginDetailsChange}
                  />
                  <FormErrorMessage>
                    The email and/or password provided are incorrect
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Box>
            <Button type='submit' isLoading={loading} colorScheme='red'>
              Sign Up
            </Button>
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
