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
  useEditable,
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

export const BookingHistoryTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const { user, setUser } = useContext(UserContext);

  const { httpGet } = useApi(endpoints.users);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  const [userData, setUserData] = useState<User | null>(user);
  const isDirty = !_.isEqual(user, userData);

  return (
    <>
      <Heading mb='1em'>Booking History</Heading>
    </>
  );
};
