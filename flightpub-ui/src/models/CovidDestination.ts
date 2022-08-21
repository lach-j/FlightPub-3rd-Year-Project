import { Destination } from './Destination';

export interface CovidDestination {
  id: number;
  covidStartDate: string;
  covidEndDate: string;
  destination: Destination;
}
