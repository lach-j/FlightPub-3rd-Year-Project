import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useToast
} from '@chakra-ui/react';
import Map, { GeolocateControl, GeolocateControlRef, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MdLocalAirport } from 'react-icons/all';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDefinition, DestinationCount, Flight, Price } from '../models';
import { useApi } from '../services/ApiService';
import { endpoints } from '../constants/endpoints';
import { Airport, findNearestAirport } from '../utility/geolocation';
import { airports } from '../data/airports';
import { formatDateTime, getMinMaxPriceString } from '../utility/formatting';
import { DataTable } from '../components/DataTable';

//Defines DataTable columns for flight table
const flightColumns: ColumnDefinition<any>[] = [
  { Header: 'Destination', accessor: 'arrivalLocation.airport' },
  { Header: 'Departure Time', accessor: 'departureTime', transform: formatDateTime },
  {
    Header: 'Price',
    accessor: 'prices',
    transform: (prices: Price[]) => getMinMaxPriceString(prices)
  }
];

export const MapPage = ({
  cartState
}: {
  cartState: [Flight[], Dispatch<SetStateAction<Flight[]>>];
}) => {
  useEffect(() => {
    document.title = 'FlightPub - Map Search';
  });

  const toast = useToast();

  const [cart, setCart] = cartState;

  // selectedAiport : airport selected by user on map
  const [selectedAirport, setSelectedAirport] = useState<Airport | undefined>();

  // flights : Defines list of outgoing flights from a location
  const [flights, setFlights] = useState<Flight[]>([]);

  //departureCount : defines number of outgoing flights
  const [departureCount, setDepartureCount] = useState<DestinationCount[]>([]);

  //enables react programatic navigation
  const navigate = useNavigate();

  // useRef hook from react-map-gl package
  const geolocateRef = useRef<GeolocateControlRef>(null);

  //Updates selectedAirport upon UI selection
  const onAirportSelected = (airportFeature: Airport) => {
    if (airportFeature === selectedAirport) {
      setSelectedAirport(undefined);
      return;
    }
    setSelectedAirport(airportFeature);
  };

  const { httpGet: httpGetDepartureCount } = useApi(endpoints.departureCount);
  const { httpGet: httpGetMap } = useApi(endpoints.mapSearch);

  //Defines departureCount onload
  useEffect(() => {
    httpGetDepartureCount('').then(setDepartureCount);
  }, []);

  //Determines outgoing flghts from closest airport on-load
  useEffect(() => {
    httpGetMap('/' + selectedAirport?.code).then(setFlights);
  }, [selectedAirport]);

  // Determines user location and finds nearest airport to user
  const handleGeolocate = ({ coords }: { coords: GeolocationCoordinates }) => {
    const { latitude, longitude } = coords;
    setSelectedAirport(findNearestAirport([longitude, latitude]));
  };

  //Returns flight information based on selected flight given departure and arrival code
  const getFlight = (departureCode: string, arrivalCode: string) => {
    let flight = flights.find(
      (f) =>
        f.departureLocation.destinationCode === departureCode &&
        f.arrivalLocation.destinationCode === arrivalCode
    );
    if (!flight) return;
    return {
      ...flight,
      DepartureTime: new Date(flight?.departureTime).toLocaleString('en-AU', {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
      })
    };
  };

  const getResult = (departureCode: string, arrivalCode: string) => {
    let flight = flights.find(
      (f) =>
        f.departureLocation.destinationCode === departureCode &&
        f.arrivalLocation.destinationCode === arrivalCode
    );
    return flight;
  };

  return (
    <Box h='full' display='flex' position='absolute' top={0} left={0} right={0} bottom={0}>
      <Box w='max-content' p='1em' overflow='auto'>
        <Heading
          //Displays users selected airport or prompts user to select airport
          fontSize='1.5em'
        >
          {selectedAirport
            ? `Flights from ${selectedAirport?.name} (${selectedAirport?.code})`
            : 'Select an airport to view flights'}
        </Heading>
        <Box>
          {/* 'DataTable for outgoing flights from a destination' */}
          <DataTable columns={flightColumns} data={flights} keyAccessor='id' />
        </Box>
      </Box>
      {/* 'Visual map element provided by package react-map-gl' */}
      <Map
        //Default settings for map
        onLoad={() => geolocateRef?.current?.trigger()}
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        mapboxAccessToken={
          'pk.eyJ1IjoiYzMzNTAxMzEiLCJhIjoiY2wwZXp1YzJoMG82MjNkcXQ5YmxsbWRtMCJ9.hoJ4MvSxn7j0J89DVLWaQw'
        }
      >
        {
          //Populates map with airport markers and popup elements to select outgoing flights
          airports.map((airport) => {
            //finds departure and arrival airport information
            let flight = selectedAirport && getFlight(selectedAirport?.code, airport?.code);
            let result = selectedAirport && getResult(selectedAirport?.code, airport?.code);
            //List of outgoing flights
            let hasFlights = departureCount.find((f) => f.destinationCode === airport.code);
            return (
              <>
                {/* Popup UI element for outgoing flights on map based on airport co-ordinates */}
                {flight && (
                  <Popup
                    maxWidth='unset'
                    closeButton={false}
                    closeOnClick={false}
                    longitude={airport.coordinates[0]}
                    latitude={airport.coordinates[1]}
                  >
                    <Flex w='max-content' p='0.5em' gap='1em'>
                      <Stat>
                        {/* Flight departure time */}
                        <StatLabel>{flight?.DepartureTime}</StatLabel>
                        {/* Flight price */}
                        <StatNumber>{`$${Math.min(...flight.prices.map((p) => p.price)).toFixed(
                          2
                        )}`}</StatNumber>

                        {/* Flight type */}
                        <StatHelpText>
                          {flight.stopOverLocation ? '1 Stopover' : 'Direct'}
                          {flight.stopOverLocation && (
                            <Text
                              textDecoration='underline'
                              textDecorationStyle='dashed'
                              title={flight.stopOverLocation.airport || undefined}
                            >
                              {`(${flight.stopOverLocation.destinationCode})`}
                              {/* stopover airport code */}
                            </Text>
                          )}
                        </StatHelpText>
                      </Stat>
                      <Box ml='3'>
                        {/* arrival airport information */}
                        <Text fontWeight='bold' fontSize='md'>
                          {flight?.arrivalLocation.airport}
                        </Text>
                        {/* flight airline */}
                        <Text fontSize='sm'>{flight.airline.airlineCode}</Text>
                        {/* book flight button on Map UI element */}
                        <Button
                          colorScheme='red'
                          size='sm'
                          onClick={() => {
                            if (result) {
                              if (
                                [...cart.filter((cartItem) => cartItem.id === result?.id)].length >
                                0
                              ) {
                                toast({
                                  title: 'Error!',
                                  description: 'Flight already in cart!.',
                                  status: 'error',
                                  duration: 9000,
                                  isClosable: true,
                                  position: 'top'
                                });
                              } else {
                                let r: Flight = result;
                                setCart((cart) => [...cart, r]);
                                toast({
                                  title: 'Success!',
                                  description: 'Flight added to cart successfully.',
                                  status: 'success',
                                  duration: 9000,
                                  isClosable: true,
                                  position: 'top'
                                });
                              }
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </Flex>
                  </Popup>
                )}

                {/* Populates map with airport locations */}
                <Marker
                  longitude={airport.coordinates[0]}
                  latitude={airport.coordinates[1]}
                  key={airport?.id}
                >
                  <Icon
                    cursor={hasFlights ? 'pointer' : 'default'}
                    as={MdLocalAirport}
                    color={
                      hasFlights ? (selectedAirport === airport ? 'red' : 'black') : 'lightgray'
                    }
                    fontSize='3em'
                    onClick={() => {
                      onAirportSelected(airport);
                    }}
                  />
                </Marker>
              </>
            );
          })
        }
        {/* Wrapper for geolocatecontrol that updates user location on map */}
        <GeolocateControl
          ref={geolocateRef}
          onGeolocate={handleGeolocate}
          fitBoundsOptions={{ maxZoom: 4 }}
        />
      </Map>
    </Box>
  );
};
