package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.Passenger;

import java.util.List;

public interface IBookingRepository extends JpaRepository<Booking, Long> {
  @Query("SELECT b FROM Booking b WHERE b.user.id = ?1")
  List<Booking> findByUserId(long userId);

  @Query(
      nativeQuery = true,
      value =
          "SELECT f.Id FROM Flights f WHERE f.Id IN (SELECT bf.flightId FROM BookFlight bf WHERE bf.bookingid = ?1)")
  List<Long> getBookingFlights(long bookingId);

  @Query(
      "SELECT p FROM Booking b JOIN b.flights f join b.passengers p WHERE f = ?1 AND f.departureTime > current_date")
  List<Passenger> getPassengersWithFlightBookings(Flight f);
}
