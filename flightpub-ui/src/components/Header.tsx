import React, { SetStateAction, Dispatch } from 'react';
import { Box, Text, Button, Flex, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, Divider, } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser, ImMap } from 'react-icons/all';
import { routes } from '../constants/routes';
import { Flight } from '../models'
import { Item } from 'framer-motion/types/components/Reorder/Item';

export default function Header({cartState}: {cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>]}) {
  const [cart, setCart] = cartState;

  function urlString() {
    if (cart.length < 1) return;
    
    let s = '';

    for (let i = 0; i < (cart.length - 1); i++) {
      s += 'Id=' + cart[i].id + '&';
    }
    s += 'Id=' + cart[cart.length-1].id

    return s;
  }
  
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
             />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Cart</PopoverHeader>
              <PopoverBody>
                <Divider orientation='horizontal'/>
                {cart.map((item) => 
                <Text>
                    To: {item.arrivalLocation.destinationCode} <br/>
                    From: {item.departureLocation.destinationCode} <br/>
                    On: {item.departureTime} <br/>
                    Cost: ${item.prices[0].price} <br/>
                    <Text as='u' colorScheme='gray' onClick={() => {
                      setCart([...cart.filter(cartItem => cartItem.id !== item.id)])
                    }}> Remove</Text>
                    <Divider orientation='horizontal'/>
                </Text>
                )} <br/>
                <NavLink to={'/booking/?' + urlString()}>
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



