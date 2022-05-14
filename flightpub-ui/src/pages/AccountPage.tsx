import {
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
  useToast,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Flex,
  IconButton,
  Text,
  HStack,
  VStack,
  Heading,
  Divider,
  Modal,
  ModalOverlay,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Badge,
  Stat,
  StatLabel,
  StatHelpText,
  ModalContent,
  ModalHeader, ModalBody, ModalFooter, Select, Checkbox,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { AiFillBank, AiFillCreditCard, BiLinkExternal, BiPlus, BiTrash, ImPaypal } from 'react-icons/all';

import { savedPayments } from '../data/SavedPayments';

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
  const {
    isOpen: isOpenAddPayment,
    onOpen: onOpenAddPayment,
    onClose: onCloseAddPayment,
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
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [passwordData, setPasswordData] = useState<any>({
    current: '',
    password: '',
    confirm: '',
  });

  const [savedPaymentData, setSavedPaymentData] = useState<SavedPayment | null>(null);


  // event handling
  const handleDetailsUpdate = (field: string, value: string) => {
    if (value === userData[field]) return;
    setUserData({ ...userData, [field]: value });
    setIsDirty(true);
  };

  const handlePasswordInputUpdate = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleSavedPaymentUpdate = (field: string, value: string) => {
    let updatedValue = { ...savedPaymentData, [field]: value } as SavedPayment;
    setSavedPaymentData(updatedValue);
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
  };

  const handleAddPayment = () => {
    onOpenModal();
    // Simulate api delay with timeout
    setTimeout(() => {
      toast({
        title: 'Payment added',
        description: 'A new payment method has been added to your account.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onCloseModal();
      onCloseAddPayment();
    }, 2000);
  };

  // validation
  const passwordResetIsValid = (): boolean => {
    return Object.values(passwordData).some(input => !input || input === '');
  };

  const renderPaymentDetails = () => {
    switch (savedPaymentData?.type) {
      case 'card':
        return (
          <VStack mt={'1em'} gap={'1em'}>
            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input value={savedPaymentData.cardNumber}
                     onChange={(event) => handleSavedPaymentUpdate('cardNumber', event.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input value={savedPaymentData.expiry}
                     onChange={(event) => handleSavedPaymentUpdate('expiry', event.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Cardholder Name</FormLabel>
              <Input value={savedPaymentData.cardholder}
                     onChange={(event) => handleSavedPaymentUpdate('cardholder', event.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>CCV</FormLabel>
              <Input type={'number'} value={savedPaymentData.ccv}
                     onChange={(event) => handleSavedPaymentUpdate('ccv', event.target.value)} />
            </FormControl>
          </VStack>
        );
      case 'paypal':
        return (
          <VStack mt={'1em'} gap={'1em'}>
            <FormControl>
              <FormLabel>PayPal Email</FormLabel>
              <Input value={savedPaymentData.email}
                     onChange={(event) => handleSavedPaymentUpdate('email', event.target.value)} />
            </FormControl>
            <Button rightIcon={<BiLinkExternal />}>Link PayPal Account</Button>
          </VStack>
        );
      case 'directDebit':
        // type: 'directDebit';
        // bsb: number;
        // accNumber: number;
        // accName: string;
        return (
          <VStack mt={'1em'} gap={'1em'}>
            <FormControl>
              <FormLabel>BSB</FormLabel>
              <Input type={'number'}
                      value={savedPaymentData.bsb}
                     onChange={(event) => handleSavedPaymentUpdate('bsb', event.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Account Number</FormLabel>
              <Input type={'number'} value={savedPaymentData.accNumber}
                     onChange={(event) => handleSavedPaymentUpdate('accNumber', event.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Account Name</FormLabel>
              <Input value={savedPaymentData.accName}
                     onChange={(event) => handleSavedPaymentUpdate('accName', event.target.value)} />
            </FormControl>
          </VStack>
        );
    }
  };

  return (
    <Flex justifyContent={'center'} p={'5em'}>
      <Box w={'80%'}>
        <Tabs variant={'enclosed'}>
          <TabList>
            <Tab>My Details</Tab>
            <Tab>Change Password</Tab>
            <Tab>Saved Payments</Tab>
          </TabList>

          <TabPanels mt={'1em'}>
            <TabPanel>
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
              <Button colorScheme='red' variant={'outline'} onClick={onOpen}>
                Delete Account
              </Button>
            </TabPanel>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
              <HStack mb={'1em'} justifyContent={'space-between'} alignItems={'center'}>
                <Heading>Saved Payments</Heading>
                <Button onClick={() => {setSavedPaymentData(null); onOpenAddPayment()}} colorScheme={'green'} rightIcon={<BiPlus />}>Add New Payment</Button>
              </HStack>

              <Flex gap={'1em'} alignItems={'flex-start'} flexWrap={'wrap'}>
                {savedPayments.map((payment) => <SavedPayment payment={payment} />)}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>

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
          <Spinner style={{ position: 'absolute', top: '50vh', left: '50vw' }} />
        </Modal>
        <Modal isOpen={isOpenAddPayment} onClose={onCloseAddPayment}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add a New Payment Method</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>Payment Nickname</FormLabel>
                <Input value={savedPaymentData?.nickname}
                       onChange={(event) => handleSavedPaymentUpdate('nickname', event.target.value)}/>
              </FormControl>
              <FormControl mt={'1em'}>
                <FormLabel>Payment Type</FormLabel>
              <Select value={savedPaymentData?.type}
                      onChange={(event) => handleSavedPaymentUpdate('type', event.target.value)}>
                <option>Select an option</option>
                <option value='card'>Card</option>
                <option value='directDebit'>Direct Debit</option>
                <option value='paypal'>PayPal</option>
              </Select>
              </FormControl>
              {renderPaymentDetails()}
            </ModalBody>
            <ModalFooter>

              <Flex justifyContent={'space-between'} w={'full'}>
                <HStack>
                  <Checkbox checked={savedPaymentData?.isDefault} onChange={(event) => handleSavedPaymentUpdate('isDefault', event.target.value)}>Set as default?</Checkbox>
                </HStack>
                <HStack>
                <Button onClick={handleAddPayment}
                        colorScheme={'green'}
                        rightIcon={<BiPlus />}>
                  Add
                </Button>
                <Button onClick={onCloseAddPayment}>Cancel</Button>
              </HStack>
              </Flex>           </ModalFooter>
          </ModalContent>
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


type PaymentType =
  | DirectDebitPayment
  | CardPayment
  | PaypalPayment

interface DirectDebitPayment extends Payment {
  type: 'directDebit';
  bsb: number;
  accNumber: number;
  accName: string;
}

interface CardPayment extends Payment {
  type: 'card';
  cardNumber: string;
  expiry: string;
  cardholder?: string;
  ccv?: number;
}

interface PaypalPayment extends Payment {
  type: 'paypal';
  email: string;
  token?: string;
}

interface Payment {
  type: 'card' | 'directDebit' | 'paypal';
}

export type SavedPayment = PaymentType & {
  nickname: string;
  isDefault?: boolean;
}

const SavedPayment = ({ payment }: { payment: SavedPayment }) => {

  const formatBSB = (bsb: number): string => bsb.toString().substring(0, 3) + '-' + bsb.toString().substring(3, 6);

  const renderPaymentDetails = () => {
    switch (payment.type) {
      case 'card':
        return (
          <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'} flex={1}>
            <Icon as={AiFillCreditCard} fontSize={'5xl'} />
            <Stat flex={'none'}>
              <StatLabel>{payment.cardNumber}</StatLabel>
              <StatHelpText>CARD NUMBER</StatHelpText>
            </Stat>
            <Stat flex={'none'}>

              <StatLabel>{payment.expiry}</StatLabel>
              <StatHelpText>EXPIRES</StatHelpText>
            </Stat>
          </Flex>
        );
      case 'paypal':
        return (
          <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'} flex={1}>
            <Icon as={ImPaypal} fontSize={'5xl'} />
            <Stat flex={'none'}>
              <StatLabel>{payment.email}</StatLabel>
              <StatHelpText>PAYPAL EMAIL</StatHelpText>
            </Stat>
          </Flex>
        );
      case 'directDebit':
        return (
          <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'} flex={1}>
            <Icon as={AiFillBank} fontSize={'5xl'} />
            <Stat flex={'none'}>
              <StatLabel>{formatBSB(payment.bsb)}</StatLabel>
              <StatHelpText>BSB</StatHelpText>
            </Stat>
            <Stat flex={'none'}>

              <StatLabel>{payment.accNumber}</StatLabel>
              <StatHelpText>ACC NUMBER</StatHelpText>
            </Stat>
          </Flex>
        );
    }
  };

  return (
    <Box border={'1px'} w={'20em'} h={'10em'} p={'1em'} rounded={'2xl'}>
      <VStack h={'full'}>
        <Flex justifyContent={'space-between'} w={'full'}>
          <HStack>
            <Text>{payment.nickname}</Text>
            {payment?.isDefault && <Badge colorScheme={'blue'}>Default</Badge>}
          </HStack>
          <HStack>
            <IconButton aria-label={'delete'} icon={<BiTrash />} size={'sm'} variant='outline' colorScheme='red' />
            <IconButton aria-label={'edit'} icon={<EditIcon />} size={'sm'} variant='outline' colorScheme='black' />
          </HStack>
        </Flex>
        {renderPaymentDetails()}
      </VStack>
    </Box>
  );
};
