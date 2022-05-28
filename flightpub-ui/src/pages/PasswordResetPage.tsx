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
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import * as api from '../services/ApiService';
import { ApiError } from '../services/ApiService';
import { Link as RouteLink, useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { endpoints } from '../constants/endpoints';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const PasswordResetPage = ({
                                    redirectPath,
                                  }: {
  redirectPath?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [resetRequest, setResetRequest] = useState<{
    password: string;
    confirm: string;
    token: string | null;
  }>({ password: '', confirm: '', token: null });
  const [errMessage, setErrMessage] = useState('');
  const toast = useToast();
  const query = useQuery();

  const isEmpty = (fields: string[]): boolean => {
    return fields.some((f) => f === undefined || f === null || f === '');
  };

  useEffect(() => {
    setResetRequest({ ...resetRequest, token: query.get('token') });
  }, [query]);

  const navigate = useNavigate();
  const redirectUser = () => {
    navigate(redirectPath || '/');
  };
  const handleReset = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isEmpty([resetRequest.password, resetRequest.confirm])) {
      setAuthError(true);
      setErrMessage('Both fields are mandatory');
      setLoading(false);
      return;
    }

    if (resetRequest.password !== resetRequest.confirm) {
      setAuthError(true);
      setErrMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      api
        .httpPost(endpoints.reset, resetRequest)
        .then((authResponse) => {
          redirectUser();
        })
        .catch((err: ApiError) => {
          if (err.statusCode === 400) {
            setAuthError(true);
            setErrMessage('All fields are mandatory');
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

  const handleResetDetailsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setResetRequest({
      ...resetRequest,
      [event.target.name]: event.target.value,
    });
  };

  if (!resetRequest.token) {
    return (
      <Grid w='100vw' h='100vh' p='5'>
        <Center>
          <Spinner />
        </Center>
      </Grid>
    );
  }

  return (
    <Grid w='100vw' h='100vh' p='5'>
      <Center>
        <Box
          border='2px'
          borderColor='gray.200'
          p='10'
          borderRadius='2xl'
          w='md'
        >
          <form onSubmit={handleReset}>
            <Stack spacing='12'>
              <Box>
                <Heading>Reset Password</Heading>
              </Box>
              <Box>
                <Stack spacing='3'>
                  <FormControl isDisabled={loading} isInvalid={authError}>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      name='password'
                      type='password'
                      value={resetRequest.password}
                      onChange={handleResetDetailsChange}
                    />
                  </FormControl>
                  <FormControl isDisabled={loading} isInvalid={authError}>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type='password'
                      name={'confirm'}
                      onChange={handleResetDetailsChange}
                    />
                    <FormErrorMessage>{errMessage}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
              <Button type='submit' isLoading={loading} colorScheme='red'>
                Reset password
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
    </Grid>
  );
};
