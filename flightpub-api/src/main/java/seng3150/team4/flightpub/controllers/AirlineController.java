package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import seng3150.team4.flightpub.controllers.requests.SponsorAirlineRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.EntityResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.controllers.responses.StatusResponse;
import seng3150.team4.flightpub.domain.models.Airline;
import seng3150.team4.flightpub.domain.models.SponsoredAirline;
import seng3150.team4.flightpub.domain.models.UserRole;
import seng3150.team4.flightpub.domain.repositories.IAirlineRepository;
import seng3150.team4.flightpub.domain.repositories.ISponsorRepository;
import seng3150.team4.flightpub.security.Authorized;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;

@RestController
@RequestMapping(path = "/airlines")
@RequiredArgsConstructor
public class AirlineController {

  private final IAirlineRepository airlineRepository;
  private final ISponsorRepository sponsorRepository;

  /**
   * Returns a list of all airlines in the system
   *
   * <p>{@return list of all {@code Airline}s}
   */
  @GetMapping
  public Response getAll() {
    var airlines = new ArrayList<Airline>() {};

    // Convert Iterable to List
    airlines.addAll(airlineRepository.findAll());

    return new EntityCollectionResponse<>(airlines);
  }

  @Authorized(allowedRoles = {UserRole.ADMINISTRATOR})
  @GetMapping("/sponsored")
  public EntityCollectionResponse<SponsoredAirline> getSponsoredFlights() {
    var airlines = sponsorRepository.findAll();
    return new EntityCollectionResponse<>(airlines);
  }

  @Authorized(allowedRoles = {UserRole.ADMINISTRATOR})
  @PostMapping("/{airlineCode}/sponsor")
  public Response sponsorAirline(
      @PathVariable String airlineCode, @RequestBody SponsorAirlineRequest request) {
    request.validate();

    var airline = airlineRepository.findById(airlineCode);

    if (airline.isEmpty())
      throw new EntityNotFoundException(
          String.format("Airline with id %s was not found", airlineCode));

    var sponsorListing = new SponsoredAirline();
    sponsorListing.setAirline(airline.get());

    sponsorListing.setStartDate(request.getStartDate());
    sponsorListing.setEndDate(request.getEndDate());

    return new EntityResponse<>(sponsorRepository.save(sponsorListing));
  }

  @Authorized(allowedRoles = {UserRole.ADMINISTRATOR})
  @DeleteMapping("/{sponsorId}/sponsor")
  public Response deleteAirlineSponsorship(@PathVariable Long sponsorId) {
    var listing = sponsorRepository.findById(sponsorId);

    if (listing.isEmpty())
      throw new EntityNotFoundException(
          String.format("Sponsorship with id %d was not found", sponsorId));

    sponsorRepository.delete(listing.get());

    return new StatusResponse(HttpStatus.OK);
  }
}
