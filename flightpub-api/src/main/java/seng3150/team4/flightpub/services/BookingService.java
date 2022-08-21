package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Payment;
import seng3150.team4.flightpub.domain.repositories.IBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

  private final IBookingRepository bookingRepository;
  private final IFlightRepository flightRepository;
  private final IUserService userService;

  @Override
  public Booking makeBooking(Set<Long> flightIds, long userId, Payment payment) {
    var booking = new Booking();
    booking.setDateBooked(LocalDateTime.now(ZoneOffset.UTC));

    var user = userService.getUserByIdSecure(userId);
    booking.setUser(user);
    booking.setPayment(payment);

    var flights = new HashSet<>(flightRepository.findAllById(flightIds));

    booking.setFlights(flights);
    return bookingRepository.save(booking);
  }

  @Override
  public void deleteBooking(Booking booking) {
    bookingRepository.delete(booking);
  }

  @Override
  public Booking getBookingById(long bookingId) {
    var booking = bookingRepository.findById(bookingId);
    if (booking.isEmpty())
      throw new EntityNotFoundException(String.format("Booking with id %s not found", bookingId));

    return booking.get();
  }

  @Override
  public List<Booking> getBookingsByUserId(long userId) {
    var bookings = bookingRepository.findByUserId(userId);
    if (bookings.isEmpty())
      throw new EntityNotFoundException(
          String.format("No bookings for user with id %s found", userId));

    return bookings;
  }
}
