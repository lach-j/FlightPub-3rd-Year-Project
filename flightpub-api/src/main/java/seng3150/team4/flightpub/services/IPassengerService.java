package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Passenger;

import java.util.List;

public interface IPassengerService {
  Passenger addPassenger(Passenger passenger, Booking booking);

  void deletePassenger(Passenger passenger);

  List<Passenger> getPassengersForFlightBooking(long bookingId);
}
