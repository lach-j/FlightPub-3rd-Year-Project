import { VStack, HStack, FormControl, FormLabel, Input, Button, Select } from '@chakra-ui/react';
import React, { HTMLInputTypeAttribute, useContext, useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { endpoints } from '../constants/endpoints';
import { SavedPayment, SavedPaymentType } from '../models/SavedPaymentTypes';
import { useApi } from '../services/ApiService';
import { UserContext } from '../services/UserContext';

export const PaymentDetailsForm = ({
  paymentType,
  onFieldChange
}: {
  paymentType: SavedPaymentType;
  onFieldChange?: (field: string, value: any) => void;
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
      return (
        <Select>
          {savedPayments.map((s) => (
            <option value={s.nickname}>{s.nickname}</option>
          ))}
        </Select>
      );
  }
};