package seng3150.team4.flightpub.domain.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import seng3150.team4.flightpub.domain.models.CanceledFlights;

/** Repository for making CRUD transactions on the canceled flights database table. */
public interface ICanceledRepository extends JpaRepository<CanceledFlights, String> {}
