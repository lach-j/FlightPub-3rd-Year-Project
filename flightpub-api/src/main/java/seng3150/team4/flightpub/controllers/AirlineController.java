package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.domain.models.Airline;
import seng3150.team4.flightpub.domain.repositories.IAirlineRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/airlines")
@RequiredArgsConstructor
public class AirlineController {

  private final IAirlineRepository airlineRepository;

  /**
   * Returns a list of all airlines in the system
   *
   * <p>{@return list of all {@code Airline}s}
   */
  @GetMapping
  public Response getAll() {
    var airlines = new ArrayList<Airline>() {};

    // Convert Iterable to List
    airlineRepository.findAll().forEach(airlines::add);

    return new EntityCollectionResponse<List<Airline>>(airlines);
  }
}
