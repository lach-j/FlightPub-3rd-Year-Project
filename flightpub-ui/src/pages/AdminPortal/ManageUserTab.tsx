import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  useDisclosure,
  useToast,
  VStack,
  Input,
  Select,
  Box,
  Text,
  toast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { Airline, ColumnDefinition, Flight, Price, User } from '../../models';
import { ApiError, useApi } from '../../services/ApiService';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import _ from 'lodash';
import { UserDetailsForm } from '../AccountManagement/MyDetailsTab';
import { endpoints } from '../../constants/endpoints';

const editProfileForm: {
  inputs: Array<{ label: string; name: keyof User; type?: string }>;
} = {
  inputs: [
    { label: 'Email', name: 'email' },
    { label: 'First Name', name: 'firstName' },
    { label: 'Last name', name: 'lastName' }
    // { label: 'Phone Number', name: 'ph', type: 'tel' }
  ]
};

export const ManageUserTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const [user, setUser] = useState<User | undefined>();
  const [userIdentifier, setUserIdentifier] = useState('');

  const toast = useToast();

  const { httpGet } = useApi(endpoints.users);

  const handlePostDelete = () => {
    toast({
      title: 'Account Deleted',
      description: 'This account was deleted successfully.',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
    setUser(undefined);
  };

  const handlePostSave = (savedUser: User) => {
    setUser(savedUser);
    toast({
      title: 'Details updated',
      description: 'This accounts details were updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  };

  const searchUser = () => {
    httpGet(`/${userIdentifier}`)
      .then((user) => {
        setUser(user);
      })
      .catch((err: ApiError) => {
        if (err.message.includes('404')) {
          toast({
            title: 'User Not Found',
            description: `A user with identifier ${userIdentifier} does not exist.`,
            status: 'error',
            isClosable: true
          });
        }
      });
  };

  return (
    <>
      <HStack>
        <Heading mb='0.5em'>Manage Users</Heading>
        <HStack w='full'>
          <Box whiteSpace='nowrap'>User Id or Email</Box>
          <Input onChange={(e) => setUserIdentifier(e.target.value)} />
          <Button onClick={searchUser}>Search</Button>
        </HStack>
      </HStack>
      {user ? (
        <UserDetailsForm
          setIsLoading={setIsLoading}
          onDelete={handlePostDelete}
          onSave={handlePostSave}
          user={user}
          showRole
        />
      ) : (
        <Text>Select a user to edit their details.</Text>
      )}
    </>
  );
};
