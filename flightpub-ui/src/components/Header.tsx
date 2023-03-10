import React, { Dispatch, SetStateAction } from 'react';
import {
  Box,
  Button,
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
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser, ImMap } from 'react-icons/all';
import { routes } from '../constants/routes';
import { Flight } from '../models';

export default function Header({ cartState }: { cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>] }) {
  const [cart, setCart] = cartState;

  return (
    <Box minH='75' h='75' bg='black'>
      <Flex alignItems='center' justifyContent='space-between' h='full' paddingRight='2em'>
        <Image />
        <HStack spacing='5'>
          <Button as={NavLink} to={routes.home}>Home</Button> //Home redirect button
          <Button as={NavLink} to={routes.search}>Search</Button> //Search redirect button
          <IconButton aria-label='map-view' as={NavLink} to={routes.map} icon={<ImMap />} /> //Map page redirect button
          <Menu>
            <MenuButton as={IconButton} icon={<FaUser />}> //User profile
              Profile
            </MenuButton>
            <MenuList>
              <MenuItem as={NavLink} to={routes.login}>
                Login
              </MenuItem>
              <MenuItem as={NavLink} to={routes.register}>
                Register
              </MenuItem>
              <MenuItem as={NavLink} to={routes.account}>
                My Account
              </MenuItem>
              <MenuItem as={NavLink} to={routes.login}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label={'cart'}
                icon={<FaShoppingCart />}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Cart</PopoverHeader>
              <PopoverBody>
                {cart.length === 0 && <Text>Your cart is empty, add a flight to checkout!</Text>}
                {cart.map((item) =>
                  <Text>
                    To: {item.arrivalLocation.destinationCode} <br />
                    From: {item.departureLocation.destinationCode} <br />
                    On: {item.departureTime} <br />
                    Cost: ${item.prices[0].price} <br />
                    <Text as='u' colorScheme='gray' onClick={() => {
                      setCart([...cart.filter(cartItem => cartItem.id !== item.id)]);
                    }}> Remove</Text>
                    <Divider orientation='horizontal' />
                  </Text>,
                )} <br />
                <NavLink to={routes.booking}>
                  <Button colorScheme='red' disabled={cart.length === 0}>Checkout</Button>
                </NavLink>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Flex>
    </Box>
  );
}



