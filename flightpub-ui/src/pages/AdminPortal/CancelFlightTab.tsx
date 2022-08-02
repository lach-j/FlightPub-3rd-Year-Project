import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button, Center,
    Divider,
    Heading,
    HStack,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import {Airline, ColumnDefinition, Flight, Price} from "../../models";
import {httpGet} from "../../services/ApiService";
import {endpoints} from "../../constants/endpoints";
import {ResultsTable} from "../../components/ResultsTable";



export const CancelFlightTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
    return (
        <>
            <Heading mb='1em'>Cancel Flight</Heading>

        </>
    )
}