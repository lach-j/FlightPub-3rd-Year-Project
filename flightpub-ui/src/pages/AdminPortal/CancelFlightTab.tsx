import { Button, Center, Heading, HStack, Input, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { ColumnDefinition, Flight, Price } from '../../models';
import { ApiError, useApi } from '../../services/ApiService';
import { endpoints } from '../../constants/endpoints';
import { DataTable } from '../../components/DataTable';
import { convertMinsToHM, formatDateTime } from '../../utility/formatting';
import { airlines } from '../../data/airline';
import _ from 'lodash';

export const CancelFlightTab = ({ setIsLoading }: { setIsLoading: (value: boolean) => void }) => {
  const [swapLists, setSwapLists] = useState(true);

  const [results, setResults] = useState<Flight[]>([]);
  const [canceledResults, setCanceledResults] = useState<Flight[]>([]);
  const [idFilter, setIdFilter] = useState('');

  const { httpGet: httpGetFlights } = useApi(endpoints.flightSearch);
  const { httpGet: httpGetCanceledFlights } = useApi(endpoints.flights);

  const { httpPost } = useApi(endpoints.airlineUpdate);

  const toast = useToast();

  const getMinPrice = (prices: Price[]) => Math.min(...prices.map((p) => p.price));
  const getMaxPrice = (prices: Price[]) => Math.max(...prices.map((p) => p.price));
  const getPriceString = (prices: Price[]) => {
    if (!prices) return '';
    let pricesVals = prices.map((p) => p.price);
    let minPrice = Math.min(...pricesVals);
    let maxPrice = Math.max(...pricesVals);
    return `$${minPrice}${maxPrice !== minPrice && ` - $${maxPrice}`}`;
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdFilter(event.target.value.toLowerCase());
  };
  const debouncedChangeHandler = useCallback(_.debounce(changeHandler, 500), []);

  const loadFlights = () => {
    httpGetFlights('').then(setResults);
    httpGetCanceledFlights('').then(setCanceledResults);
  };

  // retrieves list of airlines
  useEffect(() => {
    loadFlights();
  }, [idFilter]);

  // Defines columns for DataTable in correct format
  const columns: ColumnDefinition<any>[] = [
    {
      accessor: 'flightNumber',
      Header: 'Flight Number'
    },
    {
      accessor: 'airlineCode',
      Header: 'Airline',
      transform: (value) => airlines.find((a) => a.airlineCode === value)?.airlineName
    },
    {
      accessor: 'departureLocation.airport',
      Header: 'Departure Airport'
    },
    {
      accessor: 'departureTime',
      Header: 'Departure Time',
      transform: formatDateTime
    },
    {
      accessor: 'arrivalTime',
      Header: 'Arrival Time',
      transform: formatDateTime
    },
    {
      accessor: 'arrivalLocation.airport',
      Header: 'Destination Airport'
    },
    {
      accessor: 'stopOverLocation.airport',
      Header: 'Stop Over',
      transform: (value: any) => value || '---'
    },
    {
      accessor: 'prices',
      Header: 'Price',
      transform: getPriceString,
      sortValue: (prices: Price[], descending) =>
        descending ? getMaxPrice(prices) : getMinPrice(prices)
    },
    {
      accessor: 'duration',
      Header: 'Duration',
      transform: (value: any) => convertMinsToHM(value)
    }
  ];

  return (
    <>
      <HStack gap={'5em'}>
        <Heading mb='1em'>Cancel Flight</Heading>
        <Button
          onClick={() => {
            setSwapLists(!swapLists);
          }}
        >
          Swap lists
        </Button>
      </HStack>

      <Input placeholder='Flight Number' size='md' onChange={debouncedChangeHandler} />
      <Center>
        {swapLists ? (
          <DataTable
            columns={columns}
            data={results.filter(
              (f) => f.flightNumber.toLowerCase().includes(idFilter) || idFilter === ''
            )}
            keyAccessor='id'
            sortable
            extraRow={(data: Flight) => (
              <Button
                type='button'
                colorScheme='red'
                onClick={() => {
                  httpPost(`/${data.id}/cancel`, { cancel: false })
                    .then((authResponse) => {
                      toast({
                        title: 'Flight Canceled',
                        description: 'The flight was successfully canceled',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                      });
                    })
                    .catch((err: ApiError) => {
                      toast({
                        title: 'Error.',
                        description: err.message,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                      });
                    });
                }}
              >
                Cancel flight
              </Button>
            )}
          ></DataTable>
        ) : (
          <DataTable
            columns={columns}
            data={canceledResults.filter(
              (f) => f.flightNumber.toLowerCase().includes(idFilter) || idFilter === ''
            )}
            keyAccessor='id'
            sortable
            extraRow={(data: Flight) => (
              <Button
                type='button'
                colorScheme='red'
                onClick={() => {
                  httpPost(`/${data.id}/cancel`, { cancel: true })
                    .then((authResponse) => {
                      toast({
                        title: 'Flight Canceled',
                        description: 'The flight was successfully canceled',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                      });
                    })
                    .catch((err: ApiError) => {
                      toast({
                        title: 'Error.',
                        description: err.message,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                        position: 'top'
                      });
                    });
                }}
              >
                Cancel flight
              </Button>
            )}
          ></DataTable>
        )}
      </Center>
    </>
  );
};
