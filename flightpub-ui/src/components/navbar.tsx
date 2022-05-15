import React from 'react';
import { Box, Button, Flex, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/all';
import { routes } from '../constants/routes';

export default function Header() {
  return (
    <Box h='75' bg='black'>
      <Flex alignItems='center' justifyContent='space-between' h='full' paddingRight={'2em'}>
        <Image />
        <HStack spacing='5'>
          <Button as={NavLink} to={routes.default}>Home</Button>
          <Button as={NavLink} to={routes.search}>Search</Button>
          <Menu>
            <MenuButton as={IconButton} icon={<FaUser />} >
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
          <IconButton
            aria-label={'cart'}
            icon={<FaShoppingCart />}
          />
        </HStack>
      </Flex>
    </Box>
  );
}



