package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.repositories.IBookingRepository;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

    private final IBookingRepository bookingRepository;

    @Override
    public Booking makeBooking(Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        return savedBooking;
    }

    @Override
    public void deleteBooking(Booking booking) {
        bookingRepository.delete(Booking);
    }

    @Override
    public Booking getBookingById(long bookingId) {
        var booking = bookingRepository.findById(bookingId);
        if (booking.isEmpty()) throw new EntityNotFoundException(String.format("Booking with id %s not found", bookingId));

        return booking.get();
    }

    @Override
    public List<Booking> getBookingsByUserId(long userId){
        var bookings = bookingRepository.findByUserId(userId);
        if (bookings.isEmpty()) throw new EntityNotFoundException(String.format("No bookings for user with id %s found", userId));

        return bookings.get();
    }

}