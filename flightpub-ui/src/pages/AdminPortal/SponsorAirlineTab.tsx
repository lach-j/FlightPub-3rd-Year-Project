import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Center
} from '@chakra-ui/react';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { CustomEditible } from '../../components/CustomEditable';
import { routes } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import { airlines } from '../../data/airline';
import DatePicker from 'react-datepicker';
import { endpoints } from '../../constants/endpoints';
import * as api from '../../services/ApiService';
import { ApiError, useApi } from '../../services/ApiService';
import { request } from 'http';
import { ColumnDefinition } from '../../models';
import { SponsoredAirline } from '../../models/SponsoredAirline';

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
  airlineName?: string;
}

const handleDiscardChanges = () => {
  // TODO : replace this with real refresh logic
  window.location.reload();
};

const handleSaveChanges = () => {
  // TODO : actually make an entry
};

export const SponsorAirlineTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const toast = useToast();
  const [covidDate, setCovidDate] = useState(new Date()); // Return date, not currently used in request (visual only)
  //Formats from JavaScript Date type to string
  const [iDFilter, setIDFilter] = useState('');

  // const {httpGet} = useApi(endpoints.getCovid);
  const [sponsoredAirline, setSponsoredAirline] = useState<SponsoredAirline>();
  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  // sets covid destination information on-load
  useEffect(() => {
    // httpGet('').then(setSponsoredAirline);
  }, []);

  const columns: ColumnDefinition<any>[] = [
    {
      accessor: 'id',
      Header: 'Id'
    },
    {
      accessor: 'sponsoredStartDate',
      Header: 'Start Date'
    },
    {
      accessor: 'sponsoredEndDate',
      Header: 'End Date'
    },
    {
      accessor: 'airlineCode',
      Header: 'Airline'
    }
  ];

  //authRequest : stores search query request
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    departureDate: { date: formatDate(new Date()) }
  });

  const handleSponsorshipUpdate = () => {
    setIsLoading(true);
  };

  //Handles update of search query input, updating value(s)
  const handleSearchQueryUpdate = (field: keyof SearchQuery, value: any) => {
    setSearchQuery({ ...searchQuery, [field]: value });
  };

  return (
    <>
      <Heading mb='1em'>Sponsor Airline</Heading>
      <Center>
        <HStack gap={'5em'}>
          <form>
            <VStack gap='2em'>
              <Box>
                {/* Sponsored Airline input */}
                <FormControl isRequired>
                  <FormLabel>Choose Airline</FormLabel>
                  <AutoComplete
                    openOnFocus
                    suggestWhenEmpty
                    emptyState={true}
                    onChange={(value) => handleSearchQueryUpdate('airlineName', value)}
                  >
                    <AutoCompleteInput
                      variant='filled'
                      onBlur={() => handleSearchQueryUpdate('airlineName', undefined)}
                    />
                    <AutoCompleteList>
                      {airlines.map(({ airlineName }) => (
                        <AutoCompleteItem key={airlineName} value={airlineName} align='center'>
                          <Text ml='4'>{airlineName}</Text>
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteList>
                  </AutoComplete>
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Sponsorship Duration</FormLabel>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    minDate={new Date(searchQuery.departureDate.date) || new Date()}
                    selected={covidDate}
                    onChange={(date: Date) =>
                      handleSearchQueryUpdate('departureDate', {
                        ...searchQuery?.departureDate,
                        date: formatDate(date)
                      })
                    }
                  />
                </FormControl>
              </Box>
              <Box>
                <Button colorScheme={'gray'} onClick={handleDiscardChanges}>
                  Clear
                </Button>
                <Button colorScheme={'blue'} onClick={handleSponsorshipUpdate}>
                  Confirm
                </Button>
              </Box>
            </VStack>
          </form>
          <form>
            <VStack gap='2em'>
              <Center flex='1'></Center>
            </VStack>
          </form>
        </HStack>
      </Center>
    </>
  );
};
