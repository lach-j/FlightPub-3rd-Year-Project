import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../services/UserContext';
import { User } from '../../models';
import _ from 'lodash';
import { useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { UserRole } from '../../models/User';

export const MyDetailsTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();

  const handlePostDelete = () => {
    toast({
      title: 'Account Deleted',
      description: 'Your account was deleted successfully, you have been logged out permanently.',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
    localStorage.removeItem('bearer-token');
    localStorage.removeItem('user-id');
    setUser(null);
    navigate(routes.default);
  };

  const handlePostSave = (savedUser: User) => {
    setUser(savedUser);
    toast({
      title: 'Details updated',
      description: 'Your account details have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  };

  return (
    <>
      <Heading mb='1em'>My Details</Heading>
      {user && (
        <UserDetailsForm
          setIsLoading={setIsLoading}
          user={user}
          onDelete={handlePostDelete}
          onSave={handlePostSave}
        />
      )}
    </>
  );
};

const editProfileForm: {
  inputs: Array<{ label: string; name: keyof User; type?: string }>;
} = {
  inputs: [
    { label: 'Email', name: 'email' },
    { label: 'First Name', name: 'firstName' },
    { label: 'Last name', name: 'lastName' }
  ]
};

export const UserDetailsForm = ({
  setIsLoading,
  user,
  onDelete,
  onSave,
  showRole = false
}: {
  setIsLoading: (value: boolean) => void;
  user: User;
  onDelete: () => void;
  onSave: (user: User) => void;
  showRole?: boolean;
}) => {
  const { httpPatch, httpDelete } = useApi(endpoints.users);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  const [userData, setUserData] = useState<User | null>(user);
  const isDirty = !_.isEqual(user, userData);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleDelete = () => {
    if (!user?.id) return;
    setIsLoading(true);

    httpDelete(`/${user?.id}`)
      .then(() => {
        onDelete();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSaveChanges = () => {
    if (!userData) return;
    setIsLoading(true);

    const { firstName, lastName, email, role } = userData;

    httpPatch(`/${user?.id}`, { firstName, lastName, email, role })
      .then((res) => {
        onSave(res);
        setIsLoading(false);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'An error occurred, please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDiscardChanges = () => {
    setUserData(user);
  };

  return (
    <>
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
          {showRole && (
            <>
              <FormControl>
                <FormLabel>User Role</FormLabel>
                <Select
                  value={userData?.role}
                  onChange={(e) =>
                    setUserData(
                      (userData) =>
                        ({
                          ...userData,
                          role: UserRole[e.target.value as keyof typeof UserRole]
                        } as User)
                    )
                  }
                >
                  <option value={UserRole.STANDARD_USER}>Standard User</option>
                  <option value={UserRole.TRAVEL_AGENT}>Travel Agent</option>
                  <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                </Select>
              </FormControl>
            </>
          )}
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
              Are you sure you want to delete this account? This action cannot be undone.
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
