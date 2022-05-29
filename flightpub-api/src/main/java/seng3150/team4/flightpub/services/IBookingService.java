package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Booking;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IBookingService {
  Booking makeBooking(Booking booking, Set<Long> flightIds);

  void deleteBooking(Booking booking);

  Booking getBookingById(long bookingId);

  Optional<List<Booking>> getBookingsByUserId(long userId);
}
