package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.services.IBookingService;
import seng3150.team4.flightpub.controllers.requests.BookingRequest;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final IBookingService bookingService;

    @PostMapping(path = "/book")
    public ResponseEntity<? extends Response> makeBooking(@RequestBody BookingRequest bookingRequest) {

        bookingRequest.validate();

        var booking = bookingFromRequest(bookingRequest);

        var savedBooking = bookingService.makeBooking(booking);

        return ResponseEntity.ok().body(new EntityResponse<>(savedBooking));
    }

    private static Booking bookingFromRequest(BookingRequest request) {
        Booking booking = new Booking();

        booking.setUserId(request.getUserId());
        booking.setFlightIds(request.getFlightIds());
        booking.setDateBooked(LocalDateTime.now());

        return booking;
    }
}