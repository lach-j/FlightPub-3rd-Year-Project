import { Airline } from './Airline';

export interface SponsoredAirline {
  id: number;
  startDate: string;
  endDate: string;
  airline: Airline;
}
