import React from 'react';
import {Box, Button, Center, Grid, VStack} from "@chakra-ui/react";
import logo from '../logo.png';

console.log(logo);

export const HomePage = () => {

    return (
        <Grid>
            <Center>
                <VStack
                    spacing={2}
                    align='center'>
                    <Box>
                        <img src={logo} alt="Logo" width={'20%'}/>
                    </Box>
                    <Box>
                        <form>
                            <Button type="submit" colorScheme="red">
                                Search For a Flight
                            </Button>
                            <Button type="submit" colorScheme="red">
                                I'm Feeling Lucky
                            </Button>
                        </form>
                    </Box>
                </VStack>
            </Center>
        </Grid>
    )
}