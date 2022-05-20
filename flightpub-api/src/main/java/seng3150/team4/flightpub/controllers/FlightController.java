package seng3150.team4.flightpub.controllers;


import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
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
        req.validate();
        return new EntityCollectionResponse<>(flightService.searchFlights(req));
    }
}