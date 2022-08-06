import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Heading,
  HStack,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../services/UserContext';
import { User } from '../../models';
import _ from 'lodash';

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

export const MyDetailsTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const { user, setUser } = useContext(UserContext);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  const [userData, setUserData] = useState<User | null>(user);
  const isDirty = !_.isEqual(user, userData);


  const handleDelete = () => {
    setIsLoading(true);
    // Simulate api delay with timeout
    setTimeout(() => {
      toast({
        title: 'Account Deleted',
        description: 'Your account was deleted successfully, you have been logged out permanently.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
      setIsLoading(false);
      navigate(routes.default);
    }, 2000);
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    // Simulate api delay with timeout
    setTimeout(() => {
      toast({
        title: 'Details updated',
        description: 'Your account details have been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleDiscardChanges = () => {
    // TODO : replace this with real refresh logic
    window.location.reload();
  };

  return (
    <>
      <Heading mb='1em'>My Details</Heading>
      <form>
        <VStack gap='1em'>
          {editProfileForm.inputs.map((input) => (
            <CustomEditible
              name={input.name}
              value={userData?.[input.name]?.toString()}
              label={input.label}
              type={input?.type || 'text'}
              onSave={(value) => setUserData((data) => ({ ...data, [input.name]: value } as User))}
            />
          ))}
          <HStack w='full' gap='1em'>
            <Button colorScheme='blue' disabled={!isDirty} onClick={handleSaveChanges}>
              Save
            </Button>
            <Button colorScheme='gray' disabled={!isDirty} onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
          </HStack>
        </VStack>
      </form>
      <Divider mt='2em' mb='3em' />
      <Button colorScheme='red' variant='outline' onClick={onOpen}>
        Delete Account
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete your account? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
