import { Box, Button, Flex, Heading, Icon, Stat, StatHelpText, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import Map, { GeolocateControl, GeolocateControlRef, Marker, Popup } from 'react-map-gl';
import { useTable } from 'react-table';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MdLocalAirport } from 'react-icons/all';
import { airportsGeoJSON } from '../data/airportsGeoJSON';
import { flights } from '../data/flights';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const flightColumns = [
  { Header: 'Destination', accessor: 'ArrivalCode' },
  { Header: 'Departure Time', accessor: 'DepartureTime' },
  { Header: 'Price', accessor: 'Price', Cell: (props: any) => `$${props.value.toFixed(2)}` },
  // {Header: 'Destination', accessor: 'ArrivalCode'},
  // {Header: 'Destination', accessor: 'ArrivalCode'},
];


export const MapPage = () => {
  const [selectedAirport, setSelectedAirport] = useState<GeoJSON.Feature<GeoJSON.Geometry> | undefined>();
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
    let flight = flights.find(f => f.DepartureCode === departureCode && f.ArrivalCode === arrivalCode);
    if (!flight) return;
    return {
      ...flight,
      DepartureTime: new Date(flight?.DepartureTime).toLocaleString('en-AU', {
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
      return flight.DepartureCode === selected?.properties?.code;
    }).sort(
      (a, b) => a.DepartureTime > b.DepartureTime ? 1 : -1).map((f) => {
      return {
        ...f,
        DepartureTime: new Date(f.DepartureTime).toLocaleString('en-AU', {
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
    <Box h={'100vh'} display={'flex'}>
      <Box w={'30em'} p={'1em'}>
        <Heading
          fontSize={'1.5em'}>{selectedAirport ? `Flights from ${selectedAirport?.properties?.name} (${selectedAirport?.properties?.code})` : 'Select an airport to view flights'}</Heading>
        <Table columns={flightColumns} data={flightsFromHere} />
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
                      <StatNumber>{`$${flight?.Price.toFixed(2)}`}</StatNumber>

                      <StatHelpText>{flight?.StopOverCode ? '1 Stopover' : 'Direct'}
                        {flight.StopOverCode &&
                          <Text textDecoration={'underline'} textDecorationStyle={'dashed'}
                                title={flight.StopOverAirport || undefined}>
                            {`(${flight.StopOverCode})`}
                          </Text>
                        }</StatHelpText>

                    </Stat>
                    <Box ml='3'>
                      <Text fontWeight='bold' fontSize={'md'}>
                        {flight?.DestinationAirport}
                      </Text>
                      <Text fontSize='sm'>{flight?.AirlineName}</Text>
                      <Button colorScheme={'red'} size={'sm'} onClick={() => navigate('/book?' + getUrlParams(flight))}>Book
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

const Table = ({ columns, data }: { columns: Array<{ Header: string, accessor: string }>, data: any }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
            })}
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};
