import {
  Box,
  Icon,
} from '@chakra-ui/react';
import Map, { FullscreenControl, Marker, GeolocateControl, Source, Layer, LayerProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MdLocalAirport } from 'react-icons/all';
import { airportsGeoJSON } from '../data/airportsGeoJSON';
import { useState } from 'react';

const airports = require('../data/airports.json');

export const MapPage = () => {
  const [selectedAirport, setSelectedAirport] = useState<object | undefined>();
  return (
    <Box h={'100vh'}>
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 1,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        mapboxAccessToken={'pk.eyJ1IjoiYzMzNTAxMzEiLCJhIjoiY2wwZXp1YzJoMG82MjNkcXQ5YmxsbWRtMCJ9.hoJ4MvSxn7j0J89DVLWaQw'}
      >
        {
          airportsGeoJSON.features.map((feature) => {
            return (
              <Marker longitude={feature.geometry.coordinates[0]} latitude={feature.geometry.coordinates[1]}>
                <Icon cursor={'pointer'} as={MdLocalAirport} color={selectedAirport === feature ? 'red' : 'black'} fontSize={'3em'} onClick={() => {setSelectedAirport(feature)}}/>
              </Marker>
            );
          })
        }
        <GeolocateControl />
      </Map>
    </Box>
  );
};
