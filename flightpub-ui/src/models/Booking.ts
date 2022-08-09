import { Passenger } from "./Passenger";

export interface Booking {
  userId: any;
  flightIds: number[];
  passengers: Passenger[];
}
