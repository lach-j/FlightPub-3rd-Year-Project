import { Flight } from './Flight';

export interface SearchResult {
  flight: Flight;
  tags?: string[];
}
