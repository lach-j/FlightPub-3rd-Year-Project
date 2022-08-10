import { Flight } from './Flight';
import { Passenger } from './Passenger';
import { User } from './User';

export interface Booking {
  id: number;
  dateBooked: Date;
  user: User;
  flights: Flight[];
  passengers: Passenger[];
}
