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
  StatNumber, Table,
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
import { airportsGeoJSON } from '../data/airportsGeoJSON';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { routes } from '../constants/routes';
import { ColumnDefinition, Flight } from '../models';
import * as _ from 'lodash';
import { httpGet } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';

const flightColumns: ColumnDefinition<any>[] = [
  { Header: 'Destination', accessor: 'ArrivalCode' },
  { Header: 'Departure Time', accessor: 'DepartureTime' },
  { Header: 'Price', accessor: 'Price', transform: (props: any) => `$${props.value.toFixed(2)}` },
];


export const MapPage = () => {
  const [selectedAirport, setSelectedAirport] = useState<GeoJSON.Feature<GeoJSON.Geometry> | undefined>();
  const [flights, setFlights] = useState<Flight[]>([]);
  const navigate = useNavigate();
  const geolocateRef = useRef<GeolocateControlRef>(null);
  const onAirportSelected = (airportFeature: GeoJSON.Feature<GeoJSON.Geometry>) => {

    if (airportFeature === selectedAirport) {
      setSelectedAirport(undefined);
      return;
    }
    setSelectedAirport(airportFeature);
  };

  const handleGeolocate = ({ coords }: { coords: GeolocationCoordinates }) => {
    const { latitude, longitude } = coords;
    setSelectedAirport(findNearestAirport([longitude, latitude]));
  };

  const findNearestAirport = (userLocation: [number, number]): GeoJSON.Feature<GeoJSON.Geometry> | undefined => {
    if (!userLocation) return;
    let airports = airportsGeoJSON.features;
    let nearest = airports[0];
    let distance = calculateDistance(userLocation, airports[0].geometry.coordinates);
    airports.slice(1).forEach(airport => {
      let tempDist = calculateDistance(userLocation, airport.geometry.coordinates);
      if (tempDist < distance) {
        distance = tempDist;
        nearest = airport;
      }
    });
    return nearest;
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

  const calculateDistance = (point1: number[], point2: number[]) => {
    return Math.sqrt(Math.pow(
      (point2[0] - point1[0]),
      2,
    ) + Math.pow(
      (point2[1] - point1[1]),
      2,
    ));
  };

  const getFlightsForSelectedAirport = (selected: any) => {
    return flights.filter((flight) => {
      return flight.departureLocation.destinationCode === selected?.properties?.code;
    }).sort(
      (a, b) => a.departureTime > b.departureTime ? 1 : -1).map((f) => {
      return {
        ...f,
        DepartureTime: new Date(f.departureTime).toLocaleString('en-AU', {
          dateStyle: 'short',
          timeStyle: 'short',
          hour12: false,
        }),
      };
    });
  };

  const getUrlParams = (params: any) => {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
  };
  const flightsFromHere = getFlightsForSelectedAirport(selectedAirport);
  return (
    <Box h={'full'} display={'flex'}>
      <Box w={'30em'} p={'1em'}>
        <Heading
          fontSize={'1.5em'}>{selectedAirport ? `Flights from ${selectedAirport?.properties?.name} (${selectedAirport?.properties?.code})` : 'Select an airport to view flights'}</Heading>
        <ResultsTable columns={flightColumns} flights={flightsFromHere} />
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
          airportsGeoJSON.features.map((feature) => {
            let flight = getFlight(selectedAirport?.properties?.code, feature?.properties?.code);
            let hasFlights = getFlightsForSelectedAirport(feature).length > 0;
            return (
              <>
                {flight && <Popup maxWidth={'unset'} closeButton={false} closeOnClick={false}
                                  longitude={feature.geometry.coordinates[0]}
                                  latitude={feature.geometry.coordinates[1]}>
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
                <Marker longitude={feature.geometry.coordinates[0]} latitude={feature.geometry.coordinates[1]}
                        key={feature?.properties?.id}>
                  <Icon cursor={hasFlights ? 'pointer' : 'default'} as={MdLocalAirport}
                        color={hasFlights ? (selectedAirport === feature ? 'red' : 'black') : 'lightgray'}
                        fontSize={'3em'} onClick={() => {
                    onAirportSelected(feature);
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

const ResultsTable = ({columns,flights}: { columns: ColumnDefinition<any>[], flights: Flight[] }) => {
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
      <Tbody>
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
