package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.FlightId;

public interface IFlightRepository extends CrudRepository<Flight, FlightId> {
}
