import {
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Stat,
  StatHelpText,
  StatLabel,
  Text,
  VStack
} from '@chakra-ui/react';
import { AiFillBank, AiFillCreditCard, BiTrash, ImPaypal } from 'react-icons/all';
import { EditIcon } from '@chakra-ui/icons';
import React from 'react';
import { SavedPayment } from '../../models';
import { SavedPaymentType } from '../../models/SavedPaymentTypes';

export const SavedPaymentComponent = ({
  payment,
  onDelete,
  onEdit,
  showButtons = true,
  showSmall = false
}: {
  payment: SavedPayment;
  onDelete?: () => void;
  onEdit?: () => void;
  showButtons?: boolean;
  showSmall?: boolean;
}) => {
  const formatBSB = (bsb: number): string =>
    bsb.toString().substring(0, 3) + '-' + bsb.toString().substring(3, 6);
  const renderPaymentDetails = () => {
    switch (payment.payment.type) {
      case SavedPaymentType.CARD:
        return (
          <Flex justifyContent='space-between' w='full' alignItems='center' flex={1}>
            <Icon as={AiFillCreditCard} fontSize='5xl' />
            <Stat flex='none'>
              <StatLabel>{payment.payment.cardNumber}</StatLabel>
              <StatHelpText>CARD NUMBER</StatHelpText>
            </Stat>
            <Stat flex='none'>
              <StatLabel>{payment.payment.expiryDate}</StatLabel>
              <StatHelpText>EXPIRES</StatHelpText>
            </Stat>
          </Flex>
        );
      case SavedPaymentType.PAYPAL:
        return (
          <Flex justifyContent='space-between' w='full' alignItems='center' flex={1}>
            <Icon as={ImPaypal} fontSize='5xl' />
            <Stat flex='none'>
              <StatLabel>{payment.payment.email}</StatLabel>
              <StatHelpText>PAYPAL EMAIL</StatHelpText>
            </Stat>
          </Flex>
        );
      case SavedPaymentType.DIRECT_DEBIT:
        return (
          <Flex justifyContent='space-between' w='full' alignItems='center' flex={1}>
            <Icon as={AiFillBank} fontSize='5xl' />
            <Stat flex='none'>
              <StatLabel>{formatBSB(payment.payment.bsb)}</StatLabel>
              <StatHelpText>BSB</StatHelpText>
            </Stat>
            <Stat flex='none'>
              <StatLabel>{payment.payment.accountNumber}</StatLabel>
              <StatHelpText>ACC NUMBER</StatHelpText>
            </Stat>
          </Flex>
        );
    }
  };

  return (
    <Box
      border='1px'
      w='20em'
      h={showSmall ? '5em' : '10em'}
      p='1em'
      rounded='2xl'
      justifyContent='center'
    >
      <VStack h='full'>
        <Flex justifyContent='space-between' w='full'>
          <HStack>
            <Text>{payment.nickname}</Text>
            {payment?.isDefault && <Badge colorScheme='blue'>Default</Badge>}
          </HStack>
          {showButtons && (
            <HStack>
              <IconButton
                onClick={onDelete}
                aria-label='delete'
                icon={<BiTrash />}
                size='sm'
                variant='outline'
                colorScheme='red'
              />
              <IconButton
                onClick={onEdit}
                aria-label='edit'
                icon={<EditIcon />}
                size='sm'
                variant='outline'
                colorScheme='black'
              />
            </HStack>
          )}
        </Flex>
        {renderPaymentDetails()}
      </VStack>
    </Box>
  );
};
