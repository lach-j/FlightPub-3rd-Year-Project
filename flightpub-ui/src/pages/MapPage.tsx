import {
  Box,
  Icon,
} from '@chakra-ui/react';
import Map, { FullscreenControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MdLocalAirport } from 'react-icons/all';

const airports = require('../data/airports.json');

export const MapPage = () => {
  return (
    <Box h={'100vh'}>
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 16,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        mapboxAccessToken={'pk.eyJ1IjoiYzMzNTAxMzEiLCJhIjoiY2wwZXp1YzJoMG82MjNkcXQ5YmxsbWRtMCJ9.hoJ4MvSxn7j0J89DVLWaQw'}
      >
        {airports.map((airport: any) => {
            return (
              <Marker longitude={airport._geoloc.lng} latitude={airport._geoloc.lat}>
                <Icon as={MdLocalAirport} boxSize={10} />
              </Marker>);
          },
        )
        }
        <FullscreenControl />
      </Map>
    </Box>
  );
};
