package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.BookingRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.security.CurrentUserContext;
import seng3150.team4.flightpub.services.IBookingService;
import seng3150.team4.flightpub.services.IPassengerService;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class BookingController {

  private final IBookingService bookingService;
  private final IPassengerService passengerService;
  private final CurrentUserContext currentUserContext;

  @Authorized
  @PostMapping(path = "/book")
  public ResponseEntity<? extends Response> makeBooking(
      @RequestBody BookingRequest bookingRequest) {

    var userId = currentUserContext.getCurrentUserId();
    bookingRequest.validate();

    var savedBooking =
        bookingService.makeBooking(bookingRequest.getFlightIds(), userId);

    var passengers = bookingRequest.getPassengers();

    for(Passenger p: passengers) {
        passengerService.addPassenger(p, savedBooking);
    }

    return ResponseEntity.ok().body(new EntityResponse<>(savedBooking));
  }

  @Authorized
  @GetMapping("/bookings")
  public EntityCollectionResponse<Booking> getAllBookingForUser() {

    var userId = currentUserContext.getCurrentUserId();

    var bookings = bookingService.getBookingsByUserId(userId);

    return new EntityCollectionResponse<>(bookings);
  }
}
