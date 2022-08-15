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
import {ResultsTable} from "../../components/CancelFlightsTable";

//container for flexidate information, contains date and flex-date range
interface FlexiDate {
    date: string;
}

//container for search query
interface SearchQuery {
    locationCode?: string;
    covidDuration: FlexiDate;
}

const handleDiscardChanges = () => {
    // TODO : replace this with real refresh logic
    window.location.reload();
};

const handleSaveChanges = (e: SyntheticEvent) => {
    // TODO : actually make an entry
};

export const CovidHotspotTab = ({setIsLoading}: { setIsLoading: (value: boolean) => void }) => {
    const toast = useToast();
    const [returnDate, setReturnDate] = useState(new Date()); // Return date, not currently used in request (visual only)
    const [destination, setDestination] = useState<CovidDestination[]>([]);
    const [iDFilter,setIDFilter] = useState("");
    // todo list, make this object, make table, fill table (copy flights)
    const {httpPost} = useApi(endpoints.covidUpdate);
    const {httpGet} = useApi(endpoints.getCovid);
    const {isOpen, onOpen, onClose} = useDisclosure();

    //Formats from JavaScript Date type to string
    const formatDate = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    //authRequest : stores search query request
    const [searchQuery, setSearchQuery] = useState<SearchQuery>({
        covidDuration: {date: formatDate(new Date())}
    });

    //Handles update of search query input, updating value(s)
    const handleSearchQueryUpdate = (field: keyof SearchQuery, value: any) => {
        setSearchQuery({...searchQuery, [field]: value});
    };

    // sets covid destination information on-load
    useEffect(() => {
        httpGet('').then(setDestination);
    }, []);

    //filtering by duration
    const filterById = (val: string) => {
        setIDFilter(val);
    };

    //Filters resultdata based on stored filter criteria
    const filterResults = (result: CovidDestination) => {
        if (result.covidCode.includes(iDFilter)) return false;

        return true;
    };

    const columns: ColumnDefinition<any>[] = [
        {
            accessor: 'covidCode',
            Header: 'Id',
        },
        {
            accessor: 'covidStartDate',
            Header: 'StartDate'
        },
        {
            accessor: 'covidEndDate',
            Header: 'EndDate'
        },
        {
            accessor: 'locationCode',
            Header: 'Location'
        }
    ];

    function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        httpPost('', searchQuery)
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

    function handleCovidDestination(e: FormEvent<HTMLFormElement>) {
        // e.preventDefault();
        //
        // httpPost(endpoints.admin, destination)
        //     .then(() => {
        //
        //     }).finally( () => {})
    }


    return (
        <>
            <Heading mb='1em'>Covid Hotspot</Heading>
            <Center>
                <HStack gap={'5em'}>
                    <form>
                        <VStack gap='2em'>
                            <Box>
                                {/* Departure location input */}
                                <FormControl isRequired>
                                    <FormLabel>Covid Location</FormLabel>
                                    <AutoComplete
                                        openOnFocus
                                        onChange={(value) => handleSearchQueryUpdate('locationCode', value)}
                                    >
                                        <AutoCompleteInput variant='filled'/>
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
                                        minDate={new Date(searchQuery.covidDuration.date) || new Date()}
                                        selected={returnDate}
                                        onChange={(date: Date) => setReturnDate(date)}
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <Button colorScheme={'gray'} onClick={handleDiscardChanges}>
                                    Clear
                                </Button>
                                <Button colorScheme={'blue'} onClick={handleSaveChanges}>
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
                                    data={destination.filter(filterResults)}
                                    keyAccessor='id'
                                ></ResultsTable>
                            </Center>

                            <Box>
                                <Button colorScheme={'blue'} onClick={handleSaveChanges}>
                                    Confirm
                                </Button>
                            </Box>
                        </VStack>
                    </form>
                </HStack>
            </Center>
        </>
    );
};
