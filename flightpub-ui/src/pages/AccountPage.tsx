import {
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
  toast,
  useToast,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Flex,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Editable,
  EditablePreview,
  EditableInput,
  Text,
  HStack,
  VStack,
  Heading,
  Divider,
  Modal,
  ModalOverlay,
  Center,
} from '@chakra-ui/react';
import React, { SyntheticEvent, useRef, useState } from 'react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';

const editProfileForm: {
  inputs: Array<{ label: string; name: string; type?: string }>;
} = {
  inputs: [
    { label: 'Email', name: 'email' },
    { label: 'First Name', name: 'fname' },
    { label: 'Last name', name: 'lname' },
    { label: 'Phone Number', name: 'ph', type: 'tel' },
  ],
};

export const AccountPage = () => {
  const navigate = useNavigate();

  // overlay
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const cancelRef = React.useRef(null);
  const toast = useToast();

  // form Data
  const [userData, setUserData] = useState<any>({
    email: 'user@example.com',
    fname: 'Lachlan',
    lname: 'Johnson',
    ph: '+6112345678',
  });
  const [passwordData, setPasswordData] = useState<any>({
    current: '',
    password: '',
    confirm: '',
  });
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // event handling
  const handleDetailsUpdate = (field: string, value: string) => {
    if (value === userData[field]) return;
    setUserData({ ...userData, [field]: value });
    setIsDirty(true);
  };

  const handlePasswordInputUpdate = (field: string, value: string) => {
    if (value === userData[field]) return;
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleDelete = () => {
    onClose();
    onOpenModal();
    // Simulate api delay with timeout
    setTimeout(() => {
      toast({
        title: 'Account Deleted',
        description:
          'Your account was deleted successfully, you have been logged out permanently.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      onCloseModal();
      navigate(routes.default);
    }, 2000);
  };

  const handleSaveChanges = () => {
    onOpenModal();
    // Simulate api delay with timeout
    setTimeout(() => {
      toast({
        title: 'Details updated',
        description: 'Your account details have been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onCloseModal();
      setIsDirty(false);
    }, 2000);
  };

  const handleDiscardChanges = () => {
    // TODO : replace this with real refresh logic
    window.location.reload();
  };

  const handleChangePassword = () => {
    onOpenModal();
    // Simulate api delay with timeout
    setTimeout(() => {
      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onCloseModal();
      setIsDirty(false);
    }, 2000);
  }

  // validation
  const passwordResetIsValid = (): boolean => {
    return Object.values(passwordData).some(input => !input || input === '');
  };

  return (
    <Flex justifyContent={'center'} p={'5em'}>
      <Box w={'50em'}>
        <Heading mb={'1em'}>My Details</Heading>
        <form>
          <VStack gap={'1em'}>
            {editProfileForm.inputs.map((input) => (
              <CustomEditible
                name={input.name}
                value={userData?.[input.name]}
                label={input.label}
                type={input?.type || 'text'}
                onSave={(value) => handleDetailsUpdate(input.name, value)}
              />
            ))}
            <HStack w={'full'} gap={'1em'}>
              <Button
                colorScheme={'blue'}
                disabled={!isDirty}
                onClick={handleSaveChanges}
              >
                Save
              </Button>
              <Button
                colorScheme={'gray'}
                disabled={!isDirty}
                onClick={handleDiscardChanges}
              >
                Discard Changes
              </Button>
            </HStack>
          </VStack>
        </form>
        <Divider mt={'2em'} mb={'3em'} />
        <Heading mb={'1em'}>Change Password</Heading>
        <form>
          <VStack gap={'1em'}>
            <FormControl isRequired={true}>
              <FormLabel>Current Password</FormLabel>
              <Input
                type={'password'}
                value={passwordData.current}
                onChange={event => handlePasswordInputUpdate('current', event.target.value)} />
            </FormControl>
            <FormControl isRequired={true}>
              <FormLabel>New Password</FormLabel>
              <Input
                type={'password'}
                value={passwordData.password}
                onChange={event => handlePasswordInputUpdate('password', event.target.value)} />
            </FormControl>
            <FormControl isRequired={true}>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type={'password'}
                value={passwordData.confirm}
                onChange={event => handlePasswordInputUpdate('confirm', event.target.value)} />
            </FormControl>
            <HStack w={'full'} gap={'1em'}>
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
        <Divider mt={'2em'} mb={'3em'} />
        <Button colorScheme='red' variant={'outline'} onClick={onOpen}>
          Delete Account
        </Button>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Account
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete your account? This action cannot
                be undone.
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
        <Modal isOpen={isOpenModal} onClose={onCloseModal}>
          <ModalOverlay />
            <Spinner style={{position: 'absolute', top: '50vh', left: '50vw'}} />
        </Modal>
      </Box>
    </Flex>
  );
};

const CustomEditible = (
  {
    value,
    label,
    name,
    onSave,
    type,
  }: {
    value?: string;
    label: string;
    name: string;
    onSave?: (value: string) => void;
    type: string;
  }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [internalState, setInternalState] = useState<string | undefined>(value);
  const handleSave = () => {
    onSave && onSave(internalState || '');
    setIsEditing(false);
  };
  const handleCancel = () => {
    setInternalState(value);
    setIsEditing(false);
  };
  const handleEdit = () => {
    setInternalState(value);
    setIsEditing(true);
  };
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <HStack>
        {isEditing ? (
          <>
            <Input
              value={internalState || ''}
              type={type}
              name={name}
              onChange={(event) => setInternalState(event.target.value)}
            />
            <IconButton
              variant={'solid'}
              aria-label={'save'}
              icon={<CheckIcon />}
              onClick={handleSave}
            />
            <IconButton
              variant={'solid'}
              aria-label={'cancel'}
              icon={<CloseIcon />}
              onClick={handleCancel}
            />
          </>
        ) : (
          <>
            <Text flex={1}>{value}</Text>
            <IconButton
              variant={'ghost'}
              aria-label={'edit'}
              icon={<EditIcon />}
              onClick={handleEdit}
            />
          </>
        )}
      </HStack>
    </FormControl>
  );
};
