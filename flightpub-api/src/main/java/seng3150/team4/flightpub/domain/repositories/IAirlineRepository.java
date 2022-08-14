package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import seng3150.team4.flightpub.domain.models.Airline;

/** Repository for making CRUD transactions on the Airline database table. */
public interface IAirlineRepository extends JpaRepository<Airline, String> {}
