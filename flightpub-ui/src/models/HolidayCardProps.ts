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
}
export interface HolidayPackage {
  isPopular: boolean;
  imageURL: string;
  packageName: string;
  packageDescription: string;
  packageTagline: string;
  packageNights: number;
  location: string;
  price: number;
}

export interface FeatureBadgeProps {
  tagName: string;
  tagColor: string;
}
