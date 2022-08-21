package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;
import seng3150.team4.flightpub.domain.models.Payment;

import java.util.List;

public interface IHolidayPackageBookingService {
  HolidayPackageBooking makeHolidayPackageBooking(
      long holidayPackageId, long userId, Payment payment, Booking booking);

  void deleteHolidayPackageBooking(HolidayPackageBooking booking);

  List<HolidayPackageBooking> getPackageBookingsByUserId(long userId);
}
