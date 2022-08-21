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
  useToast
} from '@chakra-ui/react';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { ApiError, useApi } from '../services/ApiService';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { endpoints } from '../constants/endpoints';

export const ForgotPasswordPage = ({ redirectPath }: { redirectPath?: string }) => {
  useEffect(() => {
    document.title = 'FlightPub - Forgot Password';
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authRequest, setAuthRequest] = useState({ email: '' });
  const [errMessage, setErrMessage] = useState('');
  const toast = useToast();

  const navigate = useNavigate();
  const { httpPost } = useApi(endpoints.forgot);

  const redirectUser = () => {
    navigate(redirectPath || '/');
  };
  //Handles submission of user email from form
  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    //for when user forgets password
    setTimeout(() => {
      httpPost('', authRequest)
        .then((authResponse) => {
          toast({
            title: 'Email Sent',
            description:
              'If there is an account associated with the provided email, you will receive an email containing instructions to reset your password.',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top'
          });
          redirectUser();
        })
        //for invalid email address
        .catch((err: ApiError) => {
          if (err.statusCode === 400) {
            setAuthError(true);
            setErrMessage('The email is not a valid email address');
          } else if (err.statusCode === 202) {
            //for 202 error
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
        //if email is valid
        .finally(() => setLoading(false));
      return false;
    }, 1000);
    setAuthError(false);
  };

  //Handles update of email input, updating value
  const handleLoginDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthRequest({ ...authRequest, [event.target.name]: event.target.value });
  };
  return (
    <Center w='full' h='full' p='5'>
      <Box border='2px' borderColor='gray.200' p='10' borderRadius='2xl' w='md'>
        <form onSubmit={handleLogin}>
          <Stack spacing='12'>
            <Box>
              <Heading>Forgot Password?</Heading>
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
                  <FormErrorMessage>{errMessage}</FormErrorMessage>
                </FormControl>
              </Stack>
            </Box>
            <Button type='submit' isLoading={loading} colorScheme='red'>
              Send Reset Link
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
