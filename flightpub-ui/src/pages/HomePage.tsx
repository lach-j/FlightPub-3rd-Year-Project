import React from 'react';
import {Box, Button, Center, Grid, StackDivider, VStack} from "@chakra-ui/react";
import logo from '../FlightPubLogo.png';

export const HomePage = () => {

    return (
        <Grid>
            <Center>
                <VStack
                    spacing={10}
                    align='center'
                    divider={<StackDivider borderColor='white'/>}>
                    <Center  backgroundColor='gray.600' maxW="1000px" mx="auto">
                        <img src={logo} alt="Logo" width='1000px'/>
                    </Center>
                    <Box>
                        <form>
                            <Button type="submit" colorScheme="red" width='500px'>
                                Search For a Flight
                            </Button>
                            <Button type="submit" colorScheme="red" width='500px'>
                                I'm Feeling Lucky
                            </Button>
                        </form>
                    </Box>
                </VStack>
            </Center>
        </Grid>
    )
}