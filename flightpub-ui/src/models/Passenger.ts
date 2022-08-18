export interface PassengerDTO {
  firstName: string;
  lastName: string;
  email: string;
  ticketClass?: string;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  ticketClass: TicketClass;
}

export interface TicketClass {
  classCode: ClassCode;
  details: string;
}

export enum ClassCode {
  Business = 'BUS',
  Economy = 'ECO',
  FirstClass = 'FIR',
  PremiumEconomy = 'PME'
}
