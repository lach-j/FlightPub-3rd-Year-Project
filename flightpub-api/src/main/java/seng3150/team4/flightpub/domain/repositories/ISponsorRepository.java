package seng3150.team4.flightpub.domain.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import seng3150.team4.flightpub.domain.models.SponsoredAirlines;

/** Repository for making CRUD transactions on the covid destinations database table. */
public interface ISponsorRepository extends JpaRepository<SponsoredAirlines, Long> {}
