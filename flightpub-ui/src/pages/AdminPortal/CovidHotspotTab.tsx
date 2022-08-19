import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Center,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack, Input,
    Text,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react';
import React, {FormEvent, SyntheticEvent, useEffect, useState} from 'react';
import {CustomEditible} from '../../components/CustomEditable';
import {routes} from '../../constants/routes';
import {useNavigate} from 'react-router-dom';
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import {airports} from '../../data/airports';
import DatePicker from 'react-datepicker';
import {endpoints} from '../../constants/endpoints';
import {Destination} from '../../models/Destination';
import {ApiError, useApi} from '../../services/ApiService';
import {CovidDestination} from "../../models/CovidDestination";
import {ColumnDefinition, Flight} from "../../models";
import {DataTable} from "../../components/DataTable";
import {ResultsTable} from "../../components/CovidTable";


interface FlexiDate {
    date: string;
    flex?: number;
}

//container for search query
interface SearchQuery {
    departureDate: FlexiDate;
    departureCode?: string;
    destinationCode?: string;
    tickets?: Map<string, number>;
    returnFlight?: boolean;
    searchTags?: Array<string>;
    multiLeg?: boolean;
}

const handleDiscardChanges = () => {
    // TODO : replace this with real refresh logic
    window.location.reload();
};


export const CovidHotspotTab = ({setIsLoading}: { setIsLoading: (value: boolean) => void }) => {
    const toast = useToast();
    const [returnDate, setReturnDate] = useState(new Date()); // Return date, not currently used in request (visual only)
    const [destination, setDestination] = useState<CovidDestination[]>([]);



    const [chosenLocation, setChosenLocation] = useState<string>()
    const [iDFilter, setIDFilter] = useState("");
    // todo list, make this object, make table, fill table (copy flights)
    const {httpPost} = useApi(endpoints.covidUpdate);
    const {httpGet} = useApi(endpoints.getCovid);
    const {isOpen, onOpen, onClose} = useDisclosure();

    //Formats from JavaScript Date type to string
    const formatDate = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    // sets covid destination information on-load
    useEffect(() => {
        httpGet('').then(setDestination);
    }, []);

    //authRequest : stores search query request
    const [searchQuery, setSearchQuery] = useState<SearchQuery>({
        departureDate: { date: formatDate(new Date()) },
    });

    //Handles update of search query input, updating value(s)
    const handleSearchQueryUpdate = (field: keyof SearchQuery, value: any) => {
        setSearchQuery({ ...searchQuery, [field]: value });
    };


    const columns: ColumnDefinition<any>[] = [
        {
            accessor: 'id',
            Header: 'Id',
        },
        {
            accessor: 'covidStartDate',
            Header: 'Start Date'
        },
        {
            accessor: 'covidEndDate',
            Header: 'End Date'
        },
        {
            accessor: 'locationCode',
            Header: 'Location'
        }
    ];



    function handleSaveChanges(this: any, e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onOpen();


        const current = new Date();



        httpPost('', {locationCode: chosenLocation, covidEndDate: returnDate, covidStartDate: current})
            .then((response) => {
                toast({
                    title: 'Booking Confirmed',
                    description: 'Your booking was made successfully',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    position: 'top'
                });
            })

            .finally(() => onClose());
    };





    return (
        <>
            <Heading mb='1em'>Covid Hotspot</Heading>
            <Center>
                <HStack gap={'5em'}>
                    <form onSubmit={handleSaveChanges}>
                        <VStack gap='2em'>
                            <Box>
                                {/* Departure location input */}
                                <FormControl isRequired>
                                    <FormLabel>Covid Location</FormLabel>
                                    <AutoComplete
                                        openOnFocus
                                        suggestWhenEmpty
                                        onChange={(e)=> setChosenLocation(e.target.value)}
                                    >
                                        <AutoCompleteInput
                                            onBlur={(e)=> setChosenLocation(e.target.value)}
                                            variant='filled'
                                        />
                                        <AutoCompleteList>
                                            {airports.map(({code, city}) => (
                                                <AutoCompleteItem key={code} value={code} align='center'>
                                                    <Text ml='4'>{city}</Text>
                                                </AutoCompleteItem>
                                            ))}
                                        </AutoCompleteList>
                                    </AutoComplete>
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl>
                                    <FormLabel>Restriction Duration</FormLabel>
                                    <DatePicker
                                        dateFormat='dd/MM/yyyy'
                                        minDate={new Date()}
                                        selected={new Date(searchQuery.departureDate.date)}
                                        onChange={(date: Date) => setReturnDate(date)}
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <Button colorScheme={'gray'} onClick={handleDiscardChanges}>
                                    Clear
                                </Button>
                                <Button colorScheme={'blue'} type='submit'>
                                    Confirm
                                </Button>
                            </Box>
                        </VStack>
                    </form>
                    <form>
                        <VStack gap='2em'>

                            {/*TODO put a filter search here*/}
                            <Center flex='1'>

                                <ResultsTable
                                    columns={columns}
                                    data={destination}
                                    keyAccessor='id'
                                />
                            </Center>

                        </VStack>
                    </form>
                </HStack>
            </Center>
        </>
    );
};
