package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Airline;

public interface IAirlineRepository extends CrudRepository<Airline, String> {
}