package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.BookingRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.Airline;
import seng3150.team4.flightpub.domain.models.Destination;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.repositories.IAirlineRepository;
import seng3150.team4.flightpub.domain.repositories.IDestinationRepository;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;
import seng3150.team4.flightpub.services.AdminService;
import seng3150.team4.flightpub.services.IAuthenticationService;
import seng3150.team4.flightpub.services.IUserService;
//import seng3150.team4.flightpub.security.Authorized;
// wiggin out for me x2 ^^^

import java.util.Date;

@RestController
@RequiredArgsConstructor
//@Authorized(allowedRoles = { UserRole.ADMINISTRATOR })
// wiggin out for me ^^^

public class AdminController {

    private final IDestinationRepository destinationRepository;
    private final IAirlineRepository airlineRepository;
    private final IFlightRepository flightRepository;

    @PostMapping(path = "/covidUpdate")
    public Destination updateCovid(Destination destination) {
        Destination savedDestination = destinationRepository.save(destination);
        return savedDestination;
    }

    @PostMapping(path = "/airlineUpdate")
    public Airline updateAirline(Airline airline) {
        Airline savedAirline = airlineRepository.save(airline);
        return savedAirline;
    }

    @PostMapping(path = "/flightUpdate")
    public Flight cancelFlight(Flight flight) {
        Flight canceledFlight = flightRepository.save(flight);
        return canceledFlight;
    }

}
