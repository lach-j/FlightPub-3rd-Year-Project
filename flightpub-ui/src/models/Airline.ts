import { SponsoredAirline } from './SponsoredAirline';

export interface Airline {
  airlineCode: string;
  airlineName: string;
  countryCode: string;
  sponsorships?: SponsoredAirline[];
}
