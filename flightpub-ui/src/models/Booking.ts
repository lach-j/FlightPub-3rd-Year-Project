import { Flight } from './Flight';
import { Passenger } from './Passenger';
import { PaymentType } from './SavedPaymentTypes';
import { User } from './User';

export interface Booking {
  id?: number;
  dateBooked: Date;
  user: User;
  flights: Flight[];
  passengers: Passenger[];
  payment: PaymentType;
}
