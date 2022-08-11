package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Passenger;

import java.util.List;
import java.util.Optional;

public interface IPassengerService {
    Passenger addPassenger(Passenger passenger, long bookingId);

    void deletePassenger(Passenger passenger);

    Optional<List<Passenger>> getPassengersForFlightBooking(long bookingId);
}
