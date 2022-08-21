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
  Stack,
  useToast
} from '@chakra-ui/react';
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { ApiError, useApi } from '../services/ApiService';
import { Link as RouteLink, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { endpoints } from '../constants/endpoints';
import { routes } from '../constants/routes';
import { UserContext } from '../services/UserContext';
import { User } from '../models';
import { FaArrowRight } from 'react-icons/fa';

export const LoginPage = ({ redirectPath }: { redirectPath?: string }) => {
  const [loading, setLoading] = useState(false);
  //authError: boolean state, set to true when a login error has occured
  const [authError, setAuthError] = useState(false);

  const { user, setUser } = useContext(UserContext);

  //authRequest : stores login request with email and password as parameters
  const [authRequest, setAuthRequest] = useState({ email: '', password: '' });

  //errMessage: Defines error message when authError is true for toast popups
  const [errMessage, setErrMessage] = useState('');
  const toast = useToast();

  //enables react programmatic navigation
  const navigate = useNavigate();
  const { state } = useLocation();
  const redirectUser = () => {
    navigate((state as { redirectUrl?: string })?.redirectUrl || redirectPath || '/');
  };

  const handlePostLogin = (user: User) => {
    localStorage.setItem('user-id', `${user.id}`);
    setUser(user);
  };

  const { httpPost } = useApi(endpoints.login);

  //Handles login event for login form
  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault(); //prevents stand HTML form submission protocol
    setLoading(true);
    setTimeout(() => {
      httpPost('', authRequest) //send authrequest
        .then((authResponse) => {
          localStorage.setItem('bearer-token', authResponse.token); //stores login token locally
          handlePostLogin(authResponse.user);
          redirectUser();
        })
        .catch((err: ApiError) => {
          //if an error occurs
          //ERROR: Invalid email/password
          if (err.statusCode === 401) {
            setAuthError(true);
            setErrMessage('The email and/or password is incorrect');
            //ERROR: Field not filled
          } else if (err.statusCode === 400) {
            setAuthError(true);
            setErrMessage('All fields are required');
          } else {
            //All other errors
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
    setAuthError(false);
  };

  useEffect(() => {
    if (user) redirectUser();
  }, [user]);

  //Handles update of login input, updating value(s)
  const handleLoginDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthRequest({ ...authRequest, [event.target.name]: event.target.value });
  };
  return (
    <Center w='full' h='full' p='5'>
      <Box border='2px' borderColor='gray.200' p='10' borderRadius='2xl' w='md'>
        <form onSubmit={handleLogin}>
          <Stack spacing='12'>
            <HStack justify='space-between'>
              <Heading>Sign In</Heading>
              <Button as={NavLink} to={routes.home} variant='ghost' rightIcon={<FaArrowRight />}>
                Continue as guest
              </Button>
            </HStack>
            <Box>
              <Stack spacing='3'>
                {/* email input */}
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name='email'
                    value={authRequest.email}
                    onChange={handleLoginDetailsChange}
                  />
                </FormControl>

                {/* password input */}
                <FormControl isDisabled={loading} isInvalid={authError}>
                  <FormLabel>Password</FormLabel>
                  <Input type='password' name='password' onChange={handleLoginDetailsChange} />
                  {/* Handles error messages */}
                  <FormErrorMessage>{errMessage}</FormErrorMessage>
                </FormControl>

                {/* Forgot password button */}
                <Box textAlign='right'>
                  <Link as={RouteLink} to={routes.forgotPassword}>
                    Forgot Password?
                  </Link>
                </Box>
              </Stack>
            </Box>
            {/* Form submission button */}
            <Button type='submit' isLoading={loading} colorScheme='red'>
              Log In
            </Button>
            {/* Redirects to registration page */}
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
