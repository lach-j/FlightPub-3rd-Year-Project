package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seng3150.team4.flightpub.domain.models.Passenger;

import java.util.List;
import java.util.Optional;

public interface IPassengerRepository extends JpaRepository<Passenger, Long> {
    @Query("SELECT p FROM Passenger p WHERE p.bookingId=?1")
    Optional<List<Passenger>> findByFlightBookingId(long bookingId);
}
