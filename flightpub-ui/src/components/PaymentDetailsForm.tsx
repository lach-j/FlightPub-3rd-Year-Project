import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  VStack
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { endpoints } from '../constants/endpoints';
import { PaymentType, SavedPayment, SavedPaymentType } from '../models/SavedPaymentTypes';
import { useApi } from '../services/ApiService';
import { UserContext } from '../services/UserContext';

export const PaymentDetailsForm = ({
  paymentType,
  onFieldChange,
  savedPaymentSelected
}: {
  paymentType: SavedPaymentType;
  onFieldChange?: (field: string, value: any) => void;
  savedPaymentSelected?: (payment: PaymentType | undefined) => void;
}) => {
  const { user, setUser } = useContext(UserContext);
  const { httpGet } = useApi(endpoints.users);
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>([]);

  useEffect(() => {
    httpGet(`/${user?.id}/payments`).then((payments) => {
      setSavedPayments(payments);
    });
  }, [user]);

  const handleChanges = (fieldValue: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange && onFieldChange(fieldValue, e.target.value);
  };

  const handleSavedPaymentSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const payment = savedPayments.find((p) => p.payment.id?.toString() === e.target.value);
    if (!payment) return;

    savedPaymentSelected && savedPaymentSelected(payment.payment);
  };

  useEffect(() => {
    if (paymentType !== SavedPaymentType.SAVED) return;

    const payment = savedPayments?.[0];
    if (!payment) {
      savedPaymentSelected && savedPaymentSelected(undefined);
      return;
    }

    savedPaymentSelected && savedPaymentSelected(payment.payment);
  }, [paymentType]);

  //switch statement defines flow based on payment type
  switch (paymentType) {
    //if users payment type is card
    case SavedPaymentType.CARD:
      return (
        <VStack mt='1em' gap='1em' w='full'>
          <HStack w='full' gap='1em'>
            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input onChange={handleChanges('cardNumber')} />
            </FormControl>
            <FormControl>
              <FormLabel>Cardholder Name</FormLabel>
              <Input onChange={handleChanges('cardholder')} />
            </FormControl>
          </HStack>
          <HStack w='full' gap='1em'>
            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input onChange={handleChanges('expiryDate')} />
            </FormControl>
            <FormControl>
              <FormLabel>CCV</FormLabel>
              <Input onChange={handleChanges('ccv')} />
            </FormControl>
          </HStack>
        </VStack>
      );
    // if users payment type is PayPal
    case SavedPaymentType.PAYPAL:
      return (
        <VStack mt='1em' gap='1em' w='full'>
          <FormControl>
            <FormLabel>PayPal Email</FormLabel>
            <Input onChange={handleChanges('email')} />
          </FormControl>
          <Button rightIcon={<BiLinkExternal />}>Link PayPal Account</Button>
        </VStack>
      );
    // if users payment type is PayPal
    case SavedPaymentType.DIRECT_DEBIT:
      return (
        <HStack w='full' mt='1em' gap='1em'>
          <FormControl>
            <FormLabel>BSB</FormLabel>
            <Input type='number' onChange={handleChanges('bsb')} />
          </FormControl>
          <FormControl>
            <FormLabel>Account Number</FormLabel>
            <Input type='number' onChange={handleChanges('accountNumber')} />
          </FormControl>
          <FormControl>
            <FormLabel>Account Name</FormLabel>
            <Input onChange={handleChanges('accountName')} />
          </FormControl>
        </HStack>
      );
    //If user payment type is 'saved'
    case SavedPaymentType.SAVED:
      return savedPayments && savedPayments.length > 0 ? (
        <Select onChange={handleSavedPaymentSelected}>
          {savedPayments.map((s) => (
            <option value={s.id}>{s.nickname}</option>
          ))}
        </Select>
      ) : (
        <Text>You have no saved payments.</Text>
      );
  }
};
