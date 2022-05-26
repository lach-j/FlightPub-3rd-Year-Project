package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.FlightId;

import java.util.List;

public interface IFlightRepository extends CrudRepository<Flight, FlightId> {

    //TODO: Pass users departure location
    @Query(nativeQuery = true, value = "SELECT * from flights inner join price on price.flightId = flights.id " +
            "WHERE flights.departureCode=?1 " +
            "GROUP BY DestinationCode " +
            "ORDER BY price.price " +
            "LIMIT 3")
    List<Flight> getCheapestFlightsFromDest(String destination);
}
