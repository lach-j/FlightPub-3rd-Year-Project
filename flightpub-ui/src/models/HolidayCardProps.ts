import { Flight } from './Flight';

export interface HolidayCardProps {
  isPopular: boolean;
  imageURL: string;
  name: string;
  description: string;
  tagline: string;
  price: number;
  nights: number;
  location: string;
  tags: Array<FeatureBadgeProps>;
  arrivalLocation: string;
}
export interface HolidayPackage {
  id: number;
  isPopular: boolean;
  imageURL: string;
  packageName: string;
  packageDescription: string;
  packageTagline: string;
  packageNights: number;
  location: string;
  price: number;
  arrivalLocation: string;
  accommodation: string;
  flights: Array<Flight>;
}

export interface FeatureBadgeProps {
  tagName: string;
  tagColor: string;
}
