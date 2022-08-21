package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.HolidayPackageBookingRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.security.CurrentUserContext;
import seng3150.team4.flightpub.services.IBookingService;
import seng3150.team4.flightpub.services.IHolidayPackageBookingService;
import seng3150.team4.flightpub.services.IPassengerService;
import seng3150.team4.flightpub.services.PaymentService;

@RestController
@RequiredArgsConstructor
public class HolidayPackageBookingController {

  private final IHolidayPackageBookingService holidayPackageBookingService;
  private final IBookingService bookingService;
  private final IPassengerService passengerService;
  private final PaymentService paymentService;
  private final CurrentUserContext currentUserContext;

  @Authorized
  @PostMapping(path = "/bookHolidayPackage")
  public ResponseEntity<? extends Response> makeBooking(
      @RequestBody HolidayPackageBookingRequest holidayPackageBookingRequest) {

    var userId = currentUserContext.getCurrentUserId();

    holidayPackageBookingRequest.validate();

    var payment = paymentService.addPayment(holidayPackageBookingRequest.getPayment());

    var savedFlightBooking =
        bookingService.makeBooking(holidayPackageBookingRequest.getFlightIds(), userId, payment);

    var passengers = holidayPackageBookingRequest.getPassengers();

    for (Passenger p : passengers) {
      passengerService.addPassenger(p, savedFlightBooking);
    }

    var holidayPackageSavedBooking =
        holidayPackageBookingService.makeHolidayPackageBooking(
            holidayPackageBookingRequest.getHolidayPackageId(),
            userId,
            payment,
            savedFlightBooking);

    return ResponseEntity.ok().body(new EntityResponse<>(holidayPackageSavedBooking));
  }

  @Authorized
  @GetMapping("/packageBookings")
  public EntityCollectionResponse<HolidayPackageBooking> getAllHolidayPackageBookingForUser() {

    var userId = currentUserContext.getCurrentUserId();

    var bookings = holidayPackageBookingService.getPackageBookingsByUserId(userId);

    return new EntityCollectionResponse<>(bookings);
  }
}
