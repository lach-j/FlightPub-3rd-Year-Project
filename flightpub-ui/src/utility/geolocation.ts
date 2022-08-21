import { airports } from '../data/airports';

export type Position = [number, number];

export interface Airport {
  coordinates: Position;
  id: number;
  name: string;
  city: string;
  country: string;
  code: string;
  tags: Array<string>;
}

export const findNearestAirport = (location: Position): Airport | undefined => {
  if (!location) return;
  let nearest = airports[0];
  let distance = calculateDistance(location, airports[0].coordinates);
  airports.slice(1).forEach((airport) => {
    let tempDist = calculateDistance(location, airport.coordinates);
    if (tempDist < distance) {
      distance = tempDist;
      nearest = airport;
    }
  });
  return nearest;
};

export const calculateDistance = (point1: number[], point2: number[]) => {
  return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
};
