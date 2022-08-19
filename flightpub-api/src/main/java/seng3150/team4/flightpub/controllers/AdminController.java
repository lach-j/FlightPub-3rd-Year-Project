package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.AddCovidRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.*;
import seng3150.team4.flightpub.domain.repositories.*;
import seng3150.team4.flightpub.security.Authorized;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.ZoneOffset;

@RestController
@RequiredArgsConstructor
@Authorized(allowedRoles = { UserRole.ADMINISTRATOR })
@RequestMapping("/admin")
public class AdminController {

    private final ICovidRepository covidRepository;
    private final ISponsorRepository airlineRepository;
    private final ICanceledRepository flightRepository;
    private final IDestinationRepository destinationRepository;


    @GetMapping(path = "/covid")
    public Response getCovidLocations() {
        return new EntityCollectionResponse<>(covidRepository.findAll());
    }

    @GetMapping(path = "/canceled-flights")
    public Response getCanceledFlights() {
        return new EntityCollectionResponse<>(flightRepository.findAll());
    }


    @PostMapping(path = "/covid")
    public EntityResponse<CovidDestination> updateCovid(@RequestBody AddCovidRequest covidRequest) {
        covidRequest.validate();


        var covidListing = new CovidDestination();
        covidListing.setCovidStartDate(LocalDate.now(ZoneOffset.UTC));
        covidListing.setCovidEndDate(covidRequest.getRestrictionDuration());

        var destination = destinationRepository.findById(covidRequest.getLocationCode());

        if (destination.isEmpty()) {
            throw new EntityNotFoundException(String.format("Destination %s was not found.", covidRequest.getLocationCode()));
        }

        covidListing.setDestination(destination.get());

        var savedListing = covidRepository.save(covidListing);
        return new EntityResponse<>(savedListing);
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
    @DeleteMapping("/covid/{entityId}")
    public StatusResponse deleteCovidDestination(@PathVariable Long entityId) {
        var covidDestination = covidRepository.getById(entityId);
        covidRepository.delete(covidDestination);
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
