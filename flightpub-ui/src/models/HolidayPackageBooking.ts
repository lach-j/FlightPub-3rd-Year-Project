import { HolidayPackage } from './HolidayCardProps';
import { User } from './User';
import { Booking } from './Booking';
import { PaymentType } from './SavedPaymentTypes';

export interface HolidayPackageBooking {
  id: number;
  user: User;
  dateBooked: Date;
  payment: PaymentType;
  booking: Booking;
  holidayPackage: HolidayPackage;
}
