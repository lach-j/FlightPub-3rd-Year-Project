package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.DestinationCount;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.FlightId;

import java.util.List;

public interface IFlightRepository extends CrudRepository<Flight, FlightId> {

  @Query(
      "SELECT f FROM Flight f WHERE f.departureLocation.destinationCode = ?1 AND f.departureTime > current_date AND f.prices.size > 0 ORDER BY f.departureTime")
  List<Flight> findByDestination(String destination, Pageable pageable);

  @Query(
      "SELECT new seng3150.team4.flightpub.domain.models.DestinationCount(f.departureLocation.destinationCode, count(f)) FROM Flight f WHERE f.departureTime > CURRENT_DATE GROUP BY f.departureLocation.destinationCode")
  List<DestinationCount> getDepartureCounts();

  @Query(
      nativeQuery = true,
      value =
          "SELECT * from flights inner join price on price.flightId = flights.id "
              + "WHERE flights.departureCode=?1 "
              + "GROUP BY DestinationCode "
              + "ORDER BY price.price "
              + "LIMIT 3")
  List<Flight> getCheapestFlightsFromDest(String destination);
}
