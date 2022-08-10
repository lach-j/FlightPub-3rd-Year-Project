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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PassengerService implements IPassengerService{

    private final IPassengerRepository passengerRepository;

    private final IBookingRepository bookingRepository;

    private final IFlightRepository flightRepository;

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

//        var bookinguser = userRepository.getById(booking.getUserId());

        var flightIds = bookingRepository.getBookingFlights(p.getBookingId());
        Set<Long> flightsIdSet = new HashSet<>(flightIds.get());
        var flights = new HashSet<Flight>();
        flightRepository.findAllById(flightsIdSet).forEach(flights:: add);

        String flightString = String.format("Booking made by %s %s:", "Keenan", "Groves");
        int x = 1;

        if (!flights.isEmpty()) {
            for (Flight f : flights) {
                String depLoc = f.getDepartureLocation().getAirport();
                String depTime = f.getDepartureTime().format(DateTimeFormatter.ISO_DATE_TIME);
                String arrLoc = f.getArrivalLocation().getAirport();
                String arrTime = f.getArrivalTime().format(DateTimeFormatter.ISO_DATE_TIME);
                flightString = flightString
                        + "<hr>"
                        + "Flight "
                        + x + ": Departing from "
                        + depLoc + " at "
                        + depTime + ", arriving at "
                        + arrLoc + " at "
                        + arrTime;
                x++;
            }
        }

        var bookingTemplate = new ConfirmBookingEmailTemplate();
        bookingTemplate.setFirstName(p.getFname());
        bookingTemplate.setBookingDetails(flightString);

        emailSenderService.sendTemplateEmail(new Email(p.getEmail()), bookingTemplate);
    }
}
