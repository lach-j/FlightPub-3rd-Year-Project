import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, Button,
  Flex,
  Heading, HStack, Text, VStack,
} from '@chakra-ui/react';
import { BiRightArrow, HiOutlineArrowNarrowRight } from 'react-icons/all';
import { CustomEditible } from '../components/CustomEditable';
import React from 'react';

export const BookingPage = () => {
  return (
    <Flex justifyContent={'center'} p={'5em'}>
      <Accordion allowToggle={true} maxW={'50%'} w={'50%'}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                <HStack>
                  <Text fontWeight={'bold'}>AMS</Text>
                  <HiOutlineArrowNarrowRight />
                  <Text fontWeight={'bold'}>FCO</Text>
                </HStack>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <form>
        <VStack gap={'1em'}>
          <HStack w={'full'} gap={'1em'}>
            <Button
              colorScheme={'blue'}
            >
              Save
            </Button>
            <Button
              colorScheme={'gray'}
            >
              Discard Changes
            </Button>
          </HStack>
        </VStack>
      </form>
    </Flex>
  )
}