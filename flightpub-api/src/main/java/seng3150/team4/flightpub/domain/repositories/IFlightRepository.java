package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seng3150.team4.flightpub.core.search.DestinationCount;
import seng3150.team4.flightpub.domain.models.Flight;

import java.util.List;

/** Repository for making CRUD transactions on the Flights database table. */
public interface IFlightRepository extends JpaRepository<Flight, Long> {

  // Find all flights that depart from the specified destination and are in the future
  @Query(
      "SELECT f FROM Flight f WHERE f.departureLocation.destinationCode = ?1 AND f.departureTime > current_date AND f.prices.size > 0 AND f.cancelled <> true ORDER BY f.departureTime")
  List<Flight> findByDestination(String destination, Pageable pageable);

  // Get the number of flights in the future that depart from each destination
  @Query(
      "SELECT new seng3150.team4.flightpub.core.search.DestinationCount(f.departureLocation.destinationCode, count(f)) FROM Flight f WHERE f.departureTime > CURRENT_DATE AND f.cancelled <> true GROUP BY f.departureLocation.destinationCode")
  List<DestinationCount> getDepartureCounts();

  // Get the top 3 flights departing from the provided destination and order by cheapest flight
  @Query(
      nativeQuery = true,
      value =
          "SELECT * from Flights inner join Price on Price.FlightId = Flights.Id "
              + "WHERE Flights.DepartureCode=?1 AND Flights.Cancelled <> 1 "
              + "GROUP BY DestinationCode "
              + "ORDER BY Price.Price "
              + "LIMIT 3")
  List<Flight> getCheapestFlightsFromDest(String destination);
}
