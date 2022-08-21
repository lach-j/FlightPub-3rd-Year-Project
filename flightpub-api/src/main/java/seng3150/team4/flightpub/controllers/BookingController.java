package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.BookingRequest;
import seng3150.team4.flightpub.controllers.requests.PassengerDTO;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.domain.models.SavedPayment;
import seng3150.team4.flightpub.domain.repositories.ITicketClassRepository;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.security.CurrentUserContext;
import seng3150.team4.flightpub.services.IBookingService;
import seng3150.team4.flightpub.services.IPassengerService;
import seng3150.team4.flightpub.services.IUserService;
import seng3150.team4.flightpub.services.PaymentService;

import java.util.HashSet;

@RestController
@RequiredArgsConstructor
public class BookingController {

  private final IBookingService bookingService;
  private final IPassengerService passengerService;
  private final PaymentService paymentService;
  private final CurrentUserContext currentUserContext;
  private final ITicketClassRepository ticketClassRepository;
  private final IUserService userService;

  @Authorized
  @PostMapping(path = "/book")
  public ResponseEntity<? extends Response> makeBooking(
      @RequestBody BookingRequest bookingRequest) {

    var userId = currentUserContext.getCurrentUserId();
    bookingRequest.validate();

    var payment = paymentService.addPayment(bookingRequest.getPayment());

    // If the "Save payment" toggle is selected, add the bookings payment to the users saved payments.
    if (bookingRequest.isSavePayment()) {
      var savedPayment = new SavedPayment();

      // Default nickname is PAYMENTTYPE-ID
      savedPayment.setNickname(
          String.format("%s-%d", payment.getType().toString(), payment.getId()));
      savedPayment.setPayment(payment);
      userService.addNewPayment(userId, savedPayment);
    }

    var savedBooking = bookingService.makeBooking(bookingRequest.getFlightIds(), userId, payment);

    var passengers = bookingRequest.getPassengers();

    var passengerSet = new HashSet<Passenger>();

    for (PassengerDTO p : passengers) {
      var newPassenger = new Passenger();
      newPassenger.setEmail(p.getEmail());
      newPassenger.setFirstName(p.getFirstName());
      newPassenger.setLastName(p.getLastName());

      var ticketClass = ticketClassRepository.findById(p.getTicketClass());
      ticketClass.ifPresent(newPassenger::setTicketClass);

      passengerSet.add(passengerService.addPassenger(newPassenger, savedBooking));
    }

    // Add the new passengers so that the record does not have to be queried again in order to
    // return the results.
    // Otherwise, the passenger list would be null.
    savedBooking.setPassengers(passengerSet);

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
