import { Box, Button, VStack } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { routes } from '../../constants/routes';
import { TravelAgentPortalPage } from '../TravelAgent';

export const WishlistMainScreen = () => {
  return (
    <VStack>
      <TravelAgentPortalPage />
      <Button colorScheme='green' rightIcon={<FaPlus />} as={NavLink} to={routes.wishlist.new}>
        Create New Wishlist
      </Button>
    </VStack>
  );
};
