package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.repositories.IBookingRepository;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;

import javax.persistence.EntityNotFoundException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

    private final IBookingRepository bookingRepository;
    private final IFlightRepository flightRepository;

    @Override
    public Booking makeBooking(Booking booking, Set<Long> flightIds) {
        var flights = new HashSet<Flight>();
        flightRepository.findAllById(flightIds).forEach(flights::add);
        booking.setFlights(flights);
        Booking savedBooking = bookingRepository.save(booking);
        return savedBooking;
    }

    @Override
    public void deleteBooking(Booking booking) {
        bookingRepository.delete(booking);
    }

    @Override
    public Booking getBookingById(long bookingId) {
        var booking = bookingRepository.findById(bookingId);
        if (booking.isEmpty()) throw new EntityNotFoundException(String.format("Booking with id %s not found", bookingId));

        return booking.get();
    }

    @Override
    public Optional<List<Booking>> getBookingsByUserId(long userId){
        var bookings = bookingRepository.findByUserId(userId);
        if (bookings.isEmpty()) throw new EntityNotFoundException(String.format("No bookings for user with id %s found", userId));

        return bookings;
    }

}