import { TicketClass } from './Passenger';

export interface Price {
  ticketClass: TicketClass;
  price: number;
  priceLeg1?: number;
  priceLeg2?: number;
}
