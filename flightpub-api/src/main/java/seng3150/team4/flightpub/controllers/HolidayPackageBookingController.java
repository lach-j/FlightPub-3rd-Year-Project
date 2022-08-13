package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.BookingRequest;
import seng3150.team4.flightpub.controllers.requests.HolidayPackageBookingRequest;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.Booking;
import seng3150.team4.flightpub.domain.models.HolidayPackageBooking;
import seng3150.team4.flightpub.domain.models.Passenger;
import seng3150.team4.flightpub.services.IBookingService;
import seng3150.team4.flightpub.services.IHolidayPackageBookingService;
import seng3150.team4.flightpub.services.IPassengerService;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class HolidayPackageBookingController {

    private final IHolidayPackageBookingService holidayPackageBookingService;
    private final IBookingService bookingService;
    private final IPassengerService passengerService;

    @PostMapping(path = "/bookHolidayPackage")
    public ResponseEntity<? extends Response> makeBooking(
            @RequestBody HolidayPackageBookingRequest holidayPackageBookingRequest) {

        holidayPackageBookingRequest.validate();

        var booking = bookingFromRequest(holidayPackageBookingRequest);

        var savedFlightBooking = bookingService.makeBookingFromHolidayPackage(booking, holidayPackageBookingRequest.getFlightIds());

        var passengers = holidayPackageBookingRequest.getPassengers();

        var bookingId = savedFlightBooking.getId();

        for(Passenger p: passengers) {
            passengerService.addPassenger(p, bookingId);
        }

        var savedBooking = holidayPackageBookingService.makeHolidayPackageBooking(booking, bookingId);

        return ResponseEntity.ok().body(new EntityResponse<>(savedBooking));
    }

    private static HolidayPackageBooking bookingFromRequest(HolidayPackageBookingRequest request) {
        HolidayPackageBooking holidayPackageBooking = new HolidayPackageBooking();

        holidayPackageBooking.setUserId(request.getUserId());
        holidayPackageBooking.setHolidayPackage(request.getHolidayPackage());
        holidayPackageBooking.setDateBooked(LocalDateTime.now());

        return holidayPackageBooking;
    }
}
