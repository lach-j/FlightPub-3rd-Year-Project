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

import java.util.Date;

@RestController
@RequiredArgsConstructor



public class AdminController {

    private final IDestinationRepository destinationRepository;
    private final IAirlineRepository airlineRepository;
    private final IFlightRepository flightRepository;

    @PostMapping(path = "/book")

    public Destination updateCovid(Destination destination) {
        Destination savedDestination = destinationRepository.save(destination);
        return savedDestination;
    }

    public Airline updateAirline(Airline airline) {
        Airline savedAirline = airlineRepository.save(airline);
        return savedAirline;
    }

    public Flight cancelFlight(Flight flight) {
        Flight canceledFlight = flightRepository.save(flight);
        return canceledFlight;
    }

}
