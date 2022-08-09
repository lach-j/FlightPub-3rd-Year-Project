package seng3150.team4.flightpub.services;

import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.core.email.ConfirmBookingEmailTemplate;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.domain.repositories.IBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;
import seng3150.team4.flightpub.domain.repositories.IPassengerRepository;
import seng3150.team4.flightpub.domain.repositories.IUserRepository;

import javax.persistence.EntityNotFoundException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PassengerService implements IPassengerService{

    private final IPassengerRepository passengerRepository;

    private final IBookingRepository bookingRepository;

    private final IUserRepository userRepository;

    private final IEmailSenderService emailSenderService;

    @Override
    public Passenger addPassenger(Passenger passenger, long bookingId) {
        passenger.setBookingId(bookingId);
        Passenger savedPassenger = passengerRepository.save(passenger);
        sendEmail(savedPassenger);
        return savedPassenger;
    }

    @Override
    public void deletePassenger(Passenger passenger) {
        passengerRepository.delete(passenger);
    }

    @Override
    public Optional<List<Passenger>> getPassengersForFlightBooking(long bookingId) {
        var passengers = passengerRepository.findByFlightBookingId(bookingId);
        if(passengers.isEmpty())
            throw new EntityNotFoundException(
                    String.format("No passengers for booking with id %s found", bookingId));

        return passengers;
    }

    private void sendEmail(Passenger p) {

        var booking = bookingRepository.getById(p.getBookingId());
        var flights = booking.getFlights();

//        var bookinguser = userRepository.getById(booking.getUserId());

        String flightString = String.format("Booking made by %s %s:", "Keenan", "Groves");
        int x = 1;

        for(Flight f: flights) {
            flightString = flightString
                    + "\n"
                    + String.format("Flight %s: Departing from %s at %s, arriving at %s at %s",
                        x,
                        f.getDepartureLocation().getAirport(),
                        f.getDepartureTime().format(DateTimeFormatter.ISO_DATE_TIME),
                        f.getArrivalLocation().getAirport(),
                        f.getArrivalTime().format(DateTimeFormatter.ISO_DATE_TIME));
            x++;
        }

        var bookingTemplate = new ConfirmBookingEmailTemplate();
        bookingTemplate.setFirstName(p.getFname());
        bookingTemplate.setBookingDetails(flightString);

        emailSenderService.sendTemplateEmail(new Email(p.getEmail()), bookingTemplate);
    }
}
