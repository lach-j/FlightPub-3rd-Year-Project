import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Image,
  Spacer,
  useColorModeValue,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

import React from 'react';
import { FeatureBadgeProps, HolidayPackage } from '../models/HolidayCardProps';
import { NavLink } from 'react-router-dom';
import { routes } from '../constants/routes';
import { airports } from '../data/airports';

type HolidayCardPropsObj = {
  data: HolidayPackage;
  showBookButton: boolean;
};

const FeatureBadge = ({ tagName, tagColor }: FeatureBadgeProps) => {
  return (
    <HStack alignItems='baseline' spacing='1'>
      <Badge rounded='full' px='2' fontSize='0.8em' colorScheme={tagColor}>
        {tagName}
      </Badge>
    </HStack>
  );
};

export const HolidayCardSmall: React.FC<HolidayCardPropsObj> = ({ data, showBookButton }) => {
  const colorOptions = [
    'cyan',
    'orange',
    'yellow',
    'green',
    'teal',
    'cyan',
    'blue',
    'purple',
    'pink',
    'darkblue'
  ];

  return (
    <Flex p={5} w='full' alignItems='center' justifyContent='center'>
      <HStack spacing={5}>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW='md'
          boxShadow='2xl'
          rounded='lg'
          shadow='lg'
          position='relative'
        >
          {data.isPopular && (
            <Circle size='10px' position='absolute' top={2} right={2} bg='red.200' />
          )}

          <Image src={data.imageURL} alt={`Picture of ${data.packageName}`} roundedTop='lg' />

          <Box p='4'>
            <Box minH={'50px'}>
              <Wrap spacing='5px'>
                {data.isPopular && (
                  <WrapItem>
                    <FeatureBadge tagName='popular' tagColor='red' />
                  </WrapItem>
                )}
                {airports
                  .find((airport) => airport.code === data.arrivalLocation)
                  ?.tags.map((value) => {
                    return (
                      <WrapItem>
                        <FeatureBadge
                          tagName={value}
                          tagColor={colorOptions[Math.floor(Math.random() * colorOptions.length)]}
                        />
                      </WrapItem>
                    );
                  })}
              </Wrap>
            </Box>
            <Flex mt='1' justifyContent='space-between' alignContent='center'>
              <Box
                fontSize='2xl'
                maxW='500px'
                fontWeight='semibold'
                as='h4'
                lineHeight='tight'
                isTruncated
              >
                {data.packageName}
              </Box>
            </Flex>
            <Flex mt='1' justifyContent='space-between' alignContent='center'>
              <Box
                color={useColorModeValue('gray.500', 'white')}
                fontSize='xl'
                maxW='500px'
                fontWeight='semibold'
                as='h2'
                lineHeight='tight'
                isTruncated
              >
                {data.accommodation}
              </Box>
            </Flex>

            <HStack spacing='15px'>
              <Box fontSize='xl' color={useColorModeValue('gray.500', 'white')}>
                {data.packageNights} nights
              </Box>

              <Box fontSize='xl' color={useColorModeValue('gray.500', 'white')}>
                {data.location}
              </Box>
              <Spacer />
              <Box fontSize='2xl' color={useColorModeValue('gray.800', 'white')}>
                <Box as='span' color='gray.600' fontSize='lg'>
                  $
                </Box>
                {data?.price.toFixed(2)}
              </Box>
            </HStack>
          </Box>
          <Flex justifyContent='space-between' alignContent='end'>
            <Spacer />
            {showBookButton ? (
              <Button
                colorScheme='red'
                w='100%'
                as={NavLink}
                to={`${routes.holidayPackages.book.base}/${data.id}`}
              >
                Book Package
              </Button>
            ) : (
              <span></span>
            )}
          </Flex>
        </Box>
      </HStack>
    </Flex>
  );
};
