package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;
import seng3150.team4.flightpub.domain.models.Payment;
import seng3150.team4.flightpub.domain.repositories.IBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IHolidayPackageBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IHolidayPackageRepository;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HolidayPackageBookingService implements IHolidayPackageBookingService {

  private final IBookingRepository bookingRepository;
  private final IHolidayPackageRepository holidayPackageRepository;
  private final IUserService userService;
  private final IHolidayPackageBookingRepository holidayPackageBookingRepository;

  @Override
  public HolidayPackageBooking makeHolidayPackageBooking(
      long holidayPackageId, long userId, Payment payment, Booking booking) {
    var holidayPackageBooking = new HolidayPackageBooking();
    holidayPackageBooking.setDateBooked(LocalDateTime.now(ZoneOffset.UTC));

    var user = userService.getUserByIdSecure(userId);
    holidayPackageBooking.setUser(user);
    holidayPackageBooking.setPayment(payment);
    holidayPackageBooking.setBooking(booking);
    var holpackage = holidayPackageRepository.findById(holidayPackageId).orElse(null);
    holidayPackageBooking.setHolidayPackage(holpackage);
    return holidayPackageBookingRepository.save(holidayPackageBooking);
  }

  @Override
  public void deleteHolidayPackageBooking(HolidayPackageBooking holidayPackageBooking) {
    holidayPackageBookingRepository.delete(holidayPackageBooking);
  }

  @Override
  public List<HolidayPackageBooking> getPackageBookingsByUserId(long userId) {
    var bookings = holidayPackageBookingRepository.findByUserId(userId);
    if (bookings.isEmpty())
      throw new EntityNotFoundException(
          String.format("No bookings for user with id %s found", userId));

    return bookings;
  }
}
