package seng3150.team4.flightpub.core.search;

import seng3150.team4.flightpub.controllers.requests.FlightQueryRequest;
import seng3150.team4.flightpub.domain.models.Flight;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class KnownSearchStrategy extends SearchStrategy {

    public KnownSearchStrategy(FlightQueryRequest flightQuery) {
        super(flightQuery);
    }

    @Override
    public List<Flight> search() {
        List<Predicate> predicates = new ArrayList<>(){};
        if (flightQuery.getDepartureDate() != null) {
            predicates.add(cb.greaterThan(flight.get("departureTime"), flightQuery.getDepartureDate().getMinDateTime()));
            predicates.add(cb.lessThan(flight.get("departureTime"), flightQuery.getDepartureDate().getMaxDateTime()));
        }

        if (flightQuery.getDepartureCode() != null)
            predicates.add(cb.equal(flight.get("departureCode"), flightQuery.getDepartureCode()));

        if (flightQuery.getDestinationCode() != null)
            predicates.add(cb.equal(flight.get("destinationCode"), flightQuery.getDestinationCode()));


        query.where(cb.and(predicates.toArray(new Predicate[0])));
        return getResults();
    }
}
