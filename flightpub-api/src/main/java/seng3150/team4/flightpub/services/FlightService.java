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
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FlightService implements IFlightService {

  @PersistenceContext private EntityManager em;
  private final IFlightRepository flightRepository;

  // Searches flights by resolving the search strategy from the request
  public List<Flight> searchFlights(FlightQueryRequest query) {
    var strategy = resolveSearchStrategy(query).setEntityManager(em);
    return strategy.search();
  }

  // Returns the cheapest 3 future flights from the provided departure code
  public List<Flight> getCheapestFlights(String departure) {
    return flightRepository.getCheapestFlightsFromDest(departure);
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
    return new ArrayList<>(flightRepository.findAllById(flightIds));
  }

	@Override
	public Flight getFlightById(long id) {
	  var flight = flightRepository.findById(id);
	  if (flight.isEmpty())
		  throw new EntityNotFoundException(String.format("Flight with id %d was not found", id));
		return flight.get();
	}

  @Override
  public Flight setFlightCancelled(long id, boolean setCancelled) {
    var flight = getFlightById(id);
    flight.setCancelled(setCancelled);
    return flightRepository.save(flight);
  }

  private static SearchStrategy resolveSearchStrategy(FlightQueryRequest query) {
    return new KnownSearchStrategy(query);
  }
}
