import React from 'react';
import {Center, Grid} from "@chakra-ui/react";
import logo from '../logo.png';

console.log(logo);

export const HomePage = () => {

    return (
        <Grid>
            <Center>
                <img src={logo} alt="Logo" />;
            </Center>
        </Grid>
    )
}