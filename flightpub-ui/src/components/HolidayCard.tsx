import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  Stack,
  Text,
  Heading,
  Button,
  HStack,
  Show,
  Spacer
} from '@chakra-ui/react';

import React, { ReactElement } from 'react';
import { ImAirplane, GiNightSky, ImCheckmark2 } from 'react-icons/all';
import { FeatureBadgeProps, HolidayPackage } from '../models/HolidayCardProps';
import { FlightListAccordian } from './FlightListAccordian';
import { NavLink } from 'react-router-dom';
import { routes } from '../constants/routes';

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

type HolidayCardPropsObj = {
  data: HolidayPackage;
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

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction='row' align='center'>
      <Flex w={8} h={8} align='center' justify='center' rounded='full' bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

export const HolidayCard: React.FC<HolidayCardPropsObj> = ({ data }) => {
  return (
    <Flex p={5} w='full' alignItems='center' justifyContent='center' border='1px'>
      <HStack spacing={5}>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW='md'
          borderWidth='1px'
          border='1px'
          boxShadow='2xl'
          borderColor='gray.200'
          rounded='lg'
          shadow='lg'
          position='relative'
        >
          {data.isPopular && (
            <Circle size='10px' position='absolute' top={2} right={2} bg='red.200' />
          )}

          <Image
            src={data.imageURL}
            alt={`Picture of ${data.packageName}`}
            htmlHeight={600}
            htmlWidth={400}
            roundedTop='lg'
          />

          <Box p='4'>
            <HStack alignItems='baseline' spacing='1'>
              {data.isPopular && <FeatureBadge tagName='popular' tagColor='red' />}

              {/*              {Object.values(data.tags).map((value) => {
                return <FeatureBadge tagName={value.tagName} tagColor={value.tagColor} />;
              })}*/}
            </HStack>
            <Flex mt='1' justifyContent='space-between' alignContent='center'>
              <Box
                fontSize='2xl'
                minW='500px'
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
                minW='500px'
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
            <Show below='md'>
              <Button
                colorScheme='red'
                w='100%'
                as={NavLink}
                to={`${routes.holidayPackages.book.base}/${data.id}`}
              >
                Book Package
              </Button>
            </Show>
          </Flex>
        </Box>
        <Show above='md'>
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            maxW='lg'
            rounded='lg'
            position='relative'
            borderRadius='md'
            overflow='hidden'
          >
            <Box pl={5}>
              <Stack spacing={4} minW={500}>
                <Heading fontSize='3xl' fontFamily='heading'>
                  {data.packageTagline}
                </Heading>
                <Text color='gray.500' fontSize='2xl'>
                  {data.packageDescription}
                </Text>
                <Feature
                  icon={<Icon as={GiNightSky} color='yellow.500' w={5} h={5} />}
                  iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                  text={`${data.packageNights} Nights`}
                />
                <Feature
                  icon={<Icon as={ImAirplane} color='yellow.500' w={5} h={5} />}
                  iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                  text={`Flights + Accommodation from ${data.arrivalLocation}`}
                />
                <Feature
                  icon={<Icon as={ImCheckmark2} color='yellow.500' w={5} h={5} />}
                  iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                  text='All Expenses Paid'
                />
                <Text>Flights:</Text>
                <FlightListAccordian flights={data.flights} />
                <Button
                  colorScheme='red'
                  size='md'
                  as={NavLink}
                  to={`${routes.holidayPackages.book.base}/${data.id}`}
                >
                  Book Package
                </Button>
              </Stack>
            </Box>
          </Box>
        </Show>
      </HStack>
    </Flex>
  );
};
