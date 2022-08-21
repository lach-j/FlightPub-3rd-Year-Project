import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import DatePicker from 'react-datepicker';
import { Airline, ColumnDefinition } from '../../models';
import { DataTable } from '../../components/DataTable';
import { ApiError, useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { SponsoredAirline } from '../../models/SponsoredAirline';
import moment from 'moment';

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

export const SponsorAirlineTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const toast = useToast();
  const [selectedAirline, setSelectedAirline] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [airlines, setAirlines] = useState<Airline[]>([]);

  const { httpPost, httpGet, httpDelete } = useApi(endpoints.airlines);

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const columns: ColumnDefinition<SponsoredAirline>[] = [
    {
      accessor: 'id',
      Header: 'Id'
    },
    {
      accessor: 'startDate',
      Header: 'Start Date'
    },
    {
      accessor: 'endDate',
      Header: 'End Date'
    },
    {
      accessor: 'airline.airlineName',
      Header: 'Airline'
    }
  ];

  const loadSponsored = () => {
    httpGet('').then(setAirlines);
  };

  useEffect(() => {
    loadSponsored();
  }, []);

  const handleSponsorshipUpdate = () => {
    setIsLoading(true);
    httpPost(`/${selectedAirline}/sponsor`, {
      startDate: formatDate(endDate),
      endDate: formatDate(endDate)
    })
      .then(() => loadSponsored())
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveSponsorship = (listingId: number) => {
    setIsLoading(true);
    httpDelete(`/${listingId}/sponsor`)
      .then((authResponse) => {
        toast({
          title: 'Sponsorship Removed',
          description: 'The sponsorship was removed succesfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        loadSponsored();
      })
      .catch((err: ApiError) => {
        //if an error occurs in registration process
        toast({
          title: 'Error.',
          description: err.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top'
        });
      })
      .finally(() => setIsLoading(false));
  };

  const sponsoredResults: {
    startDate: string;
    endDate: string;
    id: number;
    airline: { airlineCode: string; airlineName: string };
  }[] = [];

  airlines
    .filter((a) => a?.sponsorships?.length || 0 > 0)
    .forEach((a) =>
      a.sponsorships?.forEach((s) =>
        sponsoredResults.push({
          ...s,
          airline: { airlineCode: a.airlineCode, airlineName: a.airlineName }
        })
      )
    );

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
                    onChange={(value) => setSelectedAirline(value.split('-')[1])}
                  >
                    <AutoCompleteInput variant='filled' />
                    <AutoCompleteList>
                      {airlines.map(({ airlineName, airlineCode }) => (
                        <AutoCompleteItem
                          key={`${airlineName}-${airlineCode}`}
                          value={`${airlineName}-${airlineCode}`}
                          align='center'
                        >
                          <Text ml='4'>{airlineName}</Text>
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteList>
                  </AutoComplete>
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={startDate}
                    onChange={(date: Date) => {
                      setStartDate(date);
                      if (moment(date).isAfter(endDate)) setEndDate(date);
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    minDate={startDate || new Date()}
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                  />
                </FormControl>
              </Box>
              <Box>
                <Button colorScheme={'blue'} onClick={handleSponsorshipUpdate}>
                  Confirm
                </Button>
              </Box>
            </VStack>
          </form>
          <form>
            <VStack gap='2em'>
              <Center flex='1'>
                <DataTable
                  sortable
                  columns={columns}
                  data={sponsoredResults}
                  keyAccessor='id'
                  extraRow={({ id }: { id: number }) => (
                    <Button
                      colorScheme='red'
                      onClick={() => {
                        handleRemoveSponsorship(id);
                      }}
                    >
                      Revoke Sponsorship
                    </Button>
                  )}
                ></DataTable>
              </Center>
            </VStack>
          </form>
        </HStack>
      </Center>
    </>
  );
};
