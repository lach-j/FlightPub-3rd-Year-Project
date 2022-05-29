package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.core.search.DestinationCount;
import seng3150.team4.flightpub.core.search.KnownSearchStrategy;
import seng3150.team4.flightpub.core.search.SearchStrategy;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.*;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Service
@RequiredArgsConstructor
public class FlightService implements IFlightService {

  @PersistenceContext private EntityManager em;
  private final IFlightRepository flightRepo;
  private final IFlightRepository flightRepository;

  // Searches flights by resolving the search strategy from the request
  public List<Flight> searchFlights(FlightQueryRequest query) {
    var strategy = resolveSearchStrategy(query).setEntityManager(em);
    return strategy.search();
  }

  // Returns the cheapest 3 future flights from the provided departure code
  public List<Flight> getCheapestFlights(String departure) {
    return flightRepo.getCheapestFlightsFromDest(departure);
  }

  // Returns the top 100 future flights from the provided departure code
  @Override
  public List<Flight> mapSearch(String departureCode) {
    return flightRepository.findByDestination(departureCode, PageRequest.of(0, 100));
  }

  @Override
  public List<DestinationCount> destinationsCount() {
    return flightRepository.getDepartureCounts();
  }

  @Override
  public List<Flight> getFlightByIds(String ids) {
    String[] idList = ids.split(",");
    Long[] longList = new Long[idList.length];
    for (int i = 0; i < idList.length; i++) {
      longList[i] = Long.parseLong(idList[i]);
    }
    List<Long> temp = Arrays.asList(longList);
    Set<Long> flightIds = new HashSet<>(temp);
    List<Flight> flightList = new ArrayList<Flight>();
    flightRepository.findAllById(flightIds).forEach(flightList::add);
    return flightList;
  }

  private static SearchStrategy resolveSearchStrategy(FlightQueryRequest query) {

    // If all required fields are provided then search using the KnownSearchStrategy
    if (!isNullOrEmpty(query.getDepartureDate())
        && !isNullOrEmpty(query.getDepartureCode())
        && !isNullOrEmpty(query.getTickets())
        && !isNullOrEmpty(query.getReturnFlight())) {
      return new KnownSearchStrategy(query);
    } else {
      // TODO: Implement unknown search strategies
      throw new UnsupportedOperationException("This method of search is not implemented");
    }
  }
}
