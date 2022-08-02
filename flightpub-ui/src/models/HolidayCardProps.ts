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

export interface FeatureBadgeProps {
  tagName: string;
  tagColor: string;
}
