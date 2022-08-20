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
  const [cancelledView, setSwapLists] = useState(true);

  const [results, setResults] = useState<Flight[]>([]);
  const [canceledResults, setCanceledResults] = useState<Flight[]>([]);
  const [idFilter, setIdFilter] = useState('');

  const { httpGet } = useApi(endpoints.flightSearch);

  const { httpPost } = useApi(endpoints.flights);

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
    httpGet('', { cancelled: cancelledView }).then((res) => setResults(res));
  };

  // retrieves list of airlines
  useEffect(() => {
    loadFlights();
  }, [idFilter, cancelledView]);

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
            setSwapLists(!cancelledView);
          }}
        >
          See {!cancelledView ? 'Cancelled' : 'Active'} Flights
        </Button>
      </HStack>

      <Input placeholder='Flight Number' size='md' onChange={debouncedChangeHandler} />
      <Center>
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
              colorScheme={!cancelledView ? 'red' : 'green'}
              onClick={() => {
                httpPost(`/${data.id}/cancel`, { cancelled: !cancelledView })
                  .then((authResponse) => {
                    toast({
                      title: `Flight ${!cancelledView ? 'Canceled' : 'Restored'}`,
                      description: 'The flight was successfully updated',
                      status: 'success',
                      duration: 9000,
                      isClosable: true,
                      position: 'top'
                    });
                    loadFlights();
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
              {!cancelledView ? 'Cancel' : 'Restore'}
            </Button>
          )}
        ></DataTable>
      </Center>
    </>
  );
};
