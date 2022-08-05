package seng3150.team4.flightpub.domain.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seng3150.team4.flightpub.domain.models.Destination;

import java.util.Optional;

/** Repository for making CRUD transactions on the Airline database table. */
public interface IDestinationRepository extends JpaRepository<Destination, String> {
}
