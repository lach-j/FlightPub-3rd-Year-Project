package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Booking;

import java.util.List;
import java.util.Optional;

public interface IBookingRepository extends CrudRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b WHERE b.userId = ?1")
    public Optional<List<Booking>> findByUserId(long userId);
}