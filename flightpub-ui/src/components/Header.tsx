import React from 'react';
import { Box, Button, Flex, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser, ImMap } from 'react-icons/all';
import { routes } from '../constants/routes';

export default function Header() {
  return (
    <Box minH='75' h='75' bg='black'>
      <Flex alignItems='center' justifyContent='space-between' h='full' paddingRight={'2em'}>
        <Image />
        <HStack spacing='5'>
          <Button as={NavLink} to={routes.home}>Home</Button>
          <Button as={NavLink} to={routes.search}>Search</Button>
          <IconButton aria-label={'map-view'} as={NavLink} to={routes.map} icon={<ImMap />} />
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
          <IconButton
            aria-label={'cart'}
            icon={<FaShoppingCart />}
            as={NavLink}
            to={routes.booking}
          />
        </HStack>
      </Flex>
    </Box>
  );
}



