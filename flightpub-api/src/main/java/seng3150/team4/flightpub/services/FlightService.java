package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.controllers.requests.MapSearchRequest;
import seng3150.team4.flightpub.core.search.KnownSearchStrategy;
import seng3150.team4.flightpub.core.search.SearchStrategy;
import seng3150.team4.flightpub.domain.models.DestinationCount;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.awt.print.Pageable;
import java.util.List;
import java.util.Set;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Service
@RequiredArgsConstructor
public class FlightService implements IFlightService {
    @PersistenceContext
    private EntityManager em;
    private final IFlightRepository flightRepo;

    private final IFlightRepository flightRepository;

    public List<Flight> searchFlights(FlightQueryRequest query) {
        var strategy = resolveSearchStrategy(query).setEntityManager(em);
        return strategy.search();
    }
    public List<Flight> getCheapestFlights(String departure) {
        return flightRepo.getCheapestFlightsFromDest(departure);
    }

    @Override
    public List<Flight> mapSearch(String departureCode) {
        return flightRepository.findByDestination(departureCode, PageRequest.of(0, 100));
    }

    @Override
    public List<DestinationCount> destinationsCount() {
        return flightRepository.getDepartureCounts();
    }

    private static SearchStrategy resolveSearchStrategy(FlightQueryRequest query) {
        if (
                !isNullOrEmpty(query.getDepartureDate())
                        && !isNullOrEmpty(query.getDepartureCode())
                        && !isNullOrEmpty(query.getTickets())
                        && !isNullOrEmpty(query.getReturnFlight())
        ) {
            return new KnownSearchStrategy(query);
        } else {
            throw new UnsupportedOperationException("This method of search is not implemented");
        }
    }
}
