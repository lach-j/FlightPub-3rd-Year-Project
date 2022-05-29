package seng3150.team4.flightpub.controllers;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.controllers.responses.EntityCollectionResponse;
import seng3150.team4.flightpub.controllers.responses.Response;
import seng3150.team4.flightpub.services.IFlightService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/flights")
public class FlightController {

  private final Logger logger = LoggerFactory.getLogger(FlightController.class);
  private final IFlightService flightService;

  @GetMapping("/search")
  public Response getFlights(FlightQueryRequest req) {
    // Validate the request
    req.validate();

    // Search flights and return results
    var flightResults = flightService.searchFlights(req);
    return new EntityCollectionResponse<>(flightResults);
  }

  @GetMapping("/search/map/{departureLocation}")
  public Response mapSearch(@PathVariable String departureLocation) {

    var flightResults = flightService.mapSearch(departureLocation);
    return new EntityCollectionResponse<>(flightResults);
  }

  @GetMapping("/search/count/departure")
  public Response mapSearchCount() {

    // Count all flights departing from all locations
    var destinationsCount = flightService.destinationsCount();
    return new EntityCollectionResponse<>(destinationsCount);
  }

  @GetMapping("/recommended/{destination}")
  public Response getCheapestFlights(@PathVariable String destination) {

    // get top 3 cheapest flights departing from a destination
    var cheapest = flightService.getCheapestFlights(destination);
    return new EntityCollectionResponse<>(cheapest);
  }

  @GetMapping("/fetchById/{ids}")
  public Response getFlightById(@PathVariable String ids) {
    ids = ids;

    return new EntityCollectionResponse<>(flightService.getFlightByIds(ids));
  }
}
