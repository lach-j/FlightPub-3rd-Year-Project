package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.core.email.ConfirmBookingEmailTemplate;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.domain.repositories.IPassengerRepository;

import javax.persistence.EntityNotFoundException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PassengerService implements IPassengerService {

  private final IPassengerRepository passengerRepository;
  private final IEmailSenderService emailSenderService;

  /**
   * Links the passenger to the provided booking and sends the passenger a confirmation email.
   */
  @Override
  public Passenger addPassenger(Passenger passenger, Booking booking) {
    passenger.setBooking(booking);
    Passenger savedPassenger = passengerRepository.save(passenger);
    sendEmail(savedPassenger);
    return savedPassenger;
  }

  @Override
  public void deletePassenger(Passenger passenger) {
    passengerRepository.delete(passenger);
  }

  @Override
  public List<Passenger> getPassengersForFlightBooking(long bookingId) {
    var passengers = passengerRepository.findByFlightBookingId(bookingId);
    if (passengers.isEmpty())
      throw new EntityNotFoundException(
          String.format("No passengers for booking with id %s found", bookingId));

    return passengers;
  }

  private void sendEmail(Passenger p) {

    var booking = p.getBooking();
    var bookingUser = booking.getUser();

    var flights = booking.getFlights();

    StringBuilder flightString =
        new StringBuilder(
            String.format(
                "Booking made by %s:",
                (bookingUser.getFirstName() + " " + bookingUser.getLastName())));
    int x = 1;

    if (!flights.isEmpty()) {
      // Builds a html string of flight data to be added to the confirmation email.
      for (Flight f : flights) {
        String depLoc = f.getDepartureLocation().getAirport();
        String depTime = f.getDepartureTime().format(DateTimeFormatter.ISO_DATE_TIME);
        String arrLoc = f.getArrivalLocation().getAirport();
        String arrTime = f.getArrivalTime().format(DateTimeFormatter.ISO_DATE_TIME);
        flightString
            .append("<hr>")
            .append("Flight ")
            .append(x)
            .append(": Departing from ")
            .append(depLoc)
            .append(" at ")
            .append(depTime)
            .append(", arriving at ")
            .append(arrLoc)
            .append(" at ")
            .append(arrTime);
        x++;
      }
    }

    var bookingTemplate = new ConfirmBookingEmailTemplate();
    bookingTemplate.setFirstName(p.getFirstName());
    bookingTemplate.setBookingDetails(flightString.toString());

    emailSenderService.sendTemplateEmail(new Email(p.getEmail()), bookingTemplate);
  }
}
