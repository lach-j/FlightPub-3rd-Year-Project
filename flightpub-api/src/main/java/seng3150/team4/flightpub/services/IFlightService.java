package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.domain.models.Flight;

import java.util.List;

public interface IFlightService {
    List<Flight> searchFlights(FlightQueryRequest request);

    List<Flight> getCheapestFlights(String destination);
}
