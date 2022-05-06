import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
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
import { endpoints } from '../constants/endpoints';

export const ForgotPasswordPage = ({
  redirectPath,
}: {
  redirectPath?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authRequest, setAuthRequest] = useState({ email: '' });
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
        .httpPost(endpoints.forgot, authRequest)
        .then((authResponse) => {
          redirectUser();
        })
        .catch((err: ApiError) => {
          if (err.statusCode === 400) {
            setAuthError(true);
            setErrMessage('The email is not a valid email address');
          } else if (err.statusCode === 202){}
          else {
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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAuthRequest({ ...authRequest, [event.target.name]: event.target.value });
  };
  return (
    <Grid w="100vw" h="100vh" p="5">
      <Center>
        <Box
          border="2px"
          borderColor="gray.200"
          p="10"
          borderRadius="2xl"
          w="md"
        >
          <form onSubmit={handleLogin}>
            <Stack spacing="12">
              <Box>
                <Heading>Forgot Password?</Heading>
              </Box>
              <Box>
                <Stack spacing="3">
                  <FormControl isDisabled={loading} isInvalid={authError}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      value={authRequest.email}
                      onChange={handleLoginDetailsChange}
                    />
                    <FormErrorMessage>{errMessage}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
              <Button type="submit" isLoading={loading} colorScheme="red">
                Send Reset Link
              </Button>
              <Box textAlign="center">
                Don't have an account?{' '}
                <Link as={RouteLink} to={routes.register}>
                  Register Here
                </Link>
              </Box>
            </Stack>
          </form>
        </Box>
      </Center>
    </Grid>
  );
};
