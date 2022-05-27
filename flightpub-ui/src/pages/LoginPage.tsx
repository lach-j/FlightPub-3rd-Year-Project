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
import { endpoints } from '../constants/endpoints';
import { routes } from '../constants/routes';

export const LoginPage = ({
                            redirectPath,
                          }: {
  redirectPath?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authRequest, setAuthRequest] = useState({ email: '', password: '' });
  const [errMessage, setErrMessage] = useState('');
  const toast = useToast();

  const navigate = useNavigate();
  const redirectUser = () => {
    navigate(redirectPath || '/');
  };
  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      api
        .httpPost(endpoints.login, authRequest)
        .then((authResponse) => {
          localStorage.setItem('bearer-token', authResponse.token);
          // TODO: dont store this in local storage
          redirectUser();
        })
        .catch((err: ApiError) => {
          if (err.statusCode === 401) {
            setAuthError(true);
            setErrMessage('The email and/or password is incorrect');
          } else if (err.statusCode === 400) {
            setAuthError(true);
            setErrMessage('All fields are required');
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
    setAuthRequest({ ...authRequest, [event.target.name]: event.target.value });
  };
  return (
    <Center w='full' h={'full'} p='5'>
      <Box
        border='2px'
        borderColor='gray.200'
        p='10'
        borderRadius='2xl'
        w='md'
      >
        <form onSubmit={handleLogin}>
          <Stack spacing='12'>
            <Box>
              <Heading>Sign In</Heading>
            </Box>
            <Box>
              <Stack spacing='3'>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name='email'
                    value={authRequest.email}
                    onChange={handleLoginDetailsChange}
                  />
                </FormControl>
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type='password'
                    name='password'
                    onChange={handleLoginDetailsChange}
                  />
                  <FormErrorMessage>{errMessage}</FormErrorMessage>
                </FormControl>
                <Box textAlign='right'>
                  <Link as={RouteLink} to={routes.forgotPassword}>
                    Forgot Password?
                  </Link>
                </Box>
              </Stack>
            </Box>
            <Button type='submit' isLoading={loading} colorScheme='red'>
              Log In
            </Button>
            <Box textAlign='center'>
              Don't have an account?{' '}
              <Link as={RouteLink} to={routes.register}>
                Register Here
              </Link>
            </Box>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};
