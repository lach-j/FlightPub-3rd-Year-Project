import { Price } from '../models';

export const getMinMaxPriceString = (prices: Price[]) => {
  if (!prices) return '';
  let pricesVals = prices.map(p => p.price);
  let minPrice = Math.min(...pricesVals);
  let maxPrice = Math.max(...pricesVals);
  return `$${minPrice}${maxPrice !== minPrice && ` - $${maxPrice}`}`;
};

export const convertMinsToHM = (minutes: number) => {
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return (hours + ' hrs ' + minutes + ' mins');
};