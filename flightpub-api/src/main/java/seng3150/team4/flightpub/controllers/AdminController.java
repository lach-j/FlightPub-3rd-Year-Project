package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import seng3150.team4.flightpub.controllers.responses.StatusResponse;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

@RestController
@RequiredArgsConstructor
@Authorized(allowedRoles = { UserRole.ADMINISTRATOR })

public class AdminController {

    private final ICovidRepository destinationRepository;
    private final ISponsorRepository airlineRepository;
    private final ICanceledRepository flightRepository;
    private final IUserRepository userRepository;
    private final IFlightRepository compareRepository;


    @PostMapping(path = "/getCovid")
    public Response getCovidLocations() {
        var locations = new ArrayList<CovidDestinations>() {};

        // Convert Iterable to List
        destinationRepository.findAll().forEach(locations::add);

        return new EntityCollectionResponse<CovidDestinations>(locations);
    }

    @PostMapping(path = "/getUsers")
    public Response getUsers() {
        var users = new ArrayList<User>() {};

        // Convert Iterable to List
        userRepository.findAll().forEach(users::add);

        return new EntityCollectionResponse<User>(users);
    }

    @PostMapping(path = "/getCanceledFlights")
    public Response getCanceledFlights() {
        var cannedflights = new ArrayList<CanceledFlights>() {};
        var flights = new ArrayList<Flight>(){};
        // Convert Iterable to List
        flightRepository.findAll().forEach(cannedflights::add);
        compareRepository.findAll().forEach(flights::add);

//        return new EntityCollectionResponse<Flight>(flights.retainAll(cannedflights));
        return new EntityCollectionResponse<CanceledFlights>(cannedflights);
    }


    @PostMapping(path = "/covidUpdate")
    public CovidDestinations updateCovid(String destination, LocalDateTime covidEndDate, LocalDateTime covidStartDate) {
//        CovidDestinations newDestination = new CovidDestinations();
//        newDestination.setCovidEndDate(covidEndDate);
//        newDestination.setCovidStartDate(covidStartDate);
//        newDestination.setDestinations(destination);
//        CovidDestinations savedDestination  = destinationRepository.save(newDestination);
//        return savedDestination; commented out so that it compiles TODO this bit needs fixing
        return new CovidDestinations();
    }

    @PostMapping(path = "/airlineUpdate")
    public SponsoredAirlines updateAirline(SponsoredAirlines airline) {
//        todo get todays date and

        SponsoredAirlines savedAirline = airlineRepository.save(airline);
        return savedAirline;
    }

    @PostMapping(path = "/flightUpdate")
    public CanceledFlights cancelFlight(CanceledFlights flight) {
        CanceledFlights canceledFlight = flightRepository.save(flight);
        return canceledFlight;
    }

    @Authorized
    @DeleteMapping("/deleteCancelFlight")
    public StatusResponse deleteCanceledFlight(@PathVariable Long id) {
        var canceledFlight = flightRepository.getById(id);
        flightRepository.delete(canceledFlight);
        return new StatusResponse(HttpStatus.OK);
    }

    @Authorized
    @DeleteMapping("/deleteCovidDestination")
    public StatusResponse deleteCovidDestination(@PathVariable Long id) {
        var covidDestination = destinationRepository.getById(id);
        destinationRepository.delete(covidDestination);
        return new StatusResponse(HttpStatus.OK);
    }

    @Authorized
    @DeleteMapping("/deleteSponsoredAirline")
    public StatusResponse deleteSponsoredAirline(@PathVariable Long id) {
        var sponsoredAirline = airlineRepository.getById(id);
        airlineRepository.delete(sponsoredAirline);
        return new StatusResponse(HttpStatus.OK);
    }

}
