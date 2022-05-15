import React from "react"
import {Box, chakra, Text, HStack, Center} from "@chakra-ui/react"
import {Link} from "react-router-dom";

export default function Header() {
    return(
        <chakra.header id ="header">
            <Center>
                <Box
                    border="2px"
                    borderColor="gray.200"
                    p="10"
                    borderRadius="2xl"
                    w="md"
                >
            <HStack as="nav">
                <Link to={"/map"}>
                    <Text display="block">
                        Map Page
                    </Text>
                </Link>

                <Link to={"https://www.wikipedia.org/"}>
                    <Text display="block">
                        Main Page
                    </Text>
                </Link>

                <Link to={"/account"}>
                    <Text display="block">
                        Account Page
                    </Text>
                </Link>

                <Link to={"/booking"}>
                    <Text display="block">
                        Booking page
                    </Text>
                </Link>
            </HStack>
                </Box>
            </Center>
        </chakra.header>
    )
}



