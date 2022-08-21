import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Text,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import { airports } from '../../data/airports';
import DatePicker from 'react-datepicker';
import { endpoints } from '../../constants/endpoints';
import { ApiError, useApi } from '../../services/ApiService';
import { CovidDestination } from '../../models/CovidDestination';
import { ColumnDefinition } from '../../models';
import { DataTable } from '../../components/DataTable';

export const CovidHotspotTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const toast = useToast();
  const [restrictionDuration, setRestrictionDuration] = useState<Date>(new Date());
  const [chosenLocation, setChosenLocation] = useState<string>('');

  const [destinations, setDestinations] = useState<CovidDestination[]>([]);

  const { httpGet, httpPost, httpDelete } = useApi(endpoints.covid);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // sets covid destination information on-load
  useEffect(() => {
    httpGet('').then(setDestinations);
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const handleDiscardChanges = () => {
    setChosenLocation('');
    setRestrictionDuration(new Date());
  };

  const columns: ColumnDefinition<CovidDestination>[] = [
    {
      accessor: 'id',
      Header: 'Id'
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
      accessor: 'destination.destinationCode',
      Header: 'Location'
    }
  ];

  function handleSaveChanges(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onOpen();

    setIsLoading(true);
    httpPost('', {
      locationCode: chosenLocation,
      restrictionDuration: formatDate(restrictionDuration)
    })
      .then((response: CovidDestination) => {
        toast({
          title: 'Destination Restricted',
          description: 'The destination has been restricted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });

        destinations.unshift(response);
      })
      .finally(() => setIsLoading(false));
  }

  const handleRemoveCovid = (covidId: number) => {
    setIsLoading(true);
    httpDelete(`/${covidId}`)
      .then((authResponse) => {
        toast({
          title: 'Covid Restriction Removed',
          description: 'The destination was removed succesfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        setDestinations((dests) => dests.filter((d) => d.id != covidId));
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

  return (
    <>
      <Heading mb='1em'>Covid Hotspot</Heading>
      <Center>
        <HStack gap={'5em'}>
          <VStack gap='2em'>
            <Box>
              {/* Departure location input */}
              <FormControl isRequired>
                <FormLabel>Covid Location</FormLabel>
                <AutoComplete
                  openOnFocus
                  suggestWhenEmpty
                  onChange={(value) => setChosenLocation(value)}
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
                  minDate={new Date()}
                  selected={restrictionDuration}
                  onChange={(date: Date) => setRestrictionDuration(date)}
                />
              </FormControl>
            </Box>
            <Box>
              <Button colorScheme={'gray'} onClick={handleDiscardChanges}>
                Clear
              </Button>
              <Button onClick={handleSaveChanges} colorScheme={'blue'} type='submit'>
                Confirm
              </Button>
            </Box>
          </VStack>
          <VStack gap='2em'>
            <Center flex='1'>
              <DataTable
                columns={columns}
                data={destinations}
                keyAccessor='id'
                extraRow={(result: CovidDestination) => (
                  <Button onClick={() => handleRemoveCovid(result.id)}>Remove</Button>
                )}
              />
            </Center>
          </VStack>
        </HStack>
      </Center>
    </>
  );
};
