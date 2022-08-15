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
import seng3150.team4.flightpub.domain.models.*;
import seng3150.team4.flightpub.domain.models.Airline;
import seng3150.team4.flightpub.domain.repositories.*;
import seng3150.team4.flightpub.services.AdminService;
import seng3150.team4.flightpub.services.IAuthenticationService;
import seng3150.team4.flightpub.services.IUserService;
import seng3150.team4.flightpub.security.Authorized;
import java.util.ArrayList;
import java.util.Date;

@RestController
@RequiredArgsConstructor
@Authorized(allowedRoles = { UserRole.ADMINISTRATOR })

public class AdminController {

    private final ICovidRepository destinationRepository;
    private final ISponsorRepository airlineRepository;
    private final ICanceledRepository flightRepository;


    @PostMapping(path = "/getCovid")
    public Response getCovidLocations() {
        var locations = new ArrayList<CovidDestinations>() {};

        // Convert Iterable to List
        destinationRepository.findAll().forEach(locations::add);

        return new EntityCollectionResponse<CovidDestinations>(locations);
    }

    @PostMapping(path = "/covidUpdate")
    public CovidDestinations updateCovid(CovidDestinations destination) {
        CovidDestinations savedDestination  = destinationRepository.save(destination);
        return savedDestination;
    }

    @PostMapping(path = "/airlineUpdate")
    public SponsoredAirlines updateAirline(SponsoredAirlines airline) {
        SponsoredAirlines savedAirline = airlineRepository.save(airline);
        return savedAirline;
    }

    @PostMapping(path = "/flightUpdate")
    public CanceledFlights cancelFlight(CanceledFlights flight) {
        CanceledFlights canceledFlight = flightRepository.save(flight);
        return canceledFlight;
    }

}
