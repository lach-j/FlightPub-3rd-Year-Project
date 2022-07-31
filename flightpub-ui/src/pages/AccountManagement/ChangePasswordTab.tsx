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
import React, { useState } from 'react';

export const ChangePasswordTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const toast = useToast();
  const [passwordData, setPasswordData] = useState<any>({
    current: '',
    password: '',
    confirm: ''
  });

  const handlePasswordInputUpdate = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleChangePassword = () => {
    setIsLoading(true);
    // Simulate api delay with timeout
    setTimeout(() => {
      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      setIsLoading(false);
    }, 2000);
  };

  const passwordResetIsValid = (): boolean => {
    return Object.values(passwordData).some((input) => !input || input === '');
  };

  return (
    <>
      <Heading mb='1em'>Change Password</Heading>
      <form>
        <VStack gap='1em'>
          <FormControl isRequired={true}>
            <FormLabel>Current Password</FormLabel>
            <Input
              type={'password'}
              value={passwordData.current}
              onChange={(event) => handlePasswordInputUpdate('current', event.target.value)}
            />
          </FormControl>
          <FormControl isRequired={true}>
            <FormLabel>New Password</FormLabel>
            <Input
              type={'password'}
              value={passwordData.password}
              onChange={(event) => handlePasswordInputUpdate('password', event.target.value)}
            />
          </FormControl>
          <FormControl isRequired={true}>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type={'password'}
              value={passwordData.confirm}
              onChange={(event) => handlePasswordInputUpdate('confirm', event.target.value)}
            />
          </FormControl>
          <HStack w='full' gap='1em'>
            <Button
              colorScheme={'blue'}
              disabled={passwordResetIsValid()}
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
