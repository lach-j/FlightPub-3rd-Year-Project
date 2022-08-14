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
  HStack,
  Text,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, { FormEvent, SyntheticEvent, useState } from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import { airports } from '../../data/airports';
import DatePicker from 'react-datepicker';
import { endpoints } from '../../constants/endpoints';
import { Destination } from '../../models/Destination';
import { useApi } from '../../services/ApiService';

//container for flexidate information, contains date and flex-date range
interface FlexiDate {
  date: string;
}

//container for search query
interface SearchQuery {
  covidDate: FlexiDate;
  locationCode?: string;
}

const handleDiscardChanges = () => {
  // TODO : replace this with real refresh logic
  window.location.reload();
};

const handleSaveChanges = (e: SyntheticEvent) => {
  // TODO : actually make an entry
};

export const CovidHotspotTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const toast = useToast();
  const [returnDate, setReturnDate] = useState(new Date()); // Return date, not currently used in request (visual only)
  const [destination, setDestination] = useState<Destination>();

  //Formats from JavaScript Date type to string
  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  //authRequest : stores search query request
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    covidDate: { date: formatDate(new Date()) }
  });

  function handleCovidDestination(e: FormEvent<HTMLFormElement>) {
    // e.preventDefault();
    //
    // httpPost(endpoints.admin, destination)
    //     .then(() => {
    //
    //     }).finally( () => {})
  }

  //Handles update of search query input, updating value(s)
  const handleSearchQueryUpdate = (field: keyof SearchQuery, value: any) => {
    setSearchQuery({ ...searchQuery, [field]: value });
  };
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
                    <AutoCompleteInput variant='filled' />
                    <AutoCompleteList>
                      {airports.map(({ code, city }) => (
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
                    minDate={new Date(searchQuery.covidDate.date) || new Date()}
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
              <Box>
                {/* Departure location input */}
                <FormControl isRequired>
                  <FormLabel>Covid Location</FormLabel>
                  <AutoComplete
                    openOnFocus
                    onChange={(value) => handleSearchQueryUpdate('locationCode', value)}
                  >
                    <AutoCompleteInput variant='filled' />
                    <AutoCompleteList>
                      {airports.map(({ code, city }) => (
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
                    minDate={new Date(searchQuery.covidDate.date) || new Date()}
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
        </HStack>
      </Center>
    </>
  );
};
