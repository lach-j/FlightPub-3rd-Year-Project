import { Box, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../constants/routes';
import { TravelAgentPortalPage } from '../TravelAgent';

export const WishlistMainScreen = () => {
  return (
    <>
      <TravelAgentPortalPage />
      <Button as={NavLink} to={routes.wishlist.new}>
        Create New Wishlist
      </Button>
    </>
  );
};
