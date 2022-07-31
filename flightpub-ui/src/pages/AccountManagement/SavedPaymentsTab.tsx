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
import { dummySavedPayments } from '../../data/SavedPayments';
import React, { useEffect, useState } from 'react';
import { SavedPayment } from '../../models';
import { SavedPaymentComponent } from './SavedPaymentComponent';

export const SavedPaymentsTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const [savedPaymentData, setSavedPaymentData] = useState<SavedPayment | null>(null);
  const [savedPayments, setSavedPayments] = useState(dummySavedPayments);
  const [isEdititng, setIsEdititng] = useState<number | null>(null);
  const toast = useToast();
  const {
    isOpen: isOpenAddPayment,
    onOpen: onOpenAddPayment,
    onClose: onCloseAddPayment
  } = useDisclosure();

  const handleAddPayment = () => {
    setIsLoading(true);
    // Simulate api delay with timeout
    let updated = savedPayments;
    if (savedPaymentData) {
      if (savedPaymentData.isDefault)
        updated = updated.map((p) => {
          return { ...p, isDefault: false };
        });
      setSavedPayments([...updated, savedPaymentData]);
    }

    setTimeout(() => {
      toast({
        title: 'Payment added',
        description: 'A new payment method has been added to your account.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      setIsLoading(false);
      onCloseAddPayment();
    }, 2000);
  };

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
    if (!(typeof isEdititng === 'number')) return;

    let updated = [...savedPayments];
    setIsLoading(true);
    if (savedPaymentData) {
      if (savedPaymentData.isDefault)
        updated = updated.map((p) => {
          return { ...p, isDefault: false };
        });
      updated[isEdititng] = savedPaymentData;
      setSavedPayments(updated);
      onCloseAddPayment();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpenAddPayment) setIsEdititng(null);
  }, [isOpenAddPayment]);

  const renderPaymentDetails = () => {
    switch (savedPaymentData?.type) {
      case 'card':
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
                value={savedPaymentData.expiry}
                onChange={(event) => handleSavedPaymentUpdate('expiry', event.target.value)}
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
      case 'paypal':
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
      case 'directDebit':
        return (
          <VStack mt='1em' gap='1em'>
            <FormControl>
              <FormLabel>BSB</FormLabel>
              <Input
                type={'number'}
                value={savedPaymentData.bsb}
                onChange={(event) => handleSavedPaymentUpdate('bsb', event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Account Number</FormLabel>
              <Input
                type='number'
                value={savedPaymentData.accNumber}
                onChange={(event) => handleSavedPaymentUpdate('accNumber', event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Account Name</FormLabel>
              <Input
                value={savedPaymentData.accName}
                onChange={(event) => handleSavedPaymentUpdate('accName', event.target.value)}
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
                <option value='card'>Card</option>
                <option value='directDebit'>Direct Debit</option>
                <option value='paypal'>PayPal</option>
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
                {typeof isEdititng === 'number' ? (
                  <Button onClick={handleUpdatePayment} colorScheme='green'>
                    Update
                  </Button>
                ) : (
                  <Button onClick={handleAddPayment} colorScheme={'green'} rightIcon={<BiPlus />}>
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
