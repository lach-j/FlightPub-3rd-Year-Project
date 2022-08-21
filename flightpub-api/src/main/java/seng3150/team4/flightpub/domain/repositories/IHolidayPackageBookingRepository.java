package seng3150.team4.flightpub.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;

import java.util.List;

public interface IHolidayPackageBookingRepository
    extends JpaRepository<HolidayPackageBooking, Long> {
  @Query("SELECT b FROM HolidayPackageBooking b WHERE b.user.id = ?1")
  List<HolidayPackageBooking> findByUserId(long userId);
}
