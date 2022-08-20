import { Airline } from './Airline';
import { Destination } from './Destination';
import { Price } from './Price';

export interface Flight {
  id: number;
  airline: Airline;
  flightNumber: string;
  departureTime: string;
  departureLocation: Destination;
  arrivalLocation: Destination;
  arrivalTime: string;
  stopOverLocation: Destination;
  arrivalTimeStopOver: string;
  departureTimeStopOver: string;
  prices: Price[];
  duration: number;
  cancelled?: boolean;
}
