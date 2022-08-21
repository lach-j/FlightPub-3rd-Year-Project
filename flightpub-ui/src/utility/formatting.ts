import { Price } from '../models';
//returns pricerange of flights as string
export const getMinMaxPriceString = (prices: Price[]) => {
  if (!prices) return '';
  let pricesVals = prices.map((p) => p.price);
  let minPrice = Math.min(...pricesVals);
  let maxPrice = Math.max(...pricesVals);
  return `$${minPrice}${maxPrice !== minPrice && ` - $${maxPrice}`}`;
};
//converts flight duration from minutes to hour:minute format as string
export const convertMinsToHM = (minutes: number) => {
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return hours + ' hrs ' + minutes + ' mins';
};
//Formats datetime to en-AU locality in 24hour format
export const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString('en-AU', {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: false
  });
