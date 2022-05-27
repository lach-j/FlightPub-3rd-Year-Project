package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.domain.models.Booking;

public interface IBookingService {
    Booking makeBooking(Booking booking);
    void deleteBooking(Booking booking);
    Booking getBookingById(long bookingId);
    List<Booking> getBookingsByUserId(long userId);
}