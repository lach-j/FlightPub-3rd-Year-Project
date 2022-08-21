package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Payment;

import java.util.List;
import java.util.Set;

public interface IBookingService {
  Booking makeBooking(Set<Long> flightIds, long userId, Payment payment);

  void deleteBooking(Booking booking);

  Booking getBookingById(long bookingId);

  List<Booking> getBookingsByUserId(long userId);
}
