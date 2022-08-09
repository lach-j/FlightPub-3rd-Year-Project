import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import { BiLinkExternal, BiPlus } from 'react-icons/all';
import React, { useContext, useEffect, useState } from 'react';
import { SavedPayment } from '../../models';
import { SavedPaymentComponent } from './SavedPaymentComponent';
import { useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { SavedPaymentType } from '../../models/SavedPaymentTypes';
import { UserContext } from '../../services/UserContext';

export const SavedPaymentsTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const [savedPaymentData, setSavedPaymentData] = useState<SavedPayment | null>(null);
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>([]);
  const [isEdititng, setIsEdititng] = useState<number | null>(null);
  const toast = useToast();
  const { user, setUser } = useContext(UserContext);
  const { httpGet, httpPatch, httpPost } = useApi(endpoints.users);
  const {
    isOpen: isOpenAddPayment,
    onOpen: onOpenAddPayment,
    onClose: onCloseAddPayment
  } = useDisclosure();

  const handleAddPayment = () => {
    if (!savedPaymentData || !user) return;
    setIsLoading(true);
    httpPost(`/${user?.id}/payments`, savedPaymentData)
      .then((payment) => {
        setSavedPayments((ps) => [...ps, payment]);

        toast({
          title: 'Payment Added',
          description: 'A new payment method has been added to your account.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        onCloseAddPayment();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    httpGet(`/${user.id}/payments`)
      .then((response: SavedPayment[]) => {
        setSavedPayments(response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  const handleDeletePayment = (payment: SavedPayment) => {
    setSavedPayments([...savedPayments.filter((p) => p !== payment)]);
  };

  useEffect(() => {
    if (savedPayments.length > 0 && !savedPayments.some((p) => p.isDefault === true)) {
      let updated = [...savedPayments];
      updated[0].isDefault = true;
      setSavedPayments(updated);
    }
  }, [savedPayments]);

  const handleSavedPaymentUpdate = (field: string, value: any) => {
    let updatedValue = { ...savedPaymentData, [field]: value } as SavedPayment;
    setSavedPaymentData(updatedValue);
  };
  const handleEditPayment = (payment: SavedPayment) => {
    setIsEdititng(savedPayments.findIndex((p) => p === payment));
    setSavedPaymentData(payment);
    onOpenAddPayment();
  };

  const handleUpdatePayment = () => {
    if (!user?.id || !savedPaymentData?.id) return;

    setIsLoading(true);
    httpPatch(`/${user?.id}/payments/${savedPaymentData?.id}`)
      .then()
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!isOpenAddPayment) setIsEdititng(null);
  }, [isOpenAddPayment]);

  const renderPaymentDetails = () => {
    switch (savedPaymentData?.type) {
      case SavedPaymentType.CARD:
        return (
          <VStack mt='1em' gap='1em'>
            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input
                value={savedPaymentData.cardNumber}
                onChange={(event) => handleSavedPaymentUpdate('cardNumber', event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                value={savedPaymentData.expiryDate}
                onChange={(event) => handleSavedPaymentUpdate('expiryDate', event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Cardholder Name</FormLabel>
              <Input
                value={savedPaymentData.cardholder}
                onChange={(event) => handleSavedPaymentUpdate('cardholder', event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>CCV</FormLabel>
              <Input
                type='number'
                value={savedPaymentData.ccv}
                onChange={(event) => handleSavedPaymentUpdate('ccv', event.target.value)}
              />
            </FormControl>
          </VStack>
        );
      case SavedPaymentType.PAYPAL:
        return (
          <VStack mt='1em' gap='1em'>
            <FormControl>
              <FormLabel>PayPal Email</FormLabel>
              <Input
                value={savedPaymentData.email}
                onChange={(event) => handleSavedPaymentUpdate('email', event.target.value)}
              />
            </FormControl>
            <Button rightIcon={<BiLinkExternal />}>Link PayPal Account</Button>
          </VStack>
        );
      case SavedPaymentType.DIRECT_DEBIT:
        return (
          <VStack mt='1em' gap='1em'>
            <FormControl>
              <FormLabel>BSB</FormLabel>
              <Input
                type='number'
                value={savedPaymentData.bsb}
                onChange={(event) => handleSavedPaymentUpdate('bsb', event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Account Number</FormLabel>
              <Input
                type='number'
                value={savedPaymentData.accountNumber}
                onChange={(event) => handleSavedPaymentUpdate('accountNumber', event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Account Name</FormLabel>
              <Input
                value={savedPaymentData.accountName}
                onChange={(event) => handleSavedPaymentUpdate('accountName', event.target.value)}
              />
            </FormControl>
          </VStack>
        );
    }
  };

  return (
    <>
      <HStack mb='1em' justifyContent='space-between' alignItems='center'>
        <Heading>Saved Payments</Heading>
        <Button
          onClick={() => {
            setSavedPaymentData(null);
            onOpenAddPayment();
          }}
          colorScheme='green'
          rightIcon={<BiPlus />}
        >
          Add New Payment
        </Button>
      </HStack>

      <Flex gap='1em' alignItems='flex-start' flexWrap='wrap'>
        {savedPayments.map((payment) => (
          <SavedPaymentComponent
            payment={payment}
            onDelete={() => handleDeletePayment(payment)}
            onEdit={() => handleEditPayment(payment)}
          />
        ))}
      </Flex>

      <Modal isOpen={isOpenAddPayment} onClose={onCloseAddPayment}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a New Payment Method</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Payment Nickname</FormLabel>
              <Input
                value={savedPaymentData?.nickname}
                onChange={(event) => handleSavedPaymentUpdate('nickname', event.target.value)}
              />
            </FormControl>
            <FormControl mt='1em'>
              <FormLabel>Payment Type</FormLabel>
              <Select
                value={savedPaymentData?.type}
                onChange={(event) => handleSavedPaymentUpdate('type', event.target.value)}
              >
                <option>Select an option</option>
                <option value={SavedPaymentType.CARD}>Card</option>
                <option value={SavedPaymentType.DIRECT_DEBIT}>Direct Debit</option>
                <option value={SavedPaymentType.PAYPAL}>PayPal</option>
              </Select>
            </FormControl>
            {renderPaymentDetails()}
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent='space-between' w='full'>
              <HStack>
                <Checkbox
                  checked={savedPaymentData?.isDefault}
                  onChange={(event) => handleSavedPaymentUpdate('isDefault', event.target.checked)}
                >
                  Set as default?
                </Checkbox>
              </HStack>
              <HStack>
                {savedPaymentData?.id ? (
                  <Button onClick={handleUpdatePayment} colorScheme='green'>
                    Update
                  </Button>
                ) : (
                  <Button onClick={handleAddPayment} colorScheme='green' rightIcon={<BiPlus />}>
                    Add
                  </Button>
                )}
                <Button onClick={onCloseAddPayment}>Cancel</Button>
              </HStack>
            </Flex>{' '}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
