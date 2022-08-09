import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Box,
    Button,
    Divider, FormControl, FormLabel,
    Heading,
    HStack, Text,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, {SyntheticEvent, useState} from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList} from "@choc-ui/chakra-autocomplete";
import {airports} from "../../data/airports";
import DatePicker from 'react-datepicker';
import {endpoints} from "../../constants/endpoints";


//container for flexidate information, contains date and flex-date range
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
}

const handleDiscardChanges = () => {
    // TODO : replace this with real refresh logic
    window.location.reload();
};



const handleSaveChanges = (e: SyntheticEvent) => {
    // TODO : actually make an entry
    api.

};

const { httpGet, httpPost} = useApi("put endpoint path here");



const hereIsYourFunction = () => {
    httpPost(endpoints.admin, { ...this is the body of the request })
        .then((response) => {
            // Do something with the response...
        });
}

export const CovidHotspotTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
    const toast = useToast();
    const [returnDate, setReturnDate] = useState(new Date()); // Return date, not currently used in request (visual only)
    //Formats from JavaScript Date type to string
    const formatDate = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    //authRequest : stores search query request
    const [searchQuery, setSearchQuery] = useState<SearchQuery>({
        departureDate: { date: formatDate(new Date()) },
    });


    //Handles update of search query input, updating value(s)
    const handleSearchQueryUpdate = (field: keyof SearchQuery, value: any) => {
        setSearchQuery({ ...searchQuery, [field]: value });
    };
    return (
        <>
            <Heading mb='1em'>Covid Hotspot</Heading>
            <form>
            <VStack gap='2em'>
            <Box >
                {/* Departure location input */}
                <FormControl isRequired>
                    <FormLabel>Covid Location</FormLabel>
                    <AutoComplete
                        openOnFocus
                        onChange={(value) =>
                            handleSearchQueryUpdate('departureCode', value)
                        }
                    >
                        <AutoCompleteInput variant='filled' />
                        <AutoCompleteList>
                            {airports.map(({ code, city }) => (
                                <AutoCompleteItem
                                    key={code}
                                    value={code}
                                    align='center'
                                >
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
                        minDate={new Date(searchQuery.departureDate.date) || new Date()}
                        selected={returnDate}
                        onChange={(date: Date) => setReturnDate(date)}
                    />
                </FormControl>
            </Box>
                <Box>
                    <Button colorScheme={'gray'}

                            onClick={handleDiscardChanges}
                    >
                        Clear
                    </Button>
                    <Button colorScheme={'blue'}

                            onClick={handleSaveChanges}
                    >
                        Confirm
                    </Button>
                </Box>
            </VStack>
            </form>

        </>

    )
}