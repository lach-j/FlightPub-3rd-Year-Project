import React, { SetStateAction, Dispatch } from 'react';
import { Box, Text, Button, Flex, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow, PopoverCloseButton, PopoverAnchor, } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser, ImMap } from 'react-icons/all';
import { routes } from '../constants/routes';

export default function Header({cartState}: {cartState: [String[], Dispatch<SetStateAction<String[]>>]}) {
  const [cart, setCart] = cartState;
  
  return (
    <Box minH='75' h='75' bg='black'>
      <Flex alignItems='center' justifyContent='space-between' h='full' paddingRight='2em'>
        <Image />
        <HStack spacing='5'>
          <Button as={NavLink} to={routes.home}>Home</Button>
          <Button as={NavLink} to={routes.search}>Search</Button>
          <IconButton aria-label='map-view' as={NavLink} to={routes.map} icon={<ImMap />} />
          <Menu>
            <MenuButton as={IconButton} icon={<FaUser />}>
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
              onClick={() => {
                console.log(cart[0]);
              }}
             />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Cart</PopoverHeader>
              <PopoverBody>
                {cart.map((item) => 
                <Text>
                    {item}
                </Text>)}
                <NavLink to={'/booking/?Id=' + cart[0]}>
                  <Button colorScheme='red'>Checkout</Button>
                </NavLink>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Flex>
    </Box>
  );
}



