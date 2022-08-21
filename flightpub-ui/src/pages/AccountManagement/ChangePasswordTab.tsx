import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { endpoints } from '../../constants/endpoints';
import { ApiError, useApi } from '../../services/ApiService';
import { UserContext } from '../../services/UserContext';

export const ChangePasswordTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const toast = useToast();
  const [passwordData, setPasswordData] = useState<{ password: string; confirm: string }>({
    password: '',
    confirm: ''
  });

  const { user, setUser } = useContext(UserContext);

  const handlePasswordInputUpdate = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const { httpPost } = useApi(endpoints.reset);

  const handleChangePassword = () => {
    setIsLoading(true);

    if (!user?.id) return;

    httpPost(`/${user.id}`, passwordData)
      .then(() => {
        toast({
          title: 'Password changed',
          description: 'Your password has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      })
      .catch((e: ApiError) => {
        toast({
          title: 'Error',
          description: e.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      })
      .finally(() => setIsLoading(false));
  };

  const passwordResetIsValid = (): boolean => {
    return (
      !Object.values(passwordData).some((input) => !input || input === '') &&
      passwordData.confirm === passwordData.password
    );
  };

  return (
    <>
      <Heading mb='1em'>Change Password</Heading>
      <form>
        <VStack gap='1em'>
          <FormControl isRequired={true}>
            <FormLabel>New Password</FormLabel>
            <Input
              type='password'
              value={passwordData.password}
              onChange={(event) => handlePasswordInputUpdate('password', event.target.value)}
            />
          </FormControl>
          <FormControl isRequired={true}>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type='password'
              value={passwordData.confirm}
              onChange={(event) => handlePasswordInputUpdate('confirm', event.target.value)}
            />
          </FormControl>
          <HStack w='full' gap='1em'>
            <Button
              colorScheme='blue'
              disabled={!passwordResetIsValid()}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </HStack>
        </VStack>
      </form>
    </>
  );
};
