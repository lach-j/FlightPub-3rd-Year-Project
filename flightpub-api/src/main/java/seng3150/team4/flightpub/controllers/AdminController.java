package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.AddCovidRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.domain.models.CovidDestination;
import seng3150.team4.flightpub.domain.models.SponsoredAirline;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.domain.repositories.ICovidRepository;
import seng3150.team4.flightpub.domain.repositories.IDestinationRepository;
import seng3150.team4.flightpub.domain.repositories.ISponsorRepository;
import seng3150.team4.flightpub.security.Authorized;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.ZoneOffset;

@RestController
@RequiredArgsConstructor
@Authorized(allowedRoles = {UserRole.ADMINISTRATOR}) // All endpoints are restricted to admins only
@RequestMapping("/admin")
public class AdminController {

  private final ICovidRepository covidRepository;
  private final ISponsorRepository airlineRepository;
  private final IDestinationRepository destinationRepository;

  @GetMapping(path = "/covid")
  public Response getCovidLocations() {
    return new EntityCollectionResponse<>(covidRepository.findAll());
  }

  @PostMapping(path = "/covid")
  public EntityResponse<CovidDestination> updateCovid(@RequestBody AddCovidRequest covidRequest) {
    covidRequest.validate();

    var covidListing = new CovidDestination();
    covidListing.setCovidStartDate(LocalDate.now(ZoneOffset.UTC));
    covidListing.setCovidEndDate(covidRequest.getRestrictionDuration());

    var destination = destinationRepository.findById(covidRequest.getLocationCode());

    if (destination.isEmpty()) {
      throw new EntityNotFoundException(
          String.format("Destination %s was not found.", covidRequest.getLocationCode()));
    }

    covidListing.setDestination(destination.get());

    var savedListing = covidRepository.save(covidListing);
    return new EntityResponse<>(savedListing);
  }

  @DeleteMapping("/covid/{entityId}")
  public StatusResponse deleteCovidDestination(@PathVariable Long entityId) {
    var covidDestination = covidRepository.getById(entityId);
    covidRepository.delete(covidDestination);
    return new StatusResponse(HttpStatus.OK);
  }
}
