package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.domain.repositories.IBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;
import seng3150.team4.flightpub.domain.repositories.IPassengerRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PassengerService implements IPassengerService{

    private final IPassengerRepository passengerRepository;

    @Override
    public Passenger addPassenger(Passenger passenger, long bookingId) {
        passenger.setBookingId(bookingId);
        Passenger savedPassenger = passengerRepository.save(passenger);
        return savedPassenger;
    }

    @Override
    public void deletePassenger(Passenger passenger) {
        passengerRepository.delete(passenger);
    }

    @Override
    public Optional<List<Passenger>> getPassengersForFlightBooking(long bookingId) {
        var passengers = passengerRepository.findByFlightBookingId(bookingId);
        if(passengers.isEmpty())
            throw new EntityNotFoundException(
                    String.format("No passengers for booking with id %s found", bookingId));

        return passengers;
    }
}
