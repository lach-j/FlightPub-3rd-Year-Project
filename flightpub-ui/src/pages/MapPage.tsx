import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Map, { GeolocateControl, GeolocateControlRef, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MdLocalAirport } from 'react-icons/all';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { ColumnDefinition, DestinationCount, Flight, Price } from '../models';
import * as _ from 'lodash';
import { httpGet } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airport, findNearestAirport } from '../utility/geolocation';
import { airports } from '../data/airportsGeoJSON';

const formatDateTime = (value: string): string => new Date(value).toLocaleString('en-AU', {
  dateStyle: 'short',
  timeStyle: 'short',
  hour12: false,
});

const flightColumns: ColumnDefinition<any>[] = [
  { Header: 'Destination', accessor: 'arrivalLocation.destinationCode' },
  { Header: 'Departure Time', accessor: 'departureTime', transform: formatDateTime },
  { Header: 'Price', accessor: 'prices', transform: (price: Price[]) => `$${price[0]?.price.toFixed(2)}` },
];


export const MapPage = () => {
  const [selectedAirport, setSelectedAirport] = useState<Airport | undefined>();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [departureCount, setDepartureCount] = useState<DestinationCount[]>([]);
  const navigate = useNavigate();
  const geolocateRef = useRef<GeolocateControlRef>(null);
  const onAirportSelected = (airportFeature: Airport) => {

    if (airportFeature === selectedAirport) {
      setSelectedAirport(undefined);
      return;
    }
    setSelectedAirport(airportFeature);
  };

  useEffect(() => {
    httpGet(endpoints.departureCount).then(setDepartureCount);
  }, []);

  useEffect(() => {
    httpGet(endpoints.mapSearch + '/' + selectedAirport?.code)
      .then(setFlights);
  }, [selectedAirport]);

  const handleGeolocate = ({ coords }: { coords: GeolocationCoordinates }) => {
    const { latitude, longitude } = coords;
    setSelectedAirport(findNearestAirport([longitude, latitude]));
  };

  const getFlight = (departureCode: string, arrivalCode: string) => {
    let flight = flights.find(f => f.departureLocation.destinationCode === departureCode && f.arrivalLocation.destinationCode === arrivalCode);
    if (!flight) return;
    return {
      ...flight,
      DepartureTime: new Date(flight?.departureTime).toLocaleString('en-AU', {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
      }),
    };
  };

  return (
    <Box h={'full'} display={'flex'} position={'absolute'} top={0} left={0} right={0} bottom={0}>
      <Box w={'max-content'} p={'1em'} overflow={'auto'}>
        <Heading
          fontSize={'1.5em'}>{selectedAirport ? `Flights from ${selectedAirport?.name} (${selectedAirport?.code})` : 'Select an airport to view flights'}</Heading>
        <Box>
          <ResultsTable columns={flightColumns} flights={flights} />
        </Box>
      </Box>
      <Map
        onLoad={() => geolocateRef?.current?.trigger()}
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 3,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        mapboxAccessToken={'pk.eyJ1IjoiYzMzNTAxMzEiLCJhIjoiY2wwZXp1YzJoMG82MjNkcXQ5YmxsbWRtMCJ9.hoJ4MvSxn7j0J89DVLWaQw'}
      >
        {
          airports.map((airport) => {
            let flight = selectedAirport && getFlight(selectedAirport?.code, airport?.code);
            let hasFlights = departureCount.find(f => f.destinationCode === airport.code);
            return (
              <>
                {flight && <Popup maxWidth={'unset'} closeButton={false} closeOnClick={false}
                                  longitude={airport.coordinates[0]}
                                  latitude={airport.coordinates[1]}>
                  <Flex w={'max-content'} p={'0.5em'} gap={'1em'}>
                    <Stat>
                      <StatLabel>{flight?.DepartureTime}</StatLabel>
                      <StatNumber>{`$${Math.min(...flight.prices.map(p => p.price)).toFixed(2)}`}</StatNumber>

                      <StatHelpText>{flight.stopOverLocation ? '1 Stopover' : 'Direct'}
                        {flight.stopOverLocation &&
                          <Text textDecoration={'underline'} textDecorationStyle={'dashed'}
                                title={flight.stopOverLocation.airport || undefined}>
                            {`(${flight.stopOverLocation.destinationCode})`}
                          </Text>
                        }</StatHelpText>

                    </Stat>
                    <Box ml='3'>
                      <Text fontWeight='bold' fontSize={'md'}>
                        {flight?.arrivalLocation.airport}
                      </Text>
                      <Text fontSize='sm'>{flight.airlineCode}</Text>
                      <Button colorScheme={'red'} size={'sm'} as={NavLink} to={routes.booking}>Book
                        now</Button>
                    </Box>
                  </Flex>
                </Popup>}
                <Marker longitude={airport.coordinates[0]} latitude={airport.coordinates[1]}
                        key={airport?.id}>
                  <Icon cursor={hasFlights ? 'pointer' : 'default'} as={MdLocalAirport}
                        color={hasFlights ? (selectedAirport === airport ? 'red' : 'black') : 'lightgray'}
                        fontSize={'3em'} onClick={() => {
                    onAirportSelected(airport);
                  }} />
                </Marker>
              </>
            )
              ;
          })
        }
        <GeolocateControl ref={geolocateRef} onGeolocate={handleGeolocate} fitBoundsOptions={{ maxZoom: 4 }} />
      </Map>
    </Box>
  );
};

const ResultsTable = ({ columns, flights }: { columns: ColumnDefinition<any>[], flights: Flight[] }) => {
  return (
    <Table width='90%'>
      <Thead>
        <Tr>
          {columns.map((column) =>
            <Th>
              <HStack spacing={3}>
                <Text>{column.Header}</Text>
              </HStack>
            </Th>,
          )}
        </Tr>
      </Thead>
      <Tbody overflowY={'scroll'} maxH={'100%'} h={'100%'}>
        {flights
          .map((result: any) =>
            <Tr>
              {columns.map((column) =>
                <Td>{column?.transform ? column.transform(_.get(result, column.accessor)) : _.get(result, column.accessor)}</Td>)}
            </Tr>,
          )}
      </Tbody>
    </Table>);
};
