import React, { Dispatch, SetStateAction, useContext } from 'react';
import {
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast
} from '@chakra-ui/react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, ImMap } from 'react-icons/all';
import { routes } from '../constants/routes';
import { Flight } from '../models';
import { UserContext } from '../services/UserContext';
import { UserRole } from '../models/User';

export default function Header({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) {
  const [cart, setCart] = cartState;

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bearer-token');
    localStorage.removeItem('user-id');
    navigate(routes.login, { state: { redirectUrl: routes.home } });
  };

  const handleCheckout = () => {
    if (user) {
      navigate(routes.passengerDetails);
    } else {
      navigate(routes.login, { state: { redirectUrl: routes.passengerDetails } });
    }
  };

  return (
    <Box minH='75' h='75' bg='black'>
      <Flex alignItems='center' justifyContent='space-between' h='full' paddingRight='2em'>
        <Image />
        <HStack spacing='5'>
          <Button as={NavLink} to={routes.home}>
            Home
          </Button>
          <Button as={NavLink} to={routes.search}>
            Search
          </Button>
          <Button as={NavLink} to={routes.holidayPackages.base}>
            Holidays
          </Button>
          <IconButton aria-label='map-view' as={NavLink} to={routes.map} icon={<ImMap />} />
          <Menu>
            <MenuButton as={IconButton} icon={<FaUser />}>
              Profile
            </MenuButton>
            <MenuList>
              {user ? (
                <>
                  <MenuItem as={NavLink} to={routes.account}>
                    My Account
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  {user?.role === UserRole.TRAVEL_AGENT ? (
                    <MenuItem as={NavLink} to={routes.travelAgents.base}>
                      Travel Agent Portal
                    </MenuItem>
                  ) : user?.role === UserRole.ADMINISTRATOR ? (
                    <>
                      <MenuItem as={NavLink} to={routes.travelAgents.base}>
                        Travel Agent Portal
                      </MenuItem>
                      <MenuItem as={NavLink} to={routes.admin}>
                        Admin Portal
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem as={NavLink} to={routes.wishlist.base}>
                      My Wishlist
                    </MenuItem>
                  )}
                </>
              ) : (
                <>
                  <MenuItem
                    as={NavLink}
                    to={routes.login}
                    state={{ redirectUrl: location.pathname }}
                  >
                    Login
                  </MenuItem>
                  <MenuItem as={NavLink} to={routes.register}>
                    Register
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
          <Popover>
            <PopoverTrigger>
              <Box position='relative'>
                <IconButton aria-label='cart' icon={<FaShoppingCart />} />
                {cart.length > 0 && (
                  <Circle
                    position='absolute'
                    bottom='-5px'
                    right='-5px'
                    left='25px'
                    top='25px'
                    background='red'
                    color='white'
                  >
                    {cart.length}
                  </Circle>
                )}
              </Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Cart</PopoverHeader>
              <PopoverBody>
                {cart.length === 0 && <Text>Your cart is empty, add a flight to checkout!</Text>}
                {cart.map((item) => (
                  <Box>
                    To: {item.arrivalLocation.destinationCode} <br />
                    From: {item.departureLocation.destinationCode} <br />
                    On: {item.departureTime} <br />
                    Cost: ${item.prices[0].price} <br />
                    <Text
                      as='u'
                      colorScheme='gray'
                      onClick={() => {
                        setCart([...cart.filter((cartItem) => cartItem.id !== item.id)]);
                      }}
                    >
                      {' '}
                      Remove
                    </Text>
                    <Divider orientation='horizontal' />
                  </Box>
                ))}{' '}
                <br />
                <Button colorScheme='red' disabled={cart.length === 0} onClick={handleCheckout}>
                  Checkout
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Flex>
    </Box>
  );
}
