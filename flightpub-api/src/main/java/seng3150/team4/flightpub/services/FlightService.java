package seng3150.team4.flightpub.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.core.search.KnownSearchStrategy;
import seng3150.team4.flightpub.core.search.SearchStrategy;
import seng3150.team4.flightpub.domain.models.Flight;
import seng3150.team4.flightpub.domain.repositories.IFlightRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

import static seng3150.team4.flightpub.core.validation.Validators.isNullOrEmpty;

@Service
@RequiredArgsConstructor
public class FlightService implements IFlightService {
    @PersistenceContext
    private EntityManager em;
    private final IFlightRepository flightRepo;

    public List<Flight> searchFlights(FlightQueryRequest query) {
        var strategy = resolveSearchStrategy(query).setEntityManager(em);
        return strategy.search();
    }
    public List<Flight> getCheapestFlights(String departure) {
        return flightRepo.getCheapestFlightsFromDest(departure);
    }

    private static SearchStrategy resolveSearchStrategy(FlightQueryRequest query) {
        if (
                !isNullOrEmpty(query.getDepartureDate())
                        && !isNullOrEmpty(query.getDepartureCode())
                        && !isNullOrEmpty(query.getDestinationCode())
                        && !isNullOrEmpty(query.getTickets())
                        && !isNullOrEmpty(query.getReturnFlight())
        ) {
            return new KnownSearchStrategy(query);
        } else {
            throw new UnsupportedOperationException("This method of search is not implemented");
        }
    }
}
