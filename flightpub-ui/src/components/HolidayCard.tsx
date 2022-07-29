import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    Stack, Text, Heading, Button, HStack, Show, Spacer
} from '@chakra-ui/react';

import {ReactElement} from "react";
import { ImAirplane, GiNightSky, ImCheckmark2 } from 'react-icons/all';

const data = {
    isPopular: true,
    imageURL:
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/7d/68/1d/four-seasons-resort-whistler.jpg?w=600&h=400&s=1',
    name: 'Iconic Canadian Winter in Whistler',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore',
    tagline: 'Fun filled adventure in the most iconic part of Canada!',
    price: 600,
};
interface FeatureProps {
    text: string;
    iconBg: string;
    icon?: ReactElement;
}


const Feature = ({ text, icon, iconBg }: FeatureProps) => {
    return (
        <Stack direction={'row'} align={'center'}>
            <Flex
                w={8}
                h={8}
                align={'center'}
                justify={'center'}
                rounded={'full'}
                bg={iconBg}>
                {icon}
            </Flex>
            <Text fontWeight={600}>{text}</Text>
        </Stack>
    );
};


function ProductAddToCart() {
    return (
        <Flex p={5} w="full" alignItems="center" justifyContent="center" border='1px' >
            <HStack spacing={5}>
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                maxW="md"
                borderWidth="1px"
                border='1px'
                boxShadow={'2xl'}
                borderColor='gray.200'
                rounded="lg"
                shadow="lg"
                position="relative">
                {data.isPopular && (
                    <Circle
                        size="10px"
                        position="absolute"
                        top={2}
                        right={2}
                        bg="red.200"
                    />
                )}

                <Image
                    src={data.imageURL}
                    alt={`Picture of ${data.name}`}
                    roundedTop="lg"
                />

                <Box p="4">
                    <HStack alignItems="baseline" spacing="1">
                        {data.isPopular && (
                            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                                Popular
                            </Badge>
                        )}
                        <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="blue" >
                            Winter
                        </Badge>
                        <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="yellow">
                            Scenic
                        </Badge>
                    </HStack>
                    <Flex mt="1" justifyContent="space-between" alignContent="center">
                        <Box
                            fontSize="2xl"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated>
                            {data.name}
                        </Box>

                    </Flex>

                    <HStack spacing='15px'>

                        <Box fontSize="xl" color={useColorModeValue('gray.500', 'white')}>
                            7 nights
                        </Box>

                        <Box fontSize="xl" color={useColorModeValue('gray.500', 'white')}>
                            Whistler
                        </Box>
                        <Spacer />
                        <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
                            <Box as="span" color={'gray.600'} fontSize="lg">
                                $
                            </Box>
                            {data.price.toFixed(2)}
                        </Box>
                    </HStack>
                </Box>
                <Flex justifyContent="space-between" alignContent="end">
                    <Spacer />
                    <Show below='md'>
                        <Button colorScheme='red' w='100%'>View Package</Button>
                    </Show>
                </Flex>
            </Box>
                <Show above='md'>
                <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    maxW="lg"
                    rounded="lg"
                    position="relative"
                    borderRadius='md'
                    overflow='hidden'>
                    <Box pl={5}>
                        <Stack spacing={4}>
                        <Heading fontSize={'3xl'} fontFamily={'heading'}>
                            {data.tagline}
                        </Heading>
                        <Text color={'gray.500'} fontSize={'2xl'}>
                            {data.description}
                        </Text>
                            <Feature
                                icon={
                                    <Icon as={GiNightSky} color={'yellow.500'} w={5} h={5} />
                                }
                                iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                                text={'7 Nights'}
                            />
                            <Feature
                                icon={
                                    <Icon as={ImAirplane} color={'yellow.500'} w={5} h={5} />
                                }
                                iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                                text={'Flights + Accommodation'}
                            />
                            <Feature
                                icon={
                                    <Icon as={ImCheckmark2} color={'yellow.500'} w={5} h={5} />
                                }
                                iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                                text={'All Expenses Paid'}
                            />
                            <Button colorScheme='red' size='md'>View Package</Button>
                        </Stack>
                    </Box>
                </Box>
                </Show>
            </HStack>
        </Flex>
    );
}

export default ProductAddToCart;