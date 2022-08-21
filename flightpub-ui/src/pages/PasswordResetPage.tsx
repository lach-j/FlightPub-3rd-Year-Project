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
  ListItem,
  Spinner,
  Stack,
  UnorderedList,
  useToast
} from '@chakra-ui/react';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { ApiError, useApi } from '../services/ApiService';
import { Link as RouteLink, useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { endpoints } from '../constants/endpoints';
import * as yup from 'yup';

const userDetailsSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'Password must contain at least one uppercase, one lowercase and 1 numeric character.'
    )
    .required('Password is a required field')
});

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const PasswordResetPage = ({ redirectPath }: { redirectPath?: string }) => {
  useEffect(() => {
    document.title = 'FlightPub - Reset Password';
  });

  const [loading, setLoading] = useState(false);
  //authError : boolean flag determining if an error has occurred
  const [authError, setAuthError] = useState(false);

  const { httpPost } = useApi(endpoints.reset);

  //resetRequest : contains password reset data to be sent to password reset API
  const [resetRequest, setResetRequest] = useState<{
    password: string;
    confirm: string;
    token: string | null;
  }>({ password: '', confirm: '', token: null });

  //errMessage: Defines error message when authError is true for toast popups
  const [errMessage, setErrMessage] = useState('');
  const toast = useToast();
  const query = useQuery();

  //Determines if input is empty for form fields
  const isEmpty = (fields: string[]): boolean => {
    return fields.some((f) => f === undefined || f === null || f === '');
  };

  //sets resetRequest token on-load
  useEffect(() => {
    setResetRequest({ ...resetRequest, token: query.get('token') });
  }, [query]);

  //enables react programmatic navigation
  const navigate = useNavigate();

  //handler for page redirects
  const redirectUser = () => {
    navigate(redirectPath || '/');
  };

  //Password reset handler
  const handleReset = async (e: SyntheticEvent) => {
    e.preventDefault(); //prevents stand HTML form submission protocol
    if (!(await dataIsValid())) return;

    setLoading(true);

    //if form fields are empty
    if (isEmpty([resetRequest.password, resetRequest.confirm])) {
      setAuthError(true);
      setErrMessage('Both fields are mandatory');
      setLoading(false);
      return;
    }
    //if password does not match re-entered confirmation password
    if (resetRequest.password !== resetRequest.confirm) {
      setAuthError(true);
      setErrMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      httpPost('', resetRequest)
        .then((authResponse) => {
          redirectUser();
        })
        .catch((err: ApiError) => {
          //if an error occurs
          if (err.statusCode === 400) {
            //if not all fields filled
            setAuthError(true);
            setErrMessage('All fields are mandatory');
          } else if (err.statusCode === 401) {
            toast({
              title: 'Invalid Token',
              description:
                'This link is invalid or has expired, please request a new reset link and try again.',
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'top'
            });
          } else {
            //for all other errors
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

  const dataIsValid = async () => {
    if (await userDetailsSchema.isValid(resetRequest)) return true;

    try {
      await userDetailsSchema.validate(resetRequest, { abortEarly: false });
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

  //Handles update of reset password input, updating value(s)
  const handleResetDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetRequest({
      ...resetRequest,
      [event.target.name]: event.target.value
    });
  };

  //If no reset token is available yet, present loading UI element
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
        <Box border='2px' borderColor='gray.200' p='10' borderRadius='2xl' w='md'>
          <form onSubmit={handleReset}>
            <Stack spacing='12'>
              <Box>
                <Heading>Reset Password</Heading>
              </Box>
              <Box>
                <Stack spacing='3'>
                  {/* //new password input */}
                  <FormControl isDisabled={loading} isInvalid={authError}>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      name='password'
                      type='password'
                      value={resetRequest.password}
                      onChange={handleResetDetailsChange}
                    />
                  </FormControl>
                  {/* //re-enter new password input */}
                  <FormControl isDisabled={loading} isInvalid={authError}>
                    <FormLabel>New Password</FormLabel>
                    <Input type='password' name='confirm' onChange={handleResetDetailsChange} />
                    <FormErrorMessage>{errMessage}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
              <Button type='submit' isLoading={loading} colorScheme='red'>
                Reset Password
                {/* //reset password submission button */}
              </Button>
              {/* //Button redirects user to registration page */}
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
