package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Booking;

public interface IBookingRepository extend CrudRepository<Booking, Long>{
    @Query("SELECT * FROM Booking b WHERE b.userId = ?1")
    public Optional<List<Booking>> findByUserId(long userId);
}