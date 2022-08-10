package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Flight;

import java.util.List;
import java.util.Optional;

public interface IBookingRepository extends JpaRepository<Booking, Long> {
  @Query("SELECT b FROM Booking b WHERE b.userId = ?1")
  Optional<List<Booking>> findByUserId(long userId);

  @Query(nativeQuery = true, value="SELECT f.Id FROM Flights f WHERE f.Id IN (SELECT bf.flightId FROM BookFlight bf WHERE bf.bookingid = ?1)")
  Optional<List<Long>> getBookingFlights(long bookingId);
}
