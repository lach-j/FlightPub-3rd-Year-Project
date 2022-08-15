package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;

import java.util.List;
import java.util.Optional;

public interface IHolidayPackageBookingRepository extends JpaRepository<HolidayPackageBooking, Long> {
    @Query("SELECT b FROM HolidayPackageBooking b WHERE b.user.id = ?1")
    List<Booking> findByUserId(long userId);
}