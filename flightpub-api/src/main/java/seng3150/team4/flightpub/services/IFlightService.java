package seng3150.team4.flightpub.services;

import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.core.search.DestinationCount;
import seng3150.team4.flightpub.domain.models.Flight;

import java.util.List;

/** Interface to define FlightService methods */
public interface IFlightService {
  List<Flight> searchFlights(FlightQueryRequest request);

  List<Flight> mapSearch(String departureCode);

  List<DestinationCount> destinationsCount();

  List<Flight> getCheapestFlights(String destination);

  List<Flight> getFlightByIds(String ids);

  Flight getFlightById(long id);

  Flight setFlightCancelled(long id, boolean setCancelled);
}
